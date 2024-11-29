"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Manejo del estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    // Función para obtener libros desde la API
    const fetchBooks = async () => {
      try {
        setLoading(true); // Activar estado de carga
        const response = await axios.get("http://localhost:4000/api/books"); // Cambia la URL según tu configuración
        setBooks(response.data); // Asume que los datos de la API vienen en el formato correcto
      } catch (err) {
        console.error("Error al cargar los libros:", err);
        setError("No se pudieron cargar los libros. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false); // Finalizar estado de carga
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p className="text-center">Cargando libros...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <img
              src={book.image || "https://via.placeholder.com/150?text=Sin+Imagen"}
              alt={book.title}
              className="w-full h-60 cover object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BooksList;
