const { Book } = require('../models');
const { BookDTOBuilder } = require('../dto/book.dto');
const { Op } = require('sequelize');

// Crear un libro
const createBook = async (data) => {
  const book = await Book.create(data);
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setPrice(book.price)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .build();
};

// Actualizar un libro
const updateBook = async (id, data) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');

  const updatedBook = await book.update(data);
  return new BookDTOBuilder()
    .setId(updatedBook.id)
    .setTitle(updatedBook.title)
    .setAuthor(updatedBook.author)
    .setPrice(updatedBook.price)
    .setIsRented(updatedBook.isRented)
    .setIsLoaned(updatedBook.isLoaned)
    .build();
};

// Eliminar un libro
const deleteBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');
  return book.destroy();
};

// Obtener un solo libro por su ID
const getBookById = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) return null;

  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setPrice(book.price)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .build();
};

// Obtener todos los libros
const getAllBooks = async () => {
  const books = await Book.findAll();
  return books.map(book =>
    new BookDTOBuilder()
      .setId(book.id)
      .setTitle(book.title)
      .setAuthor(book.author)
      .setPrice(book.price)
      .setIsRented(book.isRented)
      .setIsLoaned(book.isLoaned)
      .build()
  );
};

// Cambiar estado de renta o préstamo
const rentBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');
  if (book.isRented) throw new Error('El libro ya está rentado');

  book.isRented = true;
  await book.save();
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setPrice(book.price)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .build();
};

const returnBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');
  if (!book.isRented) throw new Error('El libro no está rentado');

  book.isRented = false;
  await book.save();
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setPrice(book.price)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .build();
};

const searchBooks = async ({ titulo, categoria, rangoInicio, rangoFin }) => {
  const where = {};

  if (titulo) where.title = { [Op.iLike]: `%${titulo}%` }; // Búsqueda por título
  if (categoria) where.category = categoria; // Coincidencia exacta de categoría
  if (rangoInicio && rangoFin) {
    where.publicationYear = { [Op.between]: [parseInt(rangoInicio), parseInt(rangoFin)] }; // Rango de años
  }

  const books = await Book.findAll({ where });

  return books.map(book =>
    new BookDTOBuilder()
      .setId(book.id)
      .setTitle(book.title)
      .setAuthor(book.author)
      .setPrice(book.price)
      .setIsRented(book.isRented)
      .setIsLoaned(book.isLoaned)
      .build()
  );
};

const getBookAvailability = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) return null;

  return {
    id: book.id,
    title: book.title,
    availability: !book.isRented,
    location: book.location || 'Sin ubicación especificada', // 'location' debe estar en el modelo si es relevante
    category: book.category || 'No especificada', // 'category' debe estar en el modelo si es relevante
  };
};

const createDefaultBooks = async () => {
  const defaultBooks = [
    {
      title: 'Don Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      price: 9.99,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1605,
      location: 'Estantería A1',
    },
    {
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      price: 12.99,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1967,
      location: 'Estantería B3',
    },
    {
      title: 'El principito',
      author: 'Antoine de Saint-Exupéry',
      price: 8.99,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1943,
      location: 'Estantería C1',
    },
    {
      title: '1984',
      author: 'George Orwell',
      price: 10.99,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1949,
      location: 'Estantería D2',
    },
    {
      title: 'Orgullo y prejuicio',
      author: 'Jane Austen',
      price: 11.99,
      isRented: false,
      isLoaned: false,
      category: 'Romance',
      publicationYear: 1813,
      location: 'Estantería E5',
    },
    {
      title: 'Matar a un ruiseñor',
      author: 'Harper Lee',
      price: 10.49,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1960,
      location: 'Estantería F4',
    },
    {
      title: 'Crimen y castigo',
      author: 'Fiódor Dostoyevski',
      price: 13.99,
      isRented: false,
      isLoaned: false,
      category: 'Filosofía',
      publicationYear: 1866,
      location: 'Estantería G2',
    },
    {
      title: 'El Gran Gatsby',
      author: 'F. Scott Fitzgerald',
      price: 9.49,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1925,
      location: 'Estantería H1',
    },
    {
      title: 'La Odisea',
      author: 'Homero',
      price: 14.99,
      isRented: false,
      isLoaned: false,
      category: 'Clásicos',
      publicationYear: -800, // Aproximado
      location: 'Estantería J3',
    },
    {
      title: 'Rayuela',
      author: 'Julio Cortázar',
      price: 12.49,
      isRented: false,
      isLoaned: false,
      category: 'Ficción',
      publicationYear: 1963,
      location: 'Estantería K5',
    },
  ];

  await Book.bulkCreate(defaultBooks);
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getAllBooks,
  rentBook,
  returnBook,
  createDefaultBooks,
  searchBooks,
  getBookAvailability,
};
