import React, { useState, useEffect } from 'react';
import { joinChat } from './api'; // Импорт функции для подписки

const JoinChat = () => {
  const [chatUrls, setChatUrls] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextJoinIn, setNextJoinIn] = useState(null);
  const [totalUrls, setTotalUrls] = useState(0);

  const handleJoinChat = async () => {
    const urls = chatUrls.split(/\s+/).map(url => url.trim()).filter(url => url);
    console.log('URLs to join:', urls); // Debug line

    if (urls.length === 0) {
      setError('Please provide at least one URL.');
      return;
    }

    setError('');
    setResults([]);
    setIsLoading(true);
    setTotalUrls(urls.length);
    const retryQueue = [];

    const joinWithDelay = async (url, index) => {
      return new Promise(resolve => {
        const randomDelay = 60000 + Math.floor(Math.random() * 60000); // Случайная задержка от 1 до 2 минут
        setNextJoinIn(randomDelay / 1000);
        const countdown = setInterval(() => {
          setNextJoinIn(prev => {
            if (prev > 1) return prev - 1;
            clearInterval(countdown);
            return null;
          });
        }, 1000);

        setTimeout(async () => {
          try {
            const response = await joinChat([url]);
            setResults(prevResults => [...prevResults, { urlOrUsername: url, status: 'Success' }]);
            resolve();
          } catch (error) {
            console.error('Error joining chat:', error);
            const match = error.message.match(/A wait of (\d+) seconds is required/);
            if (match) {
              const waitTime = parseInt(match[1], 10) * 1000;
              console.log(`Adding ${url} to retry queue with wait time ${waitTime}ms`);
              retryQueue.push({ url, waitTime });
            } else {
              setResults(prevResults => [...prevResults, { urlOrUsername: url, status: 'Failed' }]);
            }
            resolve();
          }
        }, randomDelay);
      });
    };

    const joinChats = async () => {
      for (let i = 0; i < Math.min(urls.length, 15); i++) {
        await joinWithDelay(urls[i], i);
      }

      // Process retry queue
      while (retryQueue.length > 0) {
        const { url, waitTime } = retryQueue.shift();
        console.log(`Retrying ${url} after wait time ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        await joinWithDelay(url, urls.length);
      }

      setChatUrls('');
      setIsLoading(false);
    };

    joinChats();
  };

  const successCount = results.filter(result => result.status === 'Success').length;
  const totalCount = results.length;
  const successPercentage = totalUrls > 0 ? Math.round((totalCount / totalUrls) * 100) : 0;

  return (
    <div className="bg-gray-900 shadow-md rounded p-6 text-white">
      <h2 className="text-2xl font-bold text-white mb-4">Join Chat</h2>
      <div className="mb-4">
        <textarea
          placeholder="Enter Telegram chat URLs, separated by spaces or new lines"
          value={chatUrls}
          onChange={e => setChatUrls(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded mr-2 flex-grow text-white placeholder-gray-400"
          rows="4"
        />
        <button
          onClick={handleJoinChat}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Join Chat
        </button>
      </div>
      {isLoading && (
        <div className="mb-4">
          <p>Joining chats... {successPercentage}% success so far</p>
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
      {nextJoinIn && (
        <div className="mb-4">
          <p>Next join attempt in: {Math.ceil(nextJoinIn)} seconds</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {results.map((result, index) => (
          <div key={index} className={`p-2 rounded mb-2 ${result.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <p>{result.urlOrUsername}</p>
            <p>{result.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinChat;
