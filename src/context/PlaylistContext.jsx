import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaylistContext = createContext();

// Create a provider component
export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [message, setMessage] = useState('');

  // Add song to playlist if not already in the list
  const addToPlaylist = (song) => {
    const exists = playlist.some(item => item._id === song._id);
    if (!exists) {
      setPlaylist(prev => [...prev, song]);
      // First way message for user feedback
      toast.success(`🎵 "${song.title}" added to playlist`);

      // Second way message for UI feedback
      // setMessage(`🎵 "${song.title}" added to playlist!`);
      // setTimeout(() => setMessage(''), 3000);
    }
  };

  // Remove song from playlist by ID
  const removeFromPlaylist = (id) => {
    setPlaylist(prev => prev.filter(song => song._id !== id));
    // Optional: reset currentIndex if needed
    if (playlist[currentIndex]?._id === id) {
      setCurrentIndex(0);
    }
  };

  // Play next song in the playlist
  const playNext = () => {
    setCurrentIndex(prev => (prev + 1) % playlist.length);
  };

  // Play previous song
  const playPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <PlaylistContext.Provider value={{
      playlist,
      currentIndex,
      addToPlaylist,
      removeFromPlaylist,
      playNext,
      playPrevious,
      // message
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

// Custom hook to use playlist context
export const usePlaylist = () => useContext(PlaylistContext);

export default PlaylistContext;
