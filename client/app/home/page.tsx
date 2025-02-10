"use client";

import React, { useEffect, useState } from "react";
import Layout from "../dashboard/page";
import axios from "axios";


interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    libraryId: string;
  }

const Index = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userType, setUserType] = useState("");
    const [userId, setUserId] = useState("");
    const [libraryId, setLibraryId] = useState("");
    const [library, setLibrary] = useState<any>(null);


    // Obtener el userType desde localStorage al cargar el componente
    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        const storedUserId = localStorage.getItem("userId");
        const storedLibraryId = localStorage.getItem("libraryId");

        if (storedUserType) {
            setUserType(storedUserType); // Establece el userType desde el localStorage
        }
        if (storedUserId) {
            setUserId(storedUserId)
        }
        if (storedLibraryId) {
            setLibraryId(storedLibraryId)
        }

    }, []);

    useEffect(() => {
        // 1. If userType not yet set, do nothing
        if (!userType) return;
      
        // 2. If user is NOT admin, do nothing
        if (userType !== "admin") return;
      
        // 3. Get libraryId from localStorage
        const storedLibraryId = localStorage.getItem("libraryId");
        if (!storedLibraryId) return;
      
        // 4. Fetch library
        const fetchLibrary = async () => {
          try {
            const response = await axios.get(
              `http://localhost:4000/api/libraries/${storedLibraryId}`
            );
            setLibrary(response.data);
          } catch (error) {
            console.error("Error al obtener la biblioteca:", error);
          }
        };
      
        fetchLibrary();
      // 5. We depend on userType so the effect re-runs if userType changes
      }, [userType]);
      
      

      

    if (!userType || (userType !== "admin" && userType !== "consumer" && userType !== "creator")) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Por favor, iniciar sesión</h1>
                    <p className="text-gray-600 mt-4">
                        Necesitas iniciar sesión para acceder a esta página.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            {/* Contenido */}
            <main className="flex-grow p-6">
                <div className="bg-white shadow-sm rounded-lg p-6">
                    {userType === "admin" ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Administrador del Sistema
                                <br />
                                {libraryId}
                            </h1>
                                {/* Si library existe, mostramos name y address */}
                                {library && (
                                <div>
                                    <p className="text-gray-600">Nombre: {library.name}</p>
                                    <p className="text-gray-600">Dirección: {library.address}</p>
                                </div>
                                )}
                            <p className="text-gray-600">
                                Bienvenido, Administrador. En este sistema, puedes realizar las
                                siguientes gestiones:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Gestión de inventario de libros.</li>
                                <li>Generación de reportes detallados.</li>
                                <li>Gestión de usuarios registrados en el sistema.</li>
                            </ul>
                            <p className="text-sm text-gray-500">
                                Universidad de las Fuerzas Armadas
                            </p>
                        </div>
                    ) : userType === "consumer" ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">Estudiante</h1>
                            <p className="text-gray-600">
                                Bienvenido, estudiante de la Universidad de las Fuerzas Armadas. Aquí
                                podrás realizar las siguientes acciones:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Generación de cuentos por IA</li>
                            </ul>
                            <p className="text-sm text-gray-500">
                                Universidad de las Fuerzas Armadas
                            </p>
                        </div>
                    ) : userType === "creator" ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">Cuenta Root</h1>
                            <p className="text-gray-600">
                                Bienvenido, usuario Root. Aquí
                                podrás realizar las siguientes acciones:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Gestión de librerias de la Universidad de las Fuerzas Armadas.</li>
                            </ul>
                            <p className="text-sm text-gray-500">
                                Universidad de las Fuerzas Armadas
                            </p>
                        </div>
                    ) : null}
                </div>
            </main>
        </Layout>
    );
};

export default Index;