const { Book } = require('../models');
const { BookDTOBuilder } = require('../dto/book.dto');

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

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getAllBooks,
  rentBook,
  returnBook,
};
