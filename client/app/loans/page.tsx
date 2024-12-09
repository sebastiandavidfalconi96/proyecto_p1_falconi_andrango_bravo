"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/app/dashboard/page";

const BooksList = () => {
  const [lastLoanId, setLastLoanId] = useState();
  const [userId, setUserId] = useState(null);
  const [flag, setFlag] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);

    const storedLoanId = localStorage.getItem("loanId");
    if (storedLoanId) setLastLoanId(storedLoanId);

    const storedFlag = localStorage.getItem("flag");
    if (storedFlag) setFlag(storedFlag);

    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/search");
      setBooks(response.data);
    } catch (err) {
      console.error("Error al cargar los libros:", err);
      setError("No se pudieron cargar los libros. Intenta nuevamente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleRentBook = async (bookId) => {
    const loanDate = new Date().toISOString().split("T")[0];
    const returnDate = new Date(new Date().setDate(new Date().getDate() + 10))
      .toISOString()
      .split("T")[0];

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

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const confirmationText = xmlDoc.getElementsByTagName("confirmation")[0]?.textContent;
      const loanId = confirmationText?.match(/[0-9a-fA-F-]{36}/)?.[0];
  
      setLastLoanId(loanId);
      localStorage.setItem("loanId", loanId);
      localStorage.setItem("flag", true);

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
            <loanId>${lastLoanId}</loanId>
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

      const restResponse = await axios.put(
        `https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/books/${bookId}`,
        { isRented: false }
      );
      console.log("Respuesta de REST:", restResponse.data);
      localStorage.setItem("flag", false);

      fetchBooks();
      alert("El libro ha sido devuelto con éxito.");


    } catch (error) {
      console.error("Error al devolver el libro:", error);
      alert("No se pudo devolver el libro. Inténtalo más tarde.");
    }
  };

  if (loading) return <p className="text-center">Cargando libros...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-4">
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

                <br />
                {book.isRented === false ? (
                  <button
                    onClick={() => handleRentBook(book.id)}
                    className="p-2 bg-blue-500 text-white rounded-md"
                  >
                    Prestamo Libro
                    
                  </button>
                  
                ) : (
                  <button
                    onClick={() => handleReturnBook(book.id)}
                    className="p-2 bg-red-500 text-white rounded-md"
                  >
                    Devolución Libro
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BooksList;
