import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment-timezone';
import { fetchKeywords, addKeyword, deleteKeyword, fetchMessages } from '../components/api';

const Dashboard = () => {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [messagesWithKeywords, setMessagesWithKeywords] = useState([]);
  const [chatId, setChatId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage, setMessagesPerPage] = useState(10);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedKeywords = await fetchKeywords();
        setKeywords(fetchedKeywords);

        const fetchedMessages = await fetchMessages();
        filterMessages(fetchedMessages, fetchedKeywords);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const filterMessages = useCallback((messages, keywords) => {
    const filteredMessages = messages.filter(message => {
      const messageDate = moment(message.timestamp);
      const startDateTime = startDate && startTime ? moment.tz(`${startDate} ${startTime}`, 'Europe/Kiev') : null;
      const endDateTime = endDate && endTime ? moment.tz(`${endDate} ${endTime}`, 'Europe/Kiev') : null;

      return (
        (!startDateTime || messageDate.isSameOrAfter(startDateTime)) &&
        (!endDateTime || messageDate.isSameOrBefore(endDateTime)) &&
        (!filterKeyword || (message.text && message.text.includes(filterKeyword))) &&
        keywords.some(keyword => message.text && message.text.includes(keyword.keyword))
      );
    });
    setMessagesWithKeywords(filteredMessages);
  }, [startDate, startTime, endDate, endTime, filterKeyword, keywords]);

  const handleAddKeyword = useCallback(async (event) => {
    event.preventDefault();
    if (newKeyword.trim() === '') {
      console.error('Ошибка: Ключевое слово не должно быть пустым');
      return;
    }
  
    try {
      const addedKeyword = await addKeyword(newKeyword); // Передаем строку, а не объект
      setKeywords([...keywords, addedKeyword]);
      setNewKeyword('');
      filterMessages(messagesWithKeywords, [...keywords, addedKeyword]);
    } catch (error) {
      console.error('Error adding keyword:', error);
    }
  }, [newKeyword, keywords, messagesWithKeywords]);

  const handleDeleteKeyword = useCallback(async (id) => {
    try {
      await deleteKeyword(id);
      const updatedKeywords = keywords.filter(keyword => keyword._id !== id);
      setKeywords(updatedKeywords);
      filterMessages(messagesWithKeywords, updatedKeywords);
    } catch (error) {
      console.error('Error deleting keyword:', error);
    }
  }, [keywords, messagesWithKeywords]);

  const handleFilter = useCallback(async () => {
    const query = new URLSearchParams();
    if (chatId) query.append('chatId', chatId);
    if (startDate && endDate) {
      query.append('startDate', startDate);
      query.append('endDate', endDate);
    }
    if (filterKeyword) query.append('keyword', filterKeyword);

    const filteredMessages = await fetchMessages(query.toString());
    filterMessages(filteredMessages, keywords);
  }, [chatId, startDate, endDate, filterKeyword, keywords]);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messagesWithKeywords.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-gray-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Dashboard
          </h2>
          <p className="text-gray-400 text-lg">Monitor and manage your keywords and messages</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Keywords', value: keywords.length, color: 'from-blue-500 to-blue-600' },
            { label: 'Total Messages', value: messagesWithKeywords.length, color: 'from-purple-500 to-purple-600' },
            { label: 'Active Filters', value: filterKeyword ? '1' : '0', color: 'from-pink-500 to-pink-600' }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Keywords Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 w-2 h-8 rounded mr-3"></span>
              Keywords Management
            </h3>
            
            {/* Keywords Grid */}
            <div className="grid gap-4 mb-8">
              {keywords.map((keyword) => (
                <div key={keyword._id} 
                     className="group relative bg-gray-700/50 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative flex justify-between items-center">
                    <span className="text-white font-medium">{keyword.keyword}</span>
                    <div className="flex items-center space-x-4">
                      <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                        {keyword.count} matches
                      </span>
                      <button
                        onClick={() => handleDeleteKeyword(keyword._id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Keyword Form */}
            <form onSubmit={handleAddKeyword} className="flex gap-4">
              <input
                type="text"
                placeholder="Add a new keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Keyword
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Filters Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-2 h-8 rounded mr-3"></span>
              Advanced Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">Chat ID</label>
                <input
                  type="text"
                  placeholder="Enter chat ID"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  className="w-full bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">Start Date & Time</label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">End Date & Time</label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Filter by keyword"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                className="flex-1 bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
              <button
                onClick={handleFilter}
                className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Apply Filters
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <div className="space-y-6">
              {currentMessages.map((message, index) => (
                <div key={index} className="group relative bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                          {message.sender?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                          {message.userId}
                        </span>
                        <span className="text-sm text-gray-400">{message.sender}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm text-gray-300 text-sm border border-gray-700/50">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {moment.tz(message.timestamp, 'Europe/Kiev').format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                  <p className="relative mt-4 text-gray-300 pl-16 leading-relaxed">
                    {message.text}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors duration-300">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === 1 
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {currentPage !== 1 && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                )}
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </span>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-xl bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white">
                  <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Page {currentPage}
                  </span>
                </div>
                <div className="text-gray-400">
                  of {Math.ceil(messagesWithKeywords.length / messagesPerPage)}
                </div>
              </div>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastMessage >= messagesWithKeywords.length}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  indexOfLastMessage >= messagesWithKeywords.length
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                {indexOfLastMessage < messagesWithKeywords.length && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                )}
                <span className="relative flex items-center">
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;