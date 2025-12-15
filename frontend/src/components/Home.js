import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import Feed from '../screens/Feed';
import Favourites from '../screens/Favourites';
import Library from '../screens/Library';
import Trending from '../screens/Trending';
import Player from './Player';
import ThemeToggle from './ThemeToggle';
import '../styles/Sidebar.css';

const Home = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || '🌞');
  const [username, setUsername] = useState('');

  // Apply theme
  useEffect(() => {
    document.body.style.transition = 'all 0.4s ease-in-out';
    if (theme === '🌞') {
      document.body.style.backgroundColor = '#cdcdcd';
      document.body.style.opacity = '0.8';
      document.body.style.backgroundImage = `
        repeating-radial-gradient(circle at 0 0, transparent 0, #cdcdcd 10px),
        repeating-linear-gradient(#00033c55, #00033c)
      `;
    } else {
      document.body.style.backgroundColor = '#272727';
      document.body.style.opacity = '1';
      document.body.style.backgroundImage = `
        repeating-radial-gradient(circle at 0 0, transparent 0, #272727 16px),
        repeating-linear-gradient(#00000055, #000000)
      `;
    }
  }, [theme]);

  // Get username
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) setUsername(name);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <a href="https://dgroovemusic.netlify.app/" target="_blank" rel="noopener noreferrer">
          <img src="NavIcon.png" alt="DGroove Logo" className="profile-icon" />
        </a>
        <div className="username-display">
          <p>Welcome,</p>
          <span className="username">{username}</span>
        </div>


        <button className="toggle-theme-btn">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </button>

        <nav className="nav-links">
          <NavLink to="/" >Feed</NavLink>
          <NavLink to="/favourites">Favourites</NavLink>
          <NavLink to="/library">Library</NavLink>
          <NavLink to="/trending">Trending</NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main content + player */}
      <div className="main-content-with-player">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/library" element={<Library />} />
            <Route path="/trending" element={<Trending />} />
          </Routes>
        </main>

        {/* Persistent Music Player */}
        <div className="bottom-player">
          <Player theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default Home;
