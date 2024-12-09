"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/app/dashboard/page";

const BooksList = () => {
  const [userId, setUserId] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ titulo: "", categoria: "" });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);

    setLoading(false);
  }, []);


  // Fetch books from the server
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/search", {
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
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  const handleRentBook = async (bookId) => {
    const loanDate = new Date().toISOString().split("T")[0]; // Fecha de hoy
    const returnDate = new Date(new Date().setDate(new Date().getDate() + 10))
      .toISOString()
      .split("T")[0]; // 10 días después

    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lib="https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/LibraryService">
        <soapenv:Header/>
        <soapenv:Body>
          <lib:registerLoanRequest>
            <userId>${userId}</userId>
            <bookId>${bookId}</bookId>
            <loanDate>${loanDate}</loanDate>
            <returnDate>${returnDate}</returnDate>
          </lib:registerLoanRequest>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const response = await axios.post(
        "https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/soap",
        soapEnvelope,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );
      console.log("Respuesta de SOAP:", response.data);

          // Llamar al endpoint REST para actualizar isRented
    const restResponse = await axios.put(
        `https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/${bookId}`,
        { isRented: true }
      );
      console.log("Respuesta de REST:", restResponse.data);

      fetchBooks();

      alert("El libro ha sido rentado con éxito.");
    } catch (error) {
      console.error("Error al rentar el libro:", error);
      alert("No se pudo rentar el libro. Inténtalo más tarde.");
    }
  };

  const handleReturnBook = async (bookId) => {

    const soapEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lib="https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/LibraryService">
        <soapenv:Header/>
        <soapenv:Body>
            <lib:returnLoanRequest>
                <loanId>7258c122-8048-4a4b-9141-469d671953b2</loanId>
            </lib:returnLoanRequest>
        </soapenv:Body>
        </soapenv:Envelope>
    `;

    try {
      const response = await axios.post(
        "https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/soap",
        soapEnvelope,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );
      console.log("Respuesta de SOAP:", response.data);

          // Llamar al endpoint REST para actualizar isRented
    const restResponse = await axios.put(
        `https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/${bookId}`,
        { isRented: false }
      );
      console.log("Respuesta de REST:", restResponse.data);

      fetchBooks();

      alert("El libro ha sido devuelto con éxito.");
    } catch (error) {
      console.error("Error al rentar el libro:", error);
      alert("No se pudo rentar el libro. Inténtalo más tarde.");
    }
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
                <p className="text-sm text-gray-500">Estado: {book.isRented}</p>
                {book.isRented === false ? (
                 <>
                    <button 
                         onClick={() => handleRentBook(book.id)}
                        className="p-2 bg-blue-500 text-white rounded-md">
                        Rentar
                    </button>
                 </>
                ) : 
                    <button 
                        onClick={() => handleReturnBook(book.id)}
                        className="p-2 bg-red-500 text-white rounded-md">
                        Devolver
                    </button>
                }                
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BooksList;
