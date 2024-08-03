import React, { useState, useEffect } from 'react';
import { fetchChats, createChat } from './api';

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [chatUrl, setChatUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    fetchChats().then(setChats);
  }, []);

  const handleCreateChat = () => {
    createChat(chatUrl, isPrivate).then(newChat => {
      setChats([...chats, newChat]);
      setChatUrl('');
      setIsPrivate(false);
    });
  };

  return (
    <div className="bg-gray-900 shadow-md rounded p-6 mb-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Chats</h2>
      <ul className="space-y-2">
        {chats.map(chat => (
          <li
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
          >
            {chat.url} ({chat.isPrivate ? 'Private' : 'Public'})
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="Telegram chat URL"
          value={chatUrl}
          onChange={e => setChatUrl(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 flex-grow text-white placeholder-gray-400"
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
          onClick={handleCreateChat}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Chat
        </button>
      </div>
    </div>
  );
}

export default ChatList;
