import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Функция для загрузки ссылок из API
    const fetchLinks = async () => {
      try {
        const response = await fetch('http://localhost:1000/api/links');
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  const toggleLinksDropdown = () => {
    setLinksDropdownOpen(!linksDropdownOpen);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="relative">
          <button 
            onClick={toggleLinksDropdown} 
            className="text-lg font-medium text-gray-300 hover:text-white transition duration-200 focus:outline-none"
          >
            Links
          </button>
          {linksDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg">
              {links.map(link => (
                <li key={link._id}>
                  <a 
                    href={link.url} 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {link.url}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">Chat*S</h1>
        <nav>
          <ul className="flex space-x-6">
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-chat" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Add Channels
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/join-chat" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Join Chat Channels
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/add-chats" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Add Chats
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="text-lg font-medium text-gray-300 hover:text-white transition duration-200"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
