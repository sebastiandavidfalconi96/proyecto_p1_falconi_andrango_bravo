"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const EditBook = ({ bookId }) => {
  const [bookData, setBookData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoria: "",
    cantidad: 0,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/books/${bookId}`);
        setBookData(response.data);
      } catch (err) {
        setError("No se pudo obtener la información del libro.");
      }
    };

    fetchBookData();
  }, [bookId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/api/books/${bookId}`, bookData);
      setSuccessMessage("Libro actualizado con éxito");
      // Optionally, redirect or update the page
      router.push("/books");
    } catch (err) {
      console.error("Error al actualizar el libro:", err);
      setError("No se pudo actualizar el libro. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Editar Libro</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={bookData.titulo}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="autor"
          placeholder="Autor"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={bookData.autor}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={bookData.isbn}
          onChange={handleInputChange}
        />
        <select
          name="categoria"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={bookData.categoria}
          onChange={handleInputChange}
        >
          <option value="">Seleccionar categoría</option>
          <option value="Ficción">Ficción</option>
          <option value="No Ficción">No Ficción</option>
          <option value="Ciencia">Ciencia</option>
          <option value="Historia">Historia</option>
        </select>
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad en inventario"
          className="p-2 border border-gray-300 rounded-md w-full"
          value={bookData.cantidad}
          onChange={handleInputChange}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default EditBook;
