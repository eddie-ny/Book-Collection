const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true }, // Reference Genre model
  copies_left: { type: Number, required: true },
});

module.exports = mongoose.model('Book', bookSchema);

