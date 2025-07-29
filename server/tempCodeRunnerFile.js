// server.js or your main app file
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); // if using MongoDB
const cors = require('cors');
const songRoutes = require('./routes/songs'); // path to your file
app.use('/api/songs', songRoutes);
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dummy song data if DB not used yet
const songs = [
  {
    title: 'Let Me Love You',
    artist: 'DJ Snake',
    imagePath: 'uploads/images/letmeloveyou.jpg',
    audioPath: 'uploads/audio/letmeloveyou.mp3',
  },
];

// GET route
app.get('/api/songs', (req, res) => {
  res.json(songs); // replace this with database fetch later
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
