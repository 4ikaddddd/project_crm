import React, { useState, useEffect } from 'react';
import { getChatList, addChat, removeChat } from '../components/api';

const AddChats = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [chatUrls, setChatUrls] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedCount, setAddedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    getChatList().then((data) => {
      console.log("Fetched Chats: ", data); // Лог для проверки данных
      setChats(data);
    }).catch(error => {
      console.error("Error fetching chats: ", error); // Лог ошибок
    });

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddChats = async () => {
    const urls = chatUrls.split('\n').map(url => url.trim()).filter(url => url);
    if (urls.length === 0) {
      console.warn("No valid URLs provided");
      return;
    }

    setTotalCount(urls.length);
    setAddedCount(0);
    setTimeElapsed(0);

    // Отправляем данные в правильном формате
    const newChatsArray = [];
    for (const url of urls) {
      try {
        const newChat = await addChat({ urlOrUsername: url, isPrivate });
        newChatsArray.push(newChat);
        setAddedCount(prev => prev + 1);
        console.log("New Chat Created: ", newChat); // Лог для проверки нового чата
        await new Promise(resolve => setTimeout(resolve, 2000)); // Задержка 2 секунды
      } catch (error) {
        console.error("Error creating chat: ", error); // Лог ошибок
      }
    }

    setChats([...chats, ...newChatsArray.flat()]);
    setChatUrls('');
    setIsPrivate(false);
  };

  const handleRemoveChat = (id) => {
    removeChat(id).then(() => {
      console.log("Chat Deleted: ", id); // Лог для проверки удаления чата
      setChats(chats.filter(chat => chat._id !== id));
    }).catch(error => {
      console.error("Error deleting chat: ", error); // Лог ошибок
    });
  };

  const handleToggleShowChats = () => {
    setShowChats(!showChats);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedChats = chats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const successPercentage = totalCount > 0 ? Math.round((addedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"></div>
          <h2 className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Add Chats
          </h2>
          <p className="text-gray-400 text-lg">Manage and monitor your Telegram chats</p>
        </div>

        {/* Control Panel */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleToggleShowChats}
                className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                <span className="relative text-white font-medium flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d={showChats ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                  {showChats ? 'Hide Chats' : 'Show Chats'}
                </span>
              </button>

              {showChats && (
                <div className="flex items-center gap-4">
                  <label className="text-gray-400">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-2 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  >
                    {[5, 10, 20].map(num => (
                      <option key={num} value={num}>{num} items</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chats List */}
        {showChats && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <div className="space-y-4">
                {paginatedChats.map(chat => (
                  <div key={chat._id} 
                       className="group relative bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0" onClick={() => onSelectChat(chat)}>
                        <h3 className="text-lg font-medium text-white truncate">{chat.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <a href={chat.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-400 hover:text-blue-300 transition-colors duration-300 truncate">
                            {chat.link}
                          </a>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            chat.isPrivate 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {chat.isPrivate ? 'Private' : 'Public'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveChat(chat._id)}
                        className="relative group/delete flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-red-400 group-hover/delete:text-red-300 transition-colors duration-300" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 1 
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                  }`}
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50">
                  Page {currentPage}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= chats.length}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentPage * itemsPerPage >= chats.length
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Chats Form */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div className="space-y-6">
              <textarea
                placeholder="Enter Telegram chat URLs, one per line"
                value={chatUrls}
                onChange={e => setChatUrls(e.target.value)}
                className="w-full bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 min-h-[120px]"
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={e => setIsPrivate(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="w-10 h-6 bg-gray-700/50 rounded-full transition-colors duration-300 
                                group-hover:bg-gray-600/50 border border-gray-600/50">
                      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                        isPrivate 
                          ? 'translate-x-4 bg-purple-400' 
                          : 'translate-x-0 bg-gray-400'
                      }`}></div>
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    Private Chats
                  </span>
                </label>

                <button
                  onClick={handleAddChats}
                  disabled={loading}
                  className="relative group overflow-hidden px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 
                           hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                >
                  <span className="relative flex items-center gap-2 text-white font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Chats
                  </span>
                </button>
              </div>
            </div>

            {/* Progress Section */}
            {totalCount > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time elapsed: {timeElapsed} seconds</span>
                  <span className="text-gray-400">Progress: {addedCount} / {totalCount}</span>
                </div>
                <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${successPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="text-center text-sm font-medium text-white">
                  {successPercentage}% Complete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChats;