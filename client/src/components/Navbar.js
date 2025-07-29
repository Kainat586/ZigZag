// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onUploadClick, onCreatePlaylistClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">🎵 Spotify Clone</h1>
        <Link to="/" className="nav-link">Home</Link>
      </div>

      <div className="navbar-right">
        <button className="upload-btn" onClick={onUploadClick}>Upload Song</button>
        <button className="upload-btn" onClick={onCreatePlaylistClick}>Create Playlist</button>
      </div>
    </nav>
  );
};

export default Navbar;
