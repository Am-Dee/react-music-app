import React, { useRef, useState, useEffect } from 'react';
import { usePlaylist } from '../context/PlaylistContext';
import '../styles/Player.css';
import { ToastContainer } from 'react-toastify';

const Player = () => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  //First way to get message from context
  // const { message } = usePlaylist();

  const {
    playlist,
    currentIndex,
    removeFromPlaylist,
    playNext,
    playPrevious,
  } = usePlaylist();

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong) {
      audio.load();
      setProgress(0);
      if (isPlaying) audio.play();
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [currentSong]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newProgress = parseFloat(e.target.value);
    if (audio?.duration) {
      audio.currentTime = (newProgress / 100) * audio.duration;
      setProgress(newProgress);
    }
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <>
      {/* First way to get message from context */}
      {/* {message && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#222',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          zIndex: 9999
        }}>
          {message}
        </div>
      )} */}
      {/* Second way to get message from context */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="player-container">
        <div className="playlist-display">
          <h4>Playlist 🎧</h4>
          <ul>
            {playlist.map((song, index) => (
              <li key={song._id} className={index === currentIndex ? 'active' : ''}>
                {song.title}
                <button onClick={() => removeFromPlaylist(song._id)}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="player-controls">
          {currentSong ? (
            <>
              <audio ref={audioRef} src={currentSong.url} />
              <h5>Now Playing: {currentSong.title}</h5>

              <div className="buttons">
                <button onClick={playPrevious}>⏮️</button>
                <button onClick={() => audioRef.current.currentTime -= 10}>⏪ 10s</button>
                <button onClick={togglePlayPause}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button onClick={() => audioRef.current.currentTime += 10}>10s ⏩</button>
                <button onClick={playNext}>⏭️</button>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="progress-bar"
              />

              <div className="volume-control">
                🔊
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
                {Math.round(volume * 100)}%
              </div>
            </>
          ) : (
            <p>Select a song to play...</p>
          )}
        </div>
      </div>

    </>
  );
};

export default Player;