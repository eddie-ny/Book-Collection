const mongoose = require('mongoose');
const Genre = require('./models/Genre');
const Book = require('./models/Book');

mongoose.connect('mongodb://localhost:27017/bookCollection', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB for seeding');

  // Create a Genre
  const fiction = await Genre.create({ name: 'Fiction' });

  // Create a Book
  await Book.create({
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 10.99,
    genre_id: fiction._id,
    copies_left: 5,
  });

  console.log('Database seeded successfully');
  mongoose.disconnect();
})
.catch((err) => console.error('Seeding error:', err));
