import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UploadModal from '../components/UploadModal';
import MusicPlayer from '../components/MusicPlayer';
import PlaylistModal from '../components/PlaylistModal';
import { useCallback } from 'react';
import axios from 'axios';
import './Home.css';
import { FaPlay, FaHeart, FaPlus, FaTrash } from 'react-icons/fa';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showFavourites, setShowFavourites] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState('');
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [editPlaylistSongs, setEditPlaylistSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = searchTerm
    ? songs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : songs;




  const fetchSongs = useCallback(async () => {
    try {
      const route = showFavourites
        ? 'http://localhost:5000/api/songs/favourites'
        : 'http://localhost:5000/api/songs';
      const res = await axios.get(route);
      setSongs(res.data);
    } catch (err) {
      console.error('Error fetching songs:', err);
    }
  }, [showFavourites]); // ✅ include showFavourites here

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/playlists');
      setPlaylists(res.data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    fetchSongs();
  };

  const handleCreatePlaylist = async (name) => {
    try {
      const res = await axios.post('http://localhost:5000/api/playlists/create', {
        name,
        songIds: []
      });
      if (res.status === 201 || res.status === 200) {
        setShowPlaylistModal(false);
        fetchPlaylists();
      }
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/playlists/${id}`);
      fetchPlaylists();
    } catch (err) {
      console.error('Error deleting playlist:', err);
    }
  };

  // const handleAddToFavourites = async (song) => {
  //   try {
  //     await axios.put('http://localhost:5000/api/songs/favourites/add', {
  //       songId: song._id,
  //     });
  //     fetchSongs();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleToggleFavourite = async (song) => {
    try {
      await axios.put('http://localhost:5000/api/songs/favourites/toggle', {
        songId: song._id,
      });

      fetchSongs(); // Refresh the songs
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  const handleAddToPlaylist = async () => {
    try {
      await axios.post('http://localhost:5000/api/playlists/add-to-playlist', {
        playlistId: selectedPlaylistId,
        songId: selectedSong._id,
      });
      setShowAddToPlaylistModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowPlaylistSongs = async (playlist) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/playlists/${playlist._id}/songs`);
      setSelectedPlaylistSongs(res.data);
      setSelectedPlaylistName(playlist.name);
    } catch (err) {
      console.error('Error fetching playlist songs:', err);
    }
  };
  const handleBackToAllSongs = () => {
    setSelectedPlaylistSongs(null);
    setSelectedPlaylistName('');
  };

  const handleOpenEditPlaylistModal = async (playlist) => {
    setEditPlaylist(playlist);
    setEditPlaylistName(playlist.name);
    try {
      const res = await axios.get(`http://localhost:5000/api/playlists/${playlist._id}/songs`);
      setEditPlaylistSongs(res.data);
    } catch (err) {
      setEditPlaylistSongs([]);
    }
    setShowEditPlaylistModal(true);
  };
  const handleCloseEditPlaylistModal = () => {
    setShowEditPlaylistModal(false);
    setEditPlaylist(null);
    setEditPlaylistName('');
    setEditPlaylistSongs([]);
  };
  const handleUpdatePlaylistName = async () => {
    if (!editPlaylist) return;
    try {
      await axios.put(`http://localhost:5000/api/playlists/${editPlaylist._id}`, { name: editPlaylistName });
      fetchPlaylists();
      handleCloseEditPlaylistModal();
    } catch (err) {
      console.error('Error updating playlist name:', err);
    }
  };
  const handleRemoveSongFromPlaylist = async (songId) => {
    // console.log("✅ Remove song route hit", req.params.id, req.body.songId);
    if (!editPlaylist) return;
    try {
      await axios.put(`http://localhost:5000/api/playlists/${editPlaylist._id}/remove-song`, {
        songId: songId
      });

      // Remove from local state for instant UI update
      setEditPlaylistSongs(editPlaylistSongs.filter(s => s._id !== songId));
      fetchPlaylists();

      if (selectedPlaylistSongs && selectedPlaylistId === editPlaylist._id) {
        setSelectedPlaylistSongs(selectedPlaylistSongs.filter(s => s._id !== songId));
      }
    } catch (err) {
      console.error('Error removing song from playlist:', err);
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, [fetchSongs]); // ✅ now no warning

  return (
    <div className="home-container">
      <Sidebar
        onHomeClick={() => setShowFavourites(false)}
        onFavouritesClick={() => setShowFavourites(true)}
        active={showFavourites ? 'favourites' : 'home'}
      />

      <div className="main-content">
        <Navbar
          onUploadClick={() => setShowUploadModal(true)}
          onCreatePlaylistClick={() => setShowPlaylistModal(true)}
          onSearch={setSearchTerm}
        />


        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={() => setShowUploadModal(false)}>✖</span>
              <h2 className="modal-title">🎵 Upload a New Song</h2>
              <UploadModal onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}
        {showPlaylistModal && (
          <PlaylistModal onCreate={handleCreatePlaylist} onClose={() => setShowPlaylistModal(false)} />
        )}




        {/* Add to Playlist Modal */}
        {showAddToPlaylistModal && (
          <div className="modal-overlay" onClick={() => setShowAddToPlaylistModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-button" onClick={() => setShowAddToPlaylistModal(false)}>✖</span>
              <h3>Select a Playlist</h3>
              <select onChange={(e) => setSelectedPlaylistId(e.target.value)}>
                <option value="">-- Select Playlist --</option>
                {playlists.map((pl) => (
                  <option key={pl._id} value={pl._id}>{pl.name}</option>
                ))}
              </select>
              <button onClick={handleAddToPlaylist}>Add</button>
            </div>
          </div>
        )}


        {/* Edit Playlist Modal */}
        {showEditPlaylistModal && editPlaylist && (
          <div className="modal-overlay" onClick={handleCloseEditPlaylistModal}>
            <div
              className="modal-content relative"
              onClick={e => e.stopPropagation()}
            >
              <span
                className="close-icon"
                onClick={handleCloseEditPlaylistModal}
              >
                ✖
              </span>




              {/* Playlist Title */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{editPlaylistName}</h2>
                {/* <button
          onClick={() => {
            const input = document.getElementById('edit-playlist-name');
            if (input) input.focus();
          }}
          className="text-yellow-400 hover:text-yellow-300 text-lg"
          title="Edit Name"
        >
          
        </button> */}
              </div>

              {/* Edit Playlist Name */}

              <div className="flex mb-4">
                <input
                  id="edit-playlist-name"
                  type="text"
                  value={editPlaylistName}
                  onChange={e => setEditPlaylistName(e.target.value)}
                  className="flex-1 p-2 rounded text-black mr-2"
                />
                <button
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleUpdatePlaylistName}
                >
                  Update
                </button>
              </div>

              {/* Songs List */}
              <h3 className="text-lg text-white mb-2">Songs in Playlist</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {editPlaylistSongs.length === 0 ? (
                  <div className="text-gray-400">No songs in this playlist.</div>
                ) : (
                  editPlaylistSongs.map(song => (
                    <div key={song._id} className="playlist-song-card">
                      <img
                        src={song.imagePath ? `http://localhost:5000/${song.imagePath}` : '/default-song.png'}
                        alt={song.title}
                        onError={e => { e.target.src = '/default-song.png'; }}
                      />
                      <div className="details">
                        <span className="title">{song.title || "Untitled"}</span>
                        <span className="artist">{song.artist || "Unknown Artist"}</span>
                      </div>
                      <span
                        className="remove-button"
                        title="Remove Song"
                        onClick={() => handleRemoveSongFromPlaylist(song._id)}
                      >
                        🗑️
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

       <section className="songs-section">
  <div className="section-header">
    <h2 className="section-title">
      🎧 {selectedPlaylistSongs ? `Playlist: ${selectedPlaylistName}` : showFavourites ? 'Favourite Songs' : 'All Songs'}
    </h2>
    {selectedPlaylistSongs && (
      <button onClick={handleBackToAllSongs}>Back to All Songs</button>
    )}
  </div>

  <div className="songs-container">
    {selectedPlaylistSongs ? (
      selectedPlaylistSongs.length === 0 ? (
        <p>No songs in this playlist.</p>
      ) : (
        selectedPlaylistSongs.map((song, index) => (
          <div key={index} className="song-card">
            <div className="song-card-img-wrap" onClick={() => setCurrentSong(song)}>
              <img src={`http://localhost:5000/${song.imagePath}`} alt={song.title} />
              <button
                className="icon-button play-icon"
                onClick={() => {
                  setPlaylist(selectedPlaylistSongs);
                  setCurrentIndex(index);
                  setCurrentSong(song);
                }}
              >
                <FaPlay />
              </button>
            </div>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        ))
      )
    ) : (
      filteredSongs.length === 0 ? (
        <p>No songs match your search.</p>
      ) : (
        filteredSongs.map((song, index) => (
          <div key={index} className="song-card">
            <div className="song-card-img-wrap" onClick={() => setCurrentSong(song)}>
              <img src={`http://localhost:5000/${song.imagePath}`} alt={song.title} />
              <button
                className="icon-button play-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSong(song);
                }}
              >
                <FaPlay />
              </button>
            </div>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
            <div className="song-actions">
              <button
                className="icon-button fav-icon"
                title={song.isFavourite ? 'Unfavourite' : 'Favourite'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavourite(song);
                }}
              >
                <FaHeart color={song.isFavourite ? 'red' : 'gray'} />
              </button>
              <button
                className="icon-button add-icon"
                title="Add to Playlist"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSong(song);
                  setShowAddToPlaylistModal(true);
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))
      )
    )}
  </div>
</section>


        {(!selectedPlaylistSongs && !showFavourites) && (
          <section className="playlist-section">
            <h2 className="section-title">🎶 Your Playlists</h2>
            <div className="songs-container playlist-grid">
              {playlists.length === 0 ? (
                <p>No playlists yet. Create one!</p>
              ) : (
                playlists.map((playlist) => (
                  <div key={playlist._id} className="song-card playlist-folder-card">
                    <div className="song-card-img-wrap playlist-folder-img" onClick={() => handleShowPlaylistSongs(playlist)}>
                      <img
                        src={
                          playlist.coverImage
                            ? `http://localhost:5000/${playlist.coverImage}`
                            : 'default-folder-icon.png'
                        }
                        alt="Playlist Cover"
                      />


                      <button className="icon-button playlist-add-icon" title="Edit Playlist" onClick={e => { e.stopPropagation(); handleOpenEditPlaylistModal(playlist); }}><FaPlus /></button>
                      <button className="icon-button playlist-del-icon" title="Delete Playlist" onClick={e => { e.stopPropagation(); handleDeletePlaylist(playlist._id); }}><FaTrash /></button>
                    </div>
                    <h3>{playlist.name}</h3>
                    <div className="playlist-meta">{playlist.songsCount} {playlist.songsCount === 1 ? 'song' : 'songs'}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}


        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playlist={playlist}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          setCurrentSong={setCurrentSong}
        />
      </div>
    </div>
  );
};

export default Home;
