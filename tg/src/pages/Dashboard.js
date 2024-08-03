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
    <div className="bg-gray-900 shadow-md rounded p-6 mb-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
      <h3 className="text-xl font-semibold text-white mb-4">Keywords</h3>
      <ul className="space-y-2 mb-4">
        {keywords.map((keyword) => (
          <li key={keyword._id} className="flex justify-between items-center">
            <span>{keyword.keyword}</span>
            <span className="text-gray-500">{keyword.count}</span>
            <button
              onClick={() => handleDeleteKeyword(keyword._id)}
              className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddKeyword} className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Add a new keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded flex-grow text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Keyword
        </button>
      </form>
      <h3 className="text-xl font-semibold text-white mb-4">Messages with Keywords</h3>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Keyword"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 text-white placeholder-gray-400"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Filter
        </button>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-700 transition duration-300'} text-white`}
        >
          Previous
        </button>
        <span className="text-white">Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastMessage >= messagesWithKeywords.length}
          className={`py-2 px-4 rounded ${indexOfLastMessage >= messagesWithKeywords.length ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-700 transition duration-300'} text-white`}
        >
          Next
        </button>
      </div>
      <ul className="space-y-2">
        {currentMessages.map((message, index) => (
          <li key={index} className={`p-4 rounded ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="flex flex-col space-y-1">
                <span className="font-bold text-yellow-400">{message.userId}</span>
                <span className="text-sm text-blue-400">{message.sender}</span>
              </div>
              <span className="text-gray-400 sm:ml-4">{moment.tz(message.timestamp, 'Europe/Kiev').format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <p className="mt-2 text-gray-300">{message.text}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`py-2 px-4 rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-700 transition duration-300'} text-white`}
        >
          Previous
        </button>
        <span className="text-white">Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastMessage >= messagesWithKeywords.length}
          className={`py-2 px-4 rounded ${indexOfLastMessage >= messagesWithKeywords.length ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-700 transition duration-300'} text-white`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
