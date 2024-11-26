const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes'); // Import book routes
const Genre = require('./models/Genre'); // Ensure this is above Book model import
const Book = require('./models/Book');
const genreRoutes = require('./routes/genreRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bookCollection', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Book Collection!');
});

// Test Database Connection
app.get('/test-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json(collections);
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({ error: 'Database connection test failed' });
    console.log('Server running on port 3000');
  }
});

// Add Book Routes
app.use('/books', bookRoutes); // Integrate the /books routes from bookRoutes.js

// Use genre routes
app.use('/genres', genreRoutes);

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
