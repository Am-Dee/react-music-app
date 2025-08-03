// App.jsx
import './App.css';
import React, { useState } from 'react';
import axios from './api';
import UserTable from './components/UserTable';
import MusicTable from './components/MusicTable';
// import axios from 'axios';

function App() {
  const [view, setView] = useState('');
  const [users, setUsers] = useState([]);
  const [music, setMusic] = useState([]);
  const [userSelect, setUserSelect] = useState('');
  const [musicSelect, setMusicSelect] = useState('');
  // const axioss = axios.create({
  //   baseURL: 'http://localhost:5000'
  // });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data);
      setView('users');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMusic = async () => {
    try {
      const res = await axios.get('/music');
      setMusic(res.data);
      setView('music');
    } catch (error) {
      console.error('Error fetching music:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleDeleteMusic = async (musicId) => {
    try {
      await axios.delete(`/music/${musicId}`);
      setMusic((prev) => prev.filter((track) => track._id !== musicId));
    } catch (err) {
      console.error('Error deleting music:', err);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const res = await axios.put(`/users/${updatedUser._id}`, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? res.data : u))
      );
    } catch (error) {
      console.error('Edit user error:', error);
    }
  };

  const handleEditMusic = async (updatedTrack) => {
    try {
      const res = await axios.put(`/music/${updatedTrack._id}`, updatedTrack);
      setMusic((prev) =>
        prev.map((t) => (t._id === updatedTrack._id ? res.data : t))
      );
    } catch (error) {
      console.error('Edit music error:', error);
    }
  };

  const handleUserChange = (e) => {
    const value = e.target.value;
    setUserSelect(value);
    if (value === 'all') {
      fetchUsers();
      setUserSelect('');
    }
  };

  const handleMusicChange = (e) => {
    const value = e.target.value;
    setMusicSelect(value);
    if (value === 'all') {
      fetchMusic();
      setMusicSelect('');
    }
  };

  return (
    <div className="admin-dashboard">
      <section className="dropdown-section">
        <div className="dropdowns">
          <img src="admin.png" alt="Users" />
          <p>Users</p>
          <select value={userSelect} onChange={handleUserChange}>
            <option value="">Select</option>
            <option value="all">All Users</option>
          </select>
        </div>
        <div className="dropdowns">
          <img src="musicediting.png" alt="Music" />
          <p>Music</p>
          <select value={musicSelect} onChange={handleMusicChange}>
            <option value="">Select</option>
            <option value="all">All Music</option>
          </select>
        </div>
      </section>

      <section className="content-section">
        <h1>Admin Dashboard</h1>
        <h1>
          {view === 'users'
            ? 'Users Section'
            : view === 'music'
              ? 'Music Section'
              : 'Admin Dashboard'}
        </h1>
        <div className="display-section">
          {view === 'users' && (
            <UserTable
              data={users}
              onDelete={handleDeleteUser}
              onEdit={handleEditUser}
            />
          )}
          {view === 'music' && (
            <MusicTable
              data={music}
              onDelete={handleDeleteMusic}
              onEdit={handleEditMusic}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
