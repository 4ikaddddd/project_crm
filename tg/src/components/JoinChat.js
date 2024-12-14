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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/20 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"></div>
          <h2 className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Join Chats
          </h2>
          <p className="text-gray-400 text-lg">Join multiple Telegram chats automatically</p>
        </div>

        {/* Main Form Section */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            <div className="space-y-6">
              {/* Input Area */}
              <div>
                <textarea
                  placeholder="Enter Telegram chat URLs, separated by spaces or new lines"
                  value={chatUrls}
                  onChange={e => setChatUrls(e.target.value)}
                  className="w-full bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 min-h-[120px]"
                  rows="4"
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleJoinChat}
                  disabled={isLoading}
                  className="relative group overflow-hidden px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 
                           hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="relative flex items-center gap-2 text-white font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 4v16m8-8H4"/>
                    </svg>
                    Join Chats
                  </span>
                </button>
              </div>

              {/* Progress Section */}
              {isLoading && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-400">{successPercentage}% Complete</span>
                  </div>
                  <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${successPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timer Section */}
              {nextJoinIn && (
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span className="text-gray-300">
                      Next join attempt in: <span className="text-blue-400 font-medium">{Math.ceil(nextJoinIn)}</span> seconds
                    </span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-red-400">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Results
              </h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-xl p-4 border transition-all duration-300 ${
                      result.status === 'Success'
                        ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                        : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg 
                          className={`w-5 h-5 ${result.status === 'Success' ? 'text-green-400' : 'text-red-400'}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          {result.status === 'Success' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M5 13l4 4L19 7"/>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M6 18L18 6M6 6l12 12"/>
                          )}
                        </svg>
                        <span className="text-gray-300 font-medium">{result.urlOrUsername}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        result.status === 'Success'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinChat;