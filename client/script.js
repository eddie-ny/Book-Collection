const baseUrl = 'http://localhost:3000';

// Get DOM elements
const addBookForm = document.getElementById('addBookForm');
const bookList = document.getElementById('bookList');
const genreSelect = document.getElementById('genre');  // Genre select dropdown for adding a book
const modalGenreSelect = document.getElementById('modalGenre');  // Genre select inside modal
const modal = document.getElementById('myModal'); // Modal element
const genreFilter = document.getElementById('genreFilter'); // Filter dropdown

// Fetch genres and populate the filter dropdown
async function populateGenreFilter() {
    try {
        const response = await fetch(`${baseUrl}/genres`);
        const genres = await response.json();

        if (Array.isArray(genres) && genres.length > 0) {
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre._id;
                option.textContent = genre.name;
                genreFilter.appendChild(option); // Populate the filter dropdown
            });
        } else {
            alert('No genres found');
        }
    } catch (err) {
        console.error('Error fetching genres:', err);
    }
}

// Filter books based on the selected genre
async function filterBooksByGenre() {
    const genreId = genreFilter.value;
    console.log('Selected Genre ID:', genreId);


    if (!genreId) {
        // If no genre is selected, fetch all books
        getBooksAndGenres();
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/books/filter?genre=${genreId}`);
        
        // Check if the response is successful and log it
        console.log('Filter response:', response);

        const books = await response.json();

        if (Array.isArray(books) && books.length > 0) {
            console.log('Filtered books:', books);  // Log filtered books to the console
            displayBooks(books);  // Display the filtered books
        } else {
            console.log('No books found for this genre');  // Log if no books were found
            bookList.innerHTML = '<li>No books found for the selected genre.</li>';
        }
    } catch (err) {
        console.error('Error filtering books by genre:', err);
    }
}


// Fetch all books and genres
async function getBooksAndGenres() {
    try {
        // Fetch books
        const responseBooks = await fetch(`${baseUrl}/books`);
        const books = await responseBooks.json();
        if (Array.isArray(books) && books.length > 0) {
            displayBooks(books); // Display books if available
        } else {
            bookList.innerHTML = '<li>No books available.</li>';
        }

        // Fetch genres for the dropdowns
        await populateGenreFilter(); // Populate the genre filter dropdown
        populateGenreDropdowns(); // Populate the genre dropdowns for adding and editing books
    } catch (err) {
        console.error('Error fetching books or genres:', err);
    }
}

// Populate the genre dropdowns for adding and editing books
async function populateGenreDropdowns() {
    try {
        const response = await fetch(`${baseUrl}/genres`);
        const genres = await response.json();

        // Populate the genre dropdown in the Add Book form
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre._id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });

        // Populate the genre dropdown in the Edit Book modal
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre._id;
            option.textContent = genre.name;
            modalGenreSelect.appendChild(option);
        });

    } catch (err) {
        console.error('Error fetching genres:', err);
    }
}

// Display books in cards
function displayBooks(books) {
    bookList.innerHTML = ''; // Clear the list before displaying new books

    books.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('book-card'); // Add the class for styling

        div.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p><strong>Genre:</strong> ${book.genre_id ? book.genre_id.name : 'N/A'}</p>
            <p><strong>Copies Left:</strong> ${book.copies_left}</p>
            <button class="edit-button" onclick="editBook('${book._id}')">Edit</button>
            <button class="delete-button" onclick="deleteBook('${book._id}')">Delete</button>
        `;
        
        bookList.appendChild(div);
    });
}

// Add a new book
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const price = document.getElementById('price').value;
    const genre = document.getElementById('genre').value; // Genre ID (from dropdown)
    const copies = document.getElementById('copies').value;

    const bookData = { title, author, price, genre_id: genre, copies_left: copies };

    try {
        const response = await fetch(`${baseUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            getBooksAndGenres(); // Refresh the book list and genres
            addBookForm.reset(); // Clear the form
        }
    } catch (err) {
        console.error('Error adding book:', err);
    }
});

// Open the modal to edit the book
async function editBook(bookId) {
    try {
        const response = await fetch(`${baseUrl}/books/${bookId}`);
        const book = await response.json();

        if (book) {
            // Populate the modal with existing book details
            document.getElementById('modalTitle').value = book.title;
            document.getElementById('modalAuthor').value = book.author;
            document.getElementById('modalPrice').value = book.price;
            document.getElementById('modalCopies').value = book.copies_left;

            // Set the hidden input for the book ID
            document.getElementById('modalBookId').value = book._id;  // Ensure the book ID is available

            // Open the modal
            modal.style.display = 'block';

            // Update the genre in the modal select dropdown
            modalGenreSelect.value = book.genre_id ? book.genre_id._id : ''; // Assign genre if available
        }
    } catch (err) {
        console.error('Error editing book:', err);
    }
}




// Save the edited book
async function saveBookChanges() {
    const title = document.getElementById('modalTitle').value;
    const author = document.getElementById('modalAuthor').value;
    const price = document.getElementById('modalPrice').value;
    const genre = document.getElementById('modalGenre').value;
    const copies = document.getElementById('modalCopies').value;

    const bookData = { title, author, price, genre_id: genre, copies_left: copies };

    const bookId = document.getElementById('modalBookId').value; // Get the book ID from the hidden input field

    try {
        const response = await fetch(`${baseUrl}/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            getBooksAndGenres(); // Refresh the book list
            closeModal(); // Close the modal after saving changes
        }
    } catch (err) {
        console.error('Error updating book:', err);
    }
}

// Close the modal
function closeModal() {
    modal.style.display = 'none';
}


// Delete a book by ID
async function deleteBook(bookId) {
    try {
        const response = await fetch(`${baseUrl}/books/${bookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            getBooksAndGenres(); // Refresh the book list
        }
    } catch (err) {
        console.error('Error deleting book:', err);
    }
}

// Initialize by fetching books and genres
getBooksAndGenres();
