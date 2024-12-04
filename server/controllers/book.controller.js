const bookService = require('../services/book.service');

const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const book = await getBookByIdService(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const createBook = async (req, res) => {
  try {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const updatedBook = await bookService.updateBook(req.params.id, req.body);
    if (!updatedBook) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rentBook = async (req, res) => {
  try {
    const rentedBook = await bookService.rentBook(req.params.id);
    res.json(rentedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const returnedBook = await bookService.returnBook(req.params.id);
    res.json(returnedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { titulo, categoria, rangoInicio, rangoFin } = req.query;

    if ((rangoInicio && isNaN(parseInt(rangoInicio))) || (rangoFin && isNaN(parseInt(rangoFin)))) {
      return res.status(400).json({ error: "Invalid range values." });
    }

    const results = await bookService.searchBooks({ titulo, categoria, rangoInicio, rangoFin });
    res.json(results);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: error.message });
  }
};



const checkBookAvailability = async (req, res) => {
  try {
    const book = await bookService.getBookAvailability(req.params.id);
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  rentBook,
  returnBook,
  searchBooks,
  checkBookAvailability,
};
