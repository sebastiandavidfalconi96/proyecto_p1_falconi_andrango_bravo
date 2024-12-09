"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from "@/app/modal/modal"; // Import the Modal

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",              // Título del libro
    author: "",             // Autor del libro
    isbn: "",               // ISBN del libro
    price: 0.0,             // Precio del libro
    isRented: false,        // Si el libro está rentado
    isLoaned: false,        // Si el libro está prestado
    category: "",           // Categoría del libro
    publicationYear: "",    // Año de publicación del libro
    location: "",           // Ubicación en la librería
    inventoryCount: 0,      // Cantidad de copias disponibles
  });

  const [filters, setFilters] = useState({
    titulo: "",
    categoria: "",
    isbn: "",           // Añadido para ISBN
    author: ""          // Añadido para autor
  });

  const [editBook, setEditBook] = useState(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Modal de confirmación de eliminación
  const [bookToDelete, setBookToDelete] = useState(null); // Libro que se va a eliminar

  const [userType, setUserType] = useState("");
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("email");

    if (storedUserType) setUserType(storedUserType);

    setLoading(false);
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/search", {
        params: {
          titulo: filters.titulo || undefined,
          categoria: filters.categoria || undefined,
          author: filters.author || undefined, // Filtro por autor
          isbn: filters.isbn || undefined,   // Filtro por ISBN
          rangoInicio: filters.rangoInicio || undefined,
          rangoFin: filters.rangoFin || undefined,
        },
      });
      setBooks(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error al cargar los libros:", err);
      setError("No se pudieron cargar los libros. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchBooks once component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && searchTriggered) {
      fetchBooks();
      setSearchTriggered(false);
    }
  }, [filters, mounted, searchTriggered]);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  const handleNewBookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook({
      ...newBook,
      [name]: type === 'checkbox' ? checked : value, // Handle boolean values for checkboxes
    });
  };

  const handleEditBookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditBook({
      ...editBook,
      [name]: type === 'checkbox' ? checked : value, // Handle boolean values for checkboxes
    });
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books", newBook);
      setBooks([...books, response.data]);  // Add the new book to the state
      setNewBook({ titulo: "", author: "", isbn: "", categoria: "", cantidad: 0 }); // Reset form
      setCreateModalOpen(false); // Close modal
    } catch (err) {
      console.error("Error al crear el libro:", err);
      setError("No se pudo crear el libro. Intenta nuevamente.");
    }
  };

  const handleDeleteBook = async () => {
    try {
      await axios.delete(`https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/${bookToDelete.id}`);
      setBooks(books.filter((book) => book.id !== bookToDelete.id)); // Update the books state after deletion
      setDeleteModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error al eliminar el libro:", err);
      setError("No se pudo eliminar el libro. Intenta nuevamente.");
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/${editBook.id}`, editBook);
      const updatedBooks = books.map((book) =>
        book.id === editBook.id ? response.data : book
      );
      setBooks(updatedBooks);
      setEditModalOpen(false); // Close modal
      setEditBook(null); // Reset edit state
    } catch (err) {
      console.error("Error al editar el libro:", err);
      setError("No se pudo editar el libro. Intenta nuevamente.");
    }
  };

  if (loading) return <p className="text-center">Cargando libros...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {/* Filtros de búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="titulo"
          placeholder="Buscar por título"
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          value={filters.titulo}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="author"
          placeholder="Buscar por autor"
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          value={filters.author}
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="isbn"
          placeholder="Buscar por ISBN"
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2"
          value={filters.isbn}
          onChange={handleInputChange}
        />

        <select
          name="categoria"
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/4"
          value={filters.categoria}
          onChange={handleInputChange}
        >
          <option value="">Todas las categorías</option>
          <option value="Ficción">Ficción</option>
          <option value="No Ficción">No Ficción</option>
          <option value="Ciencia">Ciencia</option>
          <option value="Historia">Historia</option>
          <option value="Romance">Romance</option>
          <option value="Filosofía">Filosofía</option>
          <option value="Clásicos">Clásicos</option>
        </select>

        <button
          onClick={handleSearchClick}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Buscar
        </button>
      </div>

      {userType === "admin" ? (
        <button
          onClick={() => setCreateModalOpen(true)}
          className="p-2 mb-4 bg-green-500 text-white rounded-md"
        >
          Crear Nuevo Libro
        </button>
      ) : <div></div>}

      {/* List of books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <img
                src={book.image || "https://www.comunidadbaratz.com/wp-content/uploads/Instrucciones-a-tener-en-cuenta-sobre-como-se-abre-un-libro-nuevo.jpg"}
                alt={book.title}
                className="w-full h-60 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
              <p className="text-sm text-gray-500">Categoría: {book.category || "No especificada"}</p>
              <p className="text-sm text-gray-500">ISBN: {book.isbn || "No especificada"}</p>
              {userType === "admin" ? (
                <>
                  <button
                    onClick={() => {
                      setEditBook(book);
                      setEditModalOpen(true);
                    }}
                    className="mt-2 text-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setBookToDelete(book);
                      setDeleteModalOpen(true);
                    }}
                    className="mt-2 ml-10 text-red-500"
                  >
                    Eliminar
                  </button>
                </>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-xl font-semibold text-center text-gray-800">¿Estás seguro de que quieres eliminar este libro?</h2>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleDeleteBook}
            className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </Modal>
      {/* Create Book Modal */}
      {/* Edit Book Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Registrar Nuevo Libro</h2>
        <form onSubmit={handleCreateBook} className="space-y-6 mb-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Título</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Título del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.title}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-gray-700 font-medium mb-2">Autor</label>
            <input
              id="author"
              type="text"
              name="author"
              placeholder="Autor del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.author}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Precio</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Precio"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.price}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Publication Year */}
          <div>
            <label htmlFor="publicationYear" className="block text-gray-700 font-medium mb-2">Año de publicación</label>
            <input
              id="publicationYear"
              type="number"
              name="publicationYear"
              placeholder="Año de publicación"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.publicationYear}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Ubicación</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Ubicación del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.location}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Categoría</label>
            <select
              id="category"
              name="category"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.category}
              onChange={handleNewBookChange}
            >
              <option value="">Seleccionar categoría</option>
              <option value="Ficción">Ficción</option>
              <option value="No Ficción">No Ficción</option>
              <option value="Ciencia">Ciencia</option>
              <option value="Historia">Historia</option>
              <option value="Romance">Romance</option>
              <option value="Filosofía">Filosofía</option>
              <option value="Clásicos">Clásicos</option>
            </select>
          </div>

          {/* Alquilado Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isRented"
              type="checkbox"
              name="isRented"
              checked={newBook.isRented}
              onChange={handleNewBookChange}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRented" className="text-gray-700">Alquilado</label>
          </div>

          {/* Prestado Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isLoaned"
              type="checkbox"
              name="isLoaned"
              checked={newBook.isLoaned}
              onChange={handleNewBookChange}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isLoaned" className="text-gray-700">Prestado</label>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="cantidad" className="block text-gray-700 font-medium mb-2">Cantidad en inventario</label>
            <input
              id="cantidad"
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBook.inventoryCount}
              onChange={handleNewBookChange}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrar
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Editar Libro</h2>
        <form onSubmit={handleEditBook} className="space-y-6 mb-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Título</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Título del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.title || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-gray-700 font-medium mb-2">Autor</label>
            <input
              id="author"
              type="text"
              name="author"
              placeholder="Autor del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.author || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Precio</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Precio"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.price || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Publication Year */}
          <div>
            <label htmlFor="publicationYear" className="block text-gray-700 font-medium mb-2">Año de publicación</label>
            <input
              id="publicationYear"
              type="number"
              name="publicationYear"
              placeholder="Año de publicación"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.publicationYear || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Ubicación</label>
            <input
              id="location"
              type="text"
              name="location"
              placeholder="Ubicación del libro"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.location || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Categoría</label>
            <select
              id="category"
              name="category"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.category || ""}
              onChange={handleEditBookChange}
            >
              <option value="">Seleccionar categoría</option>
              <option value="Ficción">Ficción</option>
              <option value="No Ficción">No Ficción</option>
              <option value="Ciencia">Ciencia</option>
              <option value="Historia">Historia</option>
              <option value="Romance">Romance</option>
              <option value="Filosofía">Filosofía</option>
              <option value="Clásicos">Clásicos</option>
            </select>
          </div>

          {/* Alquilado Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isRented"
              type="checkbox"
              name="isRented"
              checked={editBook?.isRented || false}
              onChange={handleEditBookChange}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRented" className="text-gray-700">Alquilado</label>
          </div>

          {/* Prestado Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="isLoaned"
              type="checkbox"
              name="isLoaned"
              checked={editBook?.isLoaned || false}
              onChange={handleEditBookChange}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isLoaned" className="text-gray-700">Prestado</label>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="cantidad" className="block text-gray-700 font-medium mb-2">Cantidad en inventario</label>
            <input
              id="cantidad"
              type="number"
              name="cantidad"
              placeholder="Cantidad"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editBook?.inventoryCount || ""}
              onChange={handleEditBookChange}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </Modal>


    </div>
  );
};

export default BooksList;
