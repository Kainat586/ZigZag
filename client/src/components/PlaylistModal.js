// PlaylistModal.js
import React, { useState } from 'react';

const PlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    try {
      await onCreate(name); // ⬅️ use prop passed from Home
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bg-black bg-opacity-80 top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded shadow-lg w-80 relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl">×</button>
        <h2 className="text-lg mb-3">Create Playlist</h2>
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleCreate} className="mt-4 bg-green-600 px-4 py-2 rounded w-full">Create</button>
      </div>
    </div>
  );
};

export default PlaylistModal;
