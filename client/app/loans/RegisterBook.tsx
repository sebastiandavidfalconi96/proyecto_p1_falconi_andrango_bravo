"use client";

import React, { useState } from "react";
import axios from "axios";

const RegisterBook = () => {
  const [bookData, setBookData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    categoria: "",
    cantidad: 0,
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
      const response = await axios.post("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books", bookData);
      setSuccessMessage("Libro registrado con éxito");
      setBookData({ titulo: "", autor: "", isbn: "", categoria: "", cantidad: 0 });
    } catch (err) {
      console.error("Error al registrar el libro:", err);
      setError("No se pudo registrar el libro. Intenta nuevamente.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Registrar Nuevo Libro</h2>
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
          <option value="Romance">Romance</option>
          <option value="Filosofía">Filosofía</option>
          <option value="Clásicos">Clásicos</option>
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
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterBook;
