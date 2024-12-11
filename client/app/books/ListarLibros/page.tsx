"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/app/dashboard/page";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ titulo: "", categoria: "" });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/search",
        {
          headers: {
            Authorization: `Bearer your-secret-key`, // Token textual directamente en el encabezado
          },
          params: {
            titulo: filters.titulo || undefined,
            categoria: filters.categoria || undefined,
          },
        });
      setBooks(response.data);
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
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, ''); // Permite solo letras, números y espacios

    setFilters({
      ...filters,
      [e.target.name]: sanitizedValue,
    });
  };

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  if (loading) return <p className="text-center">Cargando libros...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </Layout>
  );
};

export default BooksList;
