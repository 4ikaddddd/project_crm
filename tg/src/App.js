import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AddChat from './pages/AddChat';
import JoinChat from './components/JoinChat'; // Імпорт нового компонента
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import AddChats from './pages/AddChats';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="bg-background min-h-screen">
        <Header isAuthenticated={isAuthenticated} />
        <div className="">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-chat"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AddChat onSelectChat={setSelectedChat} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/join-chat"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <JoinChat />
                </ProtectedRoute>
              }
            />
             <Route
              path="/add-chats"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AddChats onSelectChat={setSelectedChat} />
                  
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
