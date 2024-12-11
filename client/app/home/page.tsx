"use client";

import React, { useEffect, useState } from "react";
import Layout from "../dashboard/page";

const Index = () => {
    const [userType, setUserType] = useState("");

    // Obtener el userType desde localStorage al cargar el componente
    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        if (storedUserType) {
            setUserType(storedUserType); // Establece el userType desde el localStorage
        }
    }, []);

    if (!userType || (userType !== "admin" && userType !== "consumer")) {
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
                            </h1>
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
                                <li>Gestión de préstamos de libros.</li>
                                <li>Consulta del historial de préstamos realizados.</li>
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