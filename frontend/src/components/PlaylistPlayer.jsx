import React, { useEffect, useRef } from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const PlaylistPlayer = () => {
  const { playlist, currentIndex, playNext } = usePlaylist();
  const audioRef = useRef();

  useEffect(() => {
    if (audioRef.current && playlist.length > 0) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentIndex]);

  if (playlist.length === 0) return <p>No songs in playlist</p>;

  const currentSong = playlist[currentIndex];

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Now Playing</h2>
      <img src={currentSong.cover} alt={currentSong.title} style={{ width: 200, height: 200, borderRadius: 12 }} />
      <h3>{currentSong.title}</h3>
      <p>{currentSong.artist}</p>

      <audio
        ref={audioRef}
        controls
        onEnded={playNext}
        style={{ marginTop: 20, width: '80%' }}
      >
        <source src={currentSong.url} type="audio/mpeg" />
        Your browser does not support audio.
      </audio>
    </div>
  );
};

export default PlaylistPlayer;
