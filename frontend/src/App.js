import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/Sidebar.css';
import Intro from './components/Intro';
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  const [start, setstart] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setstart(false);
    }, 4000);
  }, []);


  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  return (
    <>
      {start ? (
        <Intro />
      ) : (
        <PlaylistProvider>
          <Routes>
            <Route path="/*" element={<ProtectedRoute><Home theme={theme} setTheme={setTheme} /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </PlaylistProvider>
      )}
    </>
  );
}

export default App;
