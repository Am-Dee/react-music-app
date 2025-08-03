import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        const current = (audio.currentTime / audio.duration) * 100;
        setProgress(current);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleCircleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angle = Math.atan2(y, x) + Math.PI / 2;
    const percent = ((angle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = percent * audio.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div
      className='player'
      style={{
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 0 10px #ccc',
        width: '300px',
        margin: '40px auto',
        background: '#f8f9fa',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}
    >
      <h3>🎵 Music Player</h3>
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

      {/* Circular Progress Bar */}
      <div style={{ position: 'relative', width: 150, height: 150, margin: '20px auto' }}>
        <svg width="150" height="150" onClick={handleCircleClick} style={{ cursor: 'pointer' }}>
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="#eee"
            strokeWidth="10"
          />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="#4caf50"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '1.1rem'
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          marginBottom: '15px',
          cursor: 'pointer',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#4caf50',
          color: '#fff'
        }}
      >
        {isPlaying ? '⏸ Pause' : '▶️ Play'}
      </button>

      {/* Volume Control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="volume">🔊</label>
        <input
          type="range"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={{ flex: 1 }}
        />
        <span>{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
