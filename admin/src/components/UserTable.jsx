import React, { useState } from 'react';

const UserTable = ({ data, onDelete, onEdit }) => {
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({ name: '', email: '' });

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditedUser({ name: user.name, email: user.email });
  };

  const handleSave = () => {
    onEdit({ ...editedUser, _id: editUserId }); // Call parent handler
    setEditUserId(null); // Exit edit mode
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Email</th><th>Name</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user._id}>
            {editUserId === user._id ? (
              <>
                <td>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={() => setEditUserId(null)}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => onDelete(user._id)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
