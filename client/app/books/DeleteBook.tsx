"use client";

import React, { useState } from "react";
import axios from "axios";
import Modal from "@/app/modal/modal"; // Importamos el Modal

const DeleteBookModal = ({ book, isOpen, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/books/${book.id}`,
        {
          headers: {
            Authorization: `Bearer your-secret-key`, // Enviar el token en el encabezado
          },
        }
      );
      onDelete(book.id);  // Llamar a la función onDelete pasada por props para actualizar la lista
      onClose();  // Cerrar el modal
    } catch (err) {
      console.error("Error al eliminar el libro:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Confirmar eliminación</h2>
      <p className="text-center text-gray-600">¿Estás seguro de que deseas eliminar el libro <strong>{book.title}</strong>?</p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleDelete}
          className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
        <button
          onClick={onClose}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Función para actualizar el estado después de eliminar un libro
  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/books",
        {
          headers: {
            Authorization: `Bearer your-secret-key`, // Enviar el token en el encabezado
          },
        }
      );
      setBooks(response.data);
    } catch (err) {
      console.error("Error al cargar los libros:", err);
      setError("No se pudieron cargar los libros. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <p className="text-center">Cargando libros...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="card">
            <div className="card-header">
              <img
                src={book.image || "https://via.placeholder.com/150?text=Sin+Imagen"}
                alt={book.title}
                className="w-full h-60 object-cover rounded-t-lg"
              />
            </div>
            <div className="card-content p-4">
              <h3 className="text-xl">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-sm text-gray-500">Categoría: {book.category}</p>
              <button
                onClick={() => {
                  setBookToDelete(book);
                  setDeleteModalOpen(true);
                }}
                className="mt-2 text-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeleteBookModal
        book={bookToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteBook}
      />
    </div>
  );
};

export default BooksList;
