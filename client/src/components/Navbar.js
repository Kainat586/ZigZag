// src/components/Navbar.js
import React from 'react';

import './Navbar.css';

const Navbar = ({ onUploadClick, onCreatePlaylistClick, onSearch }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search songs..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>


      <div className="navbar-right">
        <button className="upload-btn" onClick={onUploadClick}>Upload Song</button>
        <button className="upload-btn" onClick={onCreatePlaylistClick}>Create Playlist</button>
      </div>
    </nav>
  );
};

export default Navbar;
