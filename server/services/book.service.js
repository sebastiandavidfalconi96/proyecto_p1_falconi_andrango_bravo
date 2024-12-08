const { Book } = require('../models');
const { BookDTOBuilder } = require('../dto/book.dto');
const { Op } = require('sequelize');

// Crear un libro
const createBook = async (data) => {
  // Aseguramos que el libro tenga la propiedad 'isActive' establecida como true por defecto
  const bookData = {
    ...data,
    isActive: true, // Garantizar que el libro se cree con 'isActive' como true
  };

  // Crear el libro con los datos asegurados
  const book = await Book.create(bookData);

  // Construir y devolver el DTO (Data Transfer Object) del libro creado
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setISBN(book.isbn)
    .setCategory(book.category)
    .setPrice(book.price)
    .setInventoryCount(book.inventoryCount) // Incluir inventario
    .setLocation(book.location)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .setPublicationYear(book.publicationYear)
    .build();
};

// Actualizar un libro
const updateBook = async (id, data) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');

  // Actualizar los datos del libro
  const updatedBook = await book.update(data);

  // Crear y devolver el DTO con todos los campos necesarios
  return new BookDTOBuilder()
    .setId(updatedBook.id)
    .setTitle(updatedBook.title)
    .setAuthor(updatedBook.author)
    .setISBN(updatedBook.isbn) // Asegúrate de incluir el ISBN
    .setCategory(updatedBook.category) // Añadir categoría
    .setPrice(updatedBook.price) // Precio actualizado
    .setInventoryCount(updatedBook.inventoryCount) // Inventario actualizado
    .setLocation(updatedBook.location) // Ubicación del libro
    .setIsRented(updatedBook.isRented) // Estado de renta actualizado
    .setIsLoaned(updatedBook.isLoaned) // Estado de préstamo actualizado
    .setPublicationYear(updatedBook.publicationYear) // Año de publicación actualizado
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
    .setISBN(book.isbn)
    .setCategory(book.category)
    .setPrice(book.price)
    .setInventoryCount(book.inventoryCount)
    .setLocation(book.location)
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
      .setCategory(book.category)
      .build()
  );
};

// Cambiar estado de renta o préstamo
const rentBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');
  if (book.isRented) throw new Error('El libro ya está rentado');
  if (book.inventoryCount <= 0) throw new Error('No hay copias disponibles para alquilar');

  // Reducir el contador de inventario
  book.inventoryCount -= 1;
  book.isRented = true;

  await book.save();
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setISBN(book.isbn)
    .setCategory(book.category)
    .setPrice(book.price)
    .setInventoryCount(book.inventoryCount) // Actualizado con el nuevo inventario
    .setLocation(book.location)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .setPublicationYear(book.publicationYear)
    .build();
};

const returnBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');
  if (!book.isRented) throw new Error('El libro no está rentado');

  // Incrementar el contador de inventario
  book.inventoryCount += 1;
  book.isRented = false;

  await book.save();
  return new BookDTOBuilder()
    .setId(book.id)
    .setTitle(book.title)
    .setAuthor(book.author)
    .setISBN(book.isbn)
    .setCategory(book.category)
    .setPrice(book.price)
    .setInventoryCount(book.inventoryCount) // Actualizado con el nuevo inventario
    .setLocation(book.location)
    .setIsRented(book.isRented)
    .setIsLoaned(book.isLoaned)
    .setPublicationYear(book.publicationYear)
    .build();
};

const setInactive = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Libro no encontrado');

  // Marcar el libro como inactivo
  book.isActive = false;

  await book.save();
  return book; // Devolver el libro con el estado actualizado
};

module.exports = {
  setInactive,
  // otros métodos...
};


const searchBooks = async ({ titulo, categoria, rangoInicio, rangoFin, isbn, author, isActive }) => {
  const where = {};

  if (titulo) where.title = { [Op.iLike]: `%${titulo}%` };
  if (categoria) where.category = categoria;
  if (rangoInicio && rangoFin) {
    where.publicationYear = { [Op.between]: [parseInt(rangoInicio), parseInt(rangoFin)] };
  }
  if (isbn) where.isbn = isbn;
  if (author) where.author = { [Op.iLike]: `%${author}%` };

  // Filtro por estado de activo/inactivo
  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const books = await Book.findAll({ where });

  return books.map(book =>
    new BookDTOBuilder()
      .setId(book.id)
      .setTitle(book.title)
      .setAuthor(book.author)
      .setISBN(book.isbn)
      .setCategory(book.category)
      .setPrice(book.price)
      .setInventoryCount(book.inventoryCount)
      .setLocation(book.location)
      .setIsRented(book.isRented)
      .setIsLoaned(book.isLoaned)
      .setPublicationYear(book.publicationYear)
      .setIsActive(book.isActive)  // Incluir estado activo/inactivo
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
      cantidad: 5,
      isbn: '978-3-16-148410-0', // ISBN del libro
      isActive: true,
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
      cantidad: 3,
      isbn: '978-1-4028-9462-6',
      isActive: true,
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
      cantidad: 10,
      isbn: '978-2-07-061275-8',
      isActive: true,
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
      cantidad: 4,
      isbn: '978-0-452-28423-4',
      isActive: true,
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
      cantidad: 6,
      isbn: '978-0-19-953556-9',
      isActive: true,
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
      cantidad: 7,
      isbn: '978-0-06-112008-4',
      isActive: true,
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
      cantidad: 5,
      isbn: '978-0-14-044913-6',
      isActive: true,
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
      cantidad: 8,
      isbn: '978-0-7432-7356-5',
      isActive: true,
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
      cantidad: 2,
      isbn: '978-0-14-026886-7',
      isActive: true,
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
      cantidad: 4,
      isbn: '978-0-307-47409-5',
      isActive: true,
    },
  ];

  await Book.bulkCreate(defaultBooks);
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  setInactive,
  getBookById,
  getAllBooks,
  rentBook,
  returnBook,
  createDefaultBooks,
  searchBooks,
  getBookAvailability,
};
