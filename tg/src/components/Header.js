import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
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
                    Join Chat_Channels
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
