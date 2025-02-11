"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/dashboard/page";

interface Loan {
  id: string;
  userId: string;
  bookId: string;
  libraryId: string;
  loanDate: string;
  returnDate: string;
  status: string;
  bookTitle: string;
  userName: string;
}

const Reports = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [libraryId, setLibraryId] = useState<string | null>(null);

  // Obtiene el `libraryId` del localStorage cuando el componente se monta
  useEffect(() => {
    const storedLibraryId = localStorage.getItem("libraryId");
    if (storedLibraryId) setLibraryId(storedLibraryId);
  }, []);

  // Efecto que se ejecuta solo cuando `libraryId` ha sido definido
  useEffect(() => {
    if (!libraryId) return; // Si no hay `libraryId`, no ejecuta el fetch

    const fetchLoansByLibrary = async () => {
      try {
        setLoading(true); // Inicia la carga
        const soapEnvelope = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://localhost:4000/LibraryService">
            <soapenv:Body>
              <tns:getLoansByLibraryIdRequest>
                <tns:libraryId>${libraryId}</tns:libraryId>
              </tns:getLoansByLibraryIdRequest>
            </soapenv:Body>
          </soapenv:Envelope>
        `;

        const response = await axios.post(
          "http://localhost:4000/soap",
          soapEnvelope,
          {
            headers: { "Content-Type": "text/xml" },
          }
        );

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const loanElements = xmlDoc.getElementsByTagName("loans");

        const loansData: Loan[] = Array.from(loanElements).map((loan) => ({
          id: loan.getElementsByTagName("id")[0]?.textContent || "",
          userId: loan.getElementsByTagName("userId")[0]?.textContent || "",
          bookId: loan.getElementsByTagName("bookId")[0]?.textContent || "",
          libraryId: loan.getElementsByTagName("libraryId")[0]?.textContent || "",
          loanDate: loan.getElementsByTagName("loanDate")[0]?.textContent || "",
          returnDate: loan.getElementsByTagName("returnDate")[0]?.textContent || "",
          status: loan.getElementsByTagName("status")[0]?.textContent || "",
          bookTitle: loan.getElementsByTagName("bookTitle")[0]?.textContent || "",
          userName: loan.getElementsByTagName("userName")[0]?.textContent || "",
        }));

        setLoans(loansData);
      } catch (err) {
        console.error("Error al cargar los préstamos:", err);
        setError("No se pudieron cargar los reportes. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchLoansByLibrary();
  }, [libraryId]);

  if (loading) return <p className="text-center">Cargando reportes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Reportes de Préstamos por Biblioteca</h1>
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Libro</th>
              <th className="p-2 border">ID Biblioteca</th>
              <th className="p-2 border">Fecha de Préstamo</th>
              <th className="p-2 border">Fecha de Devolución</th>
              <th className="p-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} className="text-center">
                <td className="p-2 border">{loan.id}</td>
                <td className="p-2 border">{loan.userName}</td>
                <td className="p-2 border">{loan.bookTitle}</td>
                <td className="p-2 border">{loan.libraryId || "No registrado"}</td>
                <td className="p-2 border">{loan.loanDate || "No registrado"}</td>
                <td className="p-2 border">{loan.returnDate || "No registrado"}</td>
                <td className={`p-2 border ${loan.status === "active" ? "text-green-500" : "text-orange-500"}`}>
                  {loan.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Reports;
