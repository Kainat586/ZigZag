// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onHomeClick, onFavouritesClick, active }) => {
  return (
    <div className="sidebar">
      <h2>🎵 MusicVibe</h2>
      <ul>
        <li onClick={onHomeClick} className={active === 'home' ? 'active' : ''}>🏠 Home</li>
        {/* <li>🔍 Search</li> */}
        <li onClick={onFavouritesClick} className={active === 'favourites' ? 'active' : ''}>❤️ Favorites</li>
        {/* <li>⚙️ Settings</li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
