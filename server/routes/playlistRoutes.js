const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
// CREATE
router.use((req, res, next) => {
  console.log(`[PlaylistRoutes] ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    const newPlaylist = new Playlist({ name });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});
// Example route: POST /api/playlists/add-to-playlist
router.post('/add-to-playlist', async (req, res) => {
  const { playlistId, songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).send('Playlist not found');

    // Avoid duplicates
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
    }

    // If no coverImage, set it using the song's imagePath
    if (!playlist.coverImage) {
      const song = await Song.findById(songId);
      if (song && song.imagePath) {
        playlist.coverImage = `http://localhost:5000/${song.imagePath}`;
      }
    }

    await playlist.save();
    res.status(200).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET ALL
router.get('/:id/songs', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist.songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlist songs' });
  }
});

router.put('/:id/remove-song', async (req, res) => {
  console.log('HIT REMOVE SONG ROUTE', req.params.id, req.body.songId);
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    console.log('Before removal:', playlist.songs);

    const songId = req.body.songId.toString();
    playlist.songs = playlist.songs.filter(sid => sid.toString() !== songId);

    console.log('After removal:', playlist.songs);

    await playlist.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to remove song from playlist' });
  }
});

router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs').sort({ createdAt: -1 });

    const modifiedPlaylists = playlists.map(playlist => {
      const lastSong = playlist.songs.length > 0 ? playlist.songs[playlist.songs.length - 1] : null;
      return {
        _id: playlist._id,
        name: playlist.name,
        coverImage: lastSong ? lastSong.imagePath : null, // 👈 show latest song image
        songsCount: playlist.songs.length
      };
    });

    res.json(modifiedPlaylists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});


// GET songs for a specific playlist



// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updated = await Playlist.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});


// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});


module.exports = router;
