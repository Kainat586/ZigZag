const express = require('express');
const multer = require('multer');
const path = require('path');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const router = express.Router();

// Define storage
const audioPath = path.join(__dirname, '../uploads/audio');
const imagePath = path.join(__dirname, '../uploads/images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, audioPath);
    } else if (file.fieldname === 'image') {
      cb(null, imagePath);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage });

// Upload route
router.post('/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const audioFile = req.files['audio'][0];
    const imageFile = req.files['image'][0];

    if (!audioFile || !imageFile) {
      return res.status(400).json({ error: 'Missing files' });
    }

    const newSong = new Song({
      title,
      artist,
      imagePath: `uploads/images/${imageFile.filename}`,
      audioPath: `uploads/audio/${audioFile.filename}`
    });

    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error('Error uploading song:', error);
    res.status(500).json({ error: 'Failed to upload song' });
  }
});

// Get songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    console.log('Songs retrieved from DB:', songs);
    res.json(songs);
  } catch (error) {
    console.error('Error retrieving songs:', error);
    res.status(500).json({ error: 'Failed to retrieve songs' });
  }
});
router.put('/favourites/toggle', async (req, res) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    song.isFavourite = !song.isFavourite;
    await song.save();

    res.json({ message: song.isFavourite ? 'Marked as favourite' : 'Removed from favourites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle favourite' });
  }
});

router.put('/favourites/add', async (req, res) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    song.isFavourite = true;
    await song.save();
    res.json({ message: 'Song marked as favourite' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as favourite' });
  }
});

// ✅ Unmark favourite
router.put('/favourites/remove', async (req, res) => {
  try {
    const { songId } = req.body;
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    song.isFavourite = false;
    await song.save();
    res.json({ message: 'Song removed from favourites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unmark favourite' });
  }
});

// ✅ Get all favourite songs
router.get('/favourites', async (req, res) => {
  try {
    const favSongs = await Song.find({ isFavourite: true });
    res.json(favSongs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get favourites' });
  }
});

// Add song to existing playlist
// router.post('/playlists/:playlistId/add-song', async (req, res) => {
//   const { playlistId } = req.params;
//   const { song } = req.body;
//   const playlist = await Playlist.findById(playlistId);
//   playlist.songs.push(song);
//   await playlist.save();
//   res.json({ success: true, message: 'Song added to playlist' });
// });
module.exports = router;
