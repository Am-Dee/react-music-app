import React, { useState, useEffect } from 'react';

const UploadMusic = () => {
  const [file, setFile] = useState(null);
  const [musicList, setMusicList] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) fetchMusicList();
  };

  const fetchMusicList = async () => {
    const res = await fetch('http://localhost:5000/music');
    const data = await res.json();
    setMusicList(data);
  };

  useEffect(() => {
    fetchMusicList();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Music</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Available Songs</h3>
      <ul>
        {musicList.map((song) => (
          <li key={song._id}>
            <audio controls>
              <source src={`http://localhost:5000/music/${song.filename}`} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadMusic;
