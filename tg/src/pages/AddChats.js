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
    <div className="bg-gray-900 shadow-md rounded p-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Add Chat</h2>
      <div className="mb-4">
        <button
          onClick={handleToggleShowChats}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          {showChats ? 'Hide Chats' : 'Show Chats'}
        </button>
        {showChats && (
          <div className="mt-4">
            <label className="mr-2">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-600 bg-gray-800 p-2 rounded text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        )}
      </div>
      {showChats && (
        <>
          <ul className="space-y-2">
            {paginatedChats.map(chat => (
              <li
                key={chat._id}
                className="cursor-pointer hover:bg-gray-700 p-2 rounded flex justify-between items-center"
              >
                <span onClick={() => onSelectChat(chat)}>
                  {chat.name} - <a href={chat.link} target="_blank" rel="noopener noreferrer">{chat.link}</a> ({chat.isPrivate ? 'Private' : 'Public'})
                </span>
                <button
                  onClick={() => handleRemoveChat(chat._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= chats.length}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
            >
              Next
            </button>
          </div>
        </>
      )}
      <div className="mt-4 flex items-center">
        <textarea
          placeholder="Enter Telegram chat URLs, one per line"
          value={chatUrls}
          onChange={e => setChatUrls(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 flex-grow text-white placeholder-gray-400"
          rows="4"
        />
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={e => setIsPrivate(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-800 border-gray-600"
          />
          <span className="ml-2">Private</span>
        </label>
        <button
          onClick={handleAddChats}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Chats
        </button>
      </div>
      {totalCount > 0 && (
        <div className="mt-4">
          <p>Time elapsed: {timeElapsed} seconds</p>
          <p>Chats added: {addedCount} / {totalCount}</p>
          <div className="w-full bg-gray-600 rounded-full">
            <div
              className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${successPercentage}%` }}
            >
              {successPercentage}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddChats;
