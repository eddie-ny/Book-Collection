const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Genre = require('../models/Genre');




// GET /genres: Fetch all genres
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// GET /genres/:id: Fetch a specific genre by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    res.json(genre);
  } catch (err) {
    console.error('Error fetching genre:', err);
    res.status(500).json({ error: 'Error fetching genre' });
  }
});


// POST /genres: Add a new genre
router.post('/', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Genre name is required' });
    }

    try {
        const newGenre = new Genre({ name });
        await newGenre.save();
        res.status(201).json(newGenre);
    } catch (err) {
        console.error('Error adding genre:', err);
        res.status(400).json({ error: 'Failed to add genre' });
    }
});




// PUT /genres/:id: Update an existing genre
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Genre name is required' });
  }

  try {
    const updatedGenre = await Genre.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedGenre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    res.json(updatedGenre);
  } catch (err) {
    console.error('Error updating genre:', err);
    res.status(400).json({ error: 'Failed to update genre' });
  }
});

// DELETE /genres/:id: Delete a genre
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid genre ID' });
  }

  try {
    const deletedGenre = await Genre.findByIdAndDelete(id);
    if (!deletedGenre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    res.json({ message: 'Genre deleted successfully' });
  } catch (err) {
    console.error('Error deleting genre:', err);
    res.status(400).json({ error: 'Failed to delete genre' });
  }
});

// SEARCH /genres/search: Search genres by name
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const genres = await Genre.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive search
    });
    res.json(genres);
  } catch (err) {
    console.error('Error searching genres:', err);
    res.status(500).json({ error: 'Error searching genres' });
  }
});

// GET /genres/:name: Search genre by name
router.get('/search/:name', async (req, res) => {
  const { name } = req.params;

  try {
      // Case-insensitive search for genre name
      const genre = await Genre.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (!genre) {
          return res.status(404).json({ error: 'Genre not found' });
      }

      res.json(genre);
  } catch (err) {
      console.error('Error fetching genre:', err);
      res.status(500).json({ error: 'Error fetching genre' });
  }
});



module.exports = router;
