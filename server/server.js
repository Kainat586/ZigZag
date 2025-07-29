const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/config');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlistRoutes');
// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

// ✅ CORS comes first
app.use(cors());

// ✅ Other middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Then register routes
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
