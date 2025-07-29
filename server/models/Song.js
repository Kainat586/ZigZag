const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  imagePath: String,
  audioPath: String,
  isFavourite: { type: Boolean, default: false }, // ✅ Add this
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Song', songSchema);
