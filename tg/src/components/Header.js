import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('https://test3.cola-workeu.com/links/links');
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer div to prevent content from hiding under fixed header */}
      <div className="h-20" /> {/* Adjust height to match header height */}
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-gray-900/90 shadow-xl' : 'bg-gray-900'
      }`}>
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        {/* Gradient borders */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-800/0 via-violet-800/30 to-violet-800/0" />

        <div className="relative container mx-auto px-4 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Links Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setLinksDropdownOpen(!linksDropdownOpen)}
                className="px-5 py-2.5 rounded-xl text-gray-300 hover:text-white transition-all duration-300
                           bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Links
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${linksDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {linksDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 origin-top-left">
                  <div className="p-[1px] rounded-xl bg-gradient-to-r from-purple-500/50 via-violet-500/50 to-indigo-500/50">
                    <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl">
                      <ul className="py-2">
                        {links.map(link => (
                          <li key={link._id}>
                            <a
                              href={link.url}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-300"
                            >
                              <div className="p-2 rounded-lg bg-white/5">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-300">{link.url}</p>
                                <p className="text-xs text-gray-500">External Link</p>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-3xl font-black tracking-tight px-6 py-2 rounded-xl
                           bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400
                           hover:from-purple-300 hover:via-violet-300 hover:to-indigo-300 transition-all duration-300">
                Chat*S
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 flex justify-end">
              <ul className="flex items-center gap-x-2">
                {isAuthenticated ? (
                  <>
                    <NavLink to="/">Dashboard</NavLink>
                    <NavLink to="/add-chat">Add Channels</NavLink>
                    <NavLink to="/join-chat">Join Chat</NavLink>
                    <NavLink to="/add-chats">
                      <span className="flex items-center gap-2">
                        Add Chats
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                        </span>
                      </span>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-6 py-2.5 rounded-xl font-medium text-white
                               bg-gradient-to-r from-purple-500 to-violet-500 
                               hover:from-purple-400 hover:to-violet-400
                               shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
                               transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2.5 rounded-xl font-medium
                               text-gray-300 hover:text-white
                               border border-gray-700 hover:border-gray-600
                               hover:bg-gray-800 transition-all duration-300"
                    >
                      Register
                    </Link>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

// NavLink component for authenticated navigation
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2.5 rounded-xl text-gray-300 hover:text-white
               hover:bg-white/5 border border-transparent
               hover:border-white/10 transition-all duration-300"
  >
    {children}
  </Link>
);

export default Header;