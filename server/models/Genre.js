const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Optional: ensures no duplicate genres
    trim: true
  }
});

module.exports = mongoose.model('Genre', genreSchema);
