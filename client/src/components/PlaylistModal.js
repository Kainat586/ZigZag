import React, { useState } from 'react';
import './PlaylistModal.css'; // for custom styling

const PlaylistModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name);
    }
  };

  return (
    <div className="playlist-modal-overlay" onClick={onClose}>
      <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Create Playlist</h2>
        <input
          type="text"
          placeholder="Enter playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="create-btn" onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default PlaylistModal;
