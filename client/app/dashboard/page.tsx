"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; // Para redireccionar
import { Search, User, Home, BookOpen, Settings } from "lucide-react";

const Layout: React.FC = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter(); // Para manejar redirecciones

  // Obtener el userType desde localStorage al cargar el componente
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("email");
    if (storedUserType) {
      setUserType(storedUserType); // Establece el userType desde el localStorage
    }
    if (storedEmail) {
      setEmail(storedEmail); // Establece el email desde el localStorage
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.clear(); // Limpia todos los datos de localStorage
    router.push("/login"); // Redirige al usuario a la página de login
  };

  // Opciones de navegación basadas en el tipo de usuario
  const navOptions =
    userType === "admin"
      ? [
          { href: "/", label: "Inicio", icon: <Home className="w-5 h-5" /> },
          { href: "/books", label: "Gestión Libros", icon: <BookOpen className="w-5 h-5" /> },
          { href: "/users", label: "Gestión Usuarios", icon: <User className="w-5 h-5" /> },

        ]
      : [
          { href: "/", label: "Inicio", icon: <Home className="w-5 h-5" /> },
          { href: "/loans", label: "Préstamos", icon: <BookOpen className="w-5 h-5" /> },
        ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Barra lateral */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-wide text-center text-white">
            MyLibrary
          </h1>
        </div>

        <nav className="flex-grow px-4">
          <ul className="space-y-3 mt-4">
            {navOptions.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 py-3 px-4 rounded-lg text-sm font-medium",
                    "transition duration-200",
                    "hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-700">
          <p className="text-xs text-center text-gray-400">© 2024 MyLibrary</p>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow">
        {/* Encabezado */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <div className="flex items-center gap-2 w-1/2">
          </div>
          <div className="flex items-center space-x-4">
            {/* Muestra el tipo de usuario */}
            <span className="text-sm font-medium text-gray-600">
              Bienvenido, {email || "Usuario"}
            </span>
            {/* Botón para cerrar sesión */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

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
          ) : (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">Bienvenido</h1>
              <p className="text-gray-600">
                Por favor, selecciona una opción del menú para comenzar.
              </p>
              <p className="text-sm text-gray-500">
                Universidad de las Fuerzas Armadas
              </p>
            </div>
          )}
        </div>
      </main>


        {/* Pie de página */}
        <footer className="p-4 text-center text-sm text-gray-500">
          © 2024 MyLibrary. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
