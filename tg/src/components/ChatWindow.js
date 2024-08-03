import React, { useState, useEffect } from 'react';
import { connectWebSocket } from './api';

function ChatWindow() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = connectWebSocket((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => ws.close();
  }, []);

  return (
    <div className="bg-gray-900 shadow-md rounded p-6 mb-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Chat Messages</h2>
      <ul className="space-y-2">
        {messages.map((message, index) => (
          <li key={index} className="border-b border-gray-700 pb-2">
            <strong className="text-blue-400">{message.sender}:</strong> {message.text}
            <em className="text-gray-500 ml-2">{new Date(message.timestamp).toLocaleTimeString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatWindow;
