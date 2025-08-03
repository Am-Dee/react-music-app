import React, { useState } from 'react';

const MusicTable = ({ data, onDelete, onEdit }) => {
  const [editId, setEditId] = useState(null);
  const [editedTrack, setEditedTrack] = useState({ title: '', artist: '' });

  const handleEditClick = (track) => {
    setEditId(track._id);
    setEditedTrack({ title: track.title, artist: track.artist });
  };

  const handleSave = () => {
    onEdit({ ...editedTrack, _id: editId }); // Call parent handler
    setEditId(null); // Exit edit mode
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Title</th><th>Artist</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((track) => (
          <tr key={track._id}>
            {editId === track._id ? (
              <>
                <td>
                  <input
                    type="text"
                    value={editedTrack.title}
                    onChange={(e) =>
                      setEditedTrack({ ...editedTrack, title: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editedTrack.artist}
                    onChange={(e) =>
                      setEditedTrack({ ...editedTrack, artist: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{track.title}</td>
                <td>{track.artist}</td>
                <td>
                  <button onClick={() => handleEditClick(track)}>Edit</button>
                  <button onClick={() => onDelete(track._id)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MusicTable;
