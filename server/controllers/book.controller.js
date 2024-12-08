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
  try {
    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json(book);
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
    const { id } = req.params;
    const updatedBook = await bookService.setInactive(id);

    if (!updatedBook) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    res.json({ message: "Libro marcado como inactivo", book: updatedBook });
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
    const { titulo, categoria, rangoInicio, rangoFin, author, isbn } = req.query;

    // Validación de ISBN (si está presente, debe ser un número o una cadena válida)
    if (isbn && !/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1,7}$|^\d{10}(\d{3})?$/.test(isbn)) {
      return res.status(400).json({ error: "Invalid ISBN format." });
    }

    // Preparar los filtros que se enviarán al servicio, asegurándose de que los valores vacíos se omiten
    const filters = {
      titulo: titulo || undefined, // Si no se proporciona, no se incluirá en la búsqueda
      categoria: categoria || undefined,
      rangoInicio: rangoInicio ? parseInt(rangoInicio) : undefined, // Si no se proporciona, se omite
      rangoFin: rangoFin ? parseInt(rangoFin) : undefined,
      author: author || undefined, // Se omite si no se proporciona
      isbn: isbn || undefined,   // Se omite si no se proporciona
    };

    // Llamada al servicio de búsqueda con los filtros
    const results = await bookService.searchBooks(filters);

    // Retornar los resultados encontrados
    res.json(results);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: error.message });
  }
};


const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, price, inventoryCount, location, publicationYear } = req.body;

    // Validar campos obligatorios
    if (!title || !author || !isbn || !category || !price || inventoryCount === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Asegurarse de que el libro sea creado con el estado 'activo' como true
    const newBook = await bookService.createBook({
      title,
      author,
      isbn,
      category,
      price,
      inventoryCount,
      location,
      publicationYear,
      activo: true // Aseguramos que el libro se cree con el estado activo true
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkBookAvailability = async (req, res) => {
  try {
    const book = await bookService.getBookAvailability(req.params.id);
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });

    const availability = book.inventoryCount > 0 ? 'Disponible' : 'No disponible';
    res.json({ ...book, availability });
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
