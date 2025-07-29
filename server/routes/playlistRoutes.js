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
router.post('/add-to-playlist', async (req, res) => {
  const { playlistId, songId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    res.json({ success: true, message: 'Song added to playlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song to playlist' });
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
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
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
