"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/dashboard/page";

interface Loan {
  id: string;
  userId: string;
  bookId: string;
  loanDate: string;
  returnDate: string;
  status: string;
  bookTitle: string;
  userName: string;
}

const History = () => {
  const [userId, setUserId] = useState<string>("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchUserLoans = async () => {
      if (!userId) return; // Esperar a que userId se cargue

      try {
        const soapEnvelope = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/LibraryService">
            <soapenv:Body>
              <tns:getLoansByUserIdRequest>
                <tns:userId>${userId}</tns:userId>
              </tns:getLoansByUserIdRequest>
            </soapenv:Body>
          </soapenv:Envelope>
        `;

        const response = await axios.post(
          "https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/soap",
          soapEnvelope,
          {
            headers: { "Content-Type": "text/xml" },
          }
        );

        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const loanElements = xmlDoc.getElementsByTagName("loans");

        const loansData: Loan[] = Array.from(loanElements).map((loan) => ({
          id: loan.getElementsByTagName("id")[0]?.textContent || "",
          userId: loan.getElementsByTagName("userId")[0]?.textContent || "",
          bookId: loan.getElementsByTagName("bookId")[0]?.textContent || "",
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
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, [userId]);

  if (loading) return <p className="text-center">Cargando reportes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Reportes de Préstamos (Usuario Actual)</h1>
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Libro</th>
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

export default History;
