import React from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const MusicCard = ({ song }) => {
  const { addToPlaylist } = usePlaylist();

  return (
    <div style={{
      width: 200,
      margin: 10,
      padding: 15,
      border: '1px solid #ddd',
      borderRadius: 10,
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      textAlign: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}>
      <img
        src={song.cover || '/default-cover.jpg'}
        alt={song.title}
        style={{
          width: '100%',
          height: 150,
          objectFit: 'cover',
          borderRadius: 8,
          marginBottom: 10
        }}
      />
      <h4 style={{ margin: '5px 0', fontSize: 16 }}>{song.title}</h4>
      <p style={{ fontSize: 14, color: '#666' }}>{song.artist}</p>
      <button
        onClick={() => addToPlaylist(song)}
        style={{
          marginTop: 10,
          backgroundColor: '#2c3e50',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          padding: '8px 12px',
          fontSize: 14,
          cursor: 'pointer'
        }}
      >
        Add to Playlist
      </button>
    </div>
  );
};

export default MusicCard;