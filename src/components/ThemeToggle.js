import React from 'react';

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === '🌞' ? '🌙' : '🌞';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
      }}
      title="Toggle Theme"
    >
      {theme === '🌞' ? '🌙' : '🌞'}
    </button>
  );
};

export default ThemeToggle;
