import React, { useEffect, useState } from 'react';
import MusicCard from '../components/MusicCard';
import '../styles/MusicSection.css'; // External CSS file

const MusicSection = ({ category, title }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/music/${category}`)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error('Error fetching songs:', err));
  }, [category]);

  return (
    <div className="music-section">
      <h2 className="section-title">{title}</h2>
      <div className="music-grid">
        {songs.map(song => (
          <MusicCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default MusicSection;
