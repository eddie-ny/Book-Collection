const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Book = require('../models/Book');
const Genre = require('../models/Genre');

// GET /books: Fetch all books
router.get('/', async (req, res) => {
    console.log('Fetching all books...');
    try {
        const books = await Book.find().populate('genre_id', 'name');
        console.log('Books retrieved:', books);
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Error fetching books' });
    }
});

// GET /books/filter: Filter books by genre ID
router.get('/filter', async (req, res) => {
    const { genre } = req.query;

    console.log('Received filter request with query:', req.query);

    try {
        if (!genre) {
            console.error('Genre query is missing');
            return res.status(400).json({ error: 'Genre query is required' });
        }

        console.log('Searching for genre by ID:', genre);

        // Ensure genre is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(genre)) {
            console.error('Invalid Genre ID:', genre);
            return res.status(400).json({ error: 'Invalid Genre ID' });
        }

        // Find books with the matching genre ID
        const books = await Book.find({ genre_id: genre }).populate('genre_id', 'name');

        if (books.length === 0) {
            console.error('No books found for the genre ID:', genre);
            return res.status(404).json({ error: 'No books found for the selected genre' });
        }

        console.log('Books found:', books);
        res.json(books);
    } catch (err) {
        console.error('Error filtering books by genre:', err);
        res.status(500).json({ error: 'Error filtering books' });
    }
});


// POST /books: Add a new book
router.post('/', async (req, res) => {
    const bookData = req.body;
    console.log('Adding new book with data:', bookData);

    try {
        // Validate genre_id
        const genre = await Genre.findById(bookData.genre_id);
        if (!genre) {
            console.error('Genre not found for ID:', bookData.genre_id);
            return res.status(404).json({ error: `Genre "${bookData.genre_id}" not found` });
        }

        const newBook = new Book(bookData);
        await newBook.save();
        console.log('New book added:', newBook);
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(400).json({ error: 'Error adding book' });
    }
});

// GET /books/:id: Fetch a specific book by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Fetching book with ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid book ID:', id);
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const book = await Book.findById(id).populate('genre_id', 'name');
        if (!book) {
            console.error('Book not found with ID:', id);
            return res.status(404).json({ error: 'Book not found' });
        }
        console.log('Book retrieved:', book);
        res.json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ error: 'Error fetching book' });
    }
});

// PUT /books/:id: Update a book by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const bookData = req.body;  // The updated data from the frontend
    console.log('Updating book with ID:', id, 'Data:', bookData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid book ID:', id);
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        // Validate that the genre_id exists
        if (bookData.genre_id) {
            const genre = await Genre.findById(bookData.genre_id);
            if (!genre) {
                console.error('Genre not found for ID:', bookData.genre_id);
                return res.status(404).json({ error: `Genre with ID "${bookData.genre_id}" not found` });
            }
        }

        // Update the book with the new data
        const updatedBook = await Book.findByIdAndUpdate(id, bookData, { new: true });

        if (!updatedBook) {
            console.error('Book not found with ID:', id);
            return res.status(404).json({ error: 'Book not found' });
        }

        console.log('Book updated:', updatedBook);
        res.json(updatedBook); // Return the updated book
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(400).json({ error: 'Error updating book' });
    }
});


// DELETE /books/:id: Delete a book by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Deleting book with ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid book ID:', id);
        return res.status(400).json({ error: 'Invalid book ID' });
    }

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            console.error('Book not found with ID:', id);
            return res.status(404).json({ error: 'Book not found' });
        }
        console.log('Book deleted:', deletedBook);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(400).json({ error: 'Error deleting book' });
    }
});

module.exports = router;
