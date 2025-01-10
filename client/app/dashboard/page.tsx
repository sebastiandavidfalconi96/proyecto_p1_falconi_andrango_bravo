"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Home, BookOpen, User } from "lucide-react";

const Layout: React.FC = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("email");

    if (storedUserType) setUserType(storedUserType);
    if (storedEmail) setEmail(storedEmail);

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const navOptions =
    userType === "admin"
    ? [
        { href: "/home", label: "Inicio", icon: <Home className="w-5 h-5" /> },
        { href: "/books", label: "Gestión Libros", icon: <BookOpen className="w-5 h-5" /> },
        { href: "/users", label: "Gestión Usuarios", icon: <User className="w-5 h-5" /> },
        { href: "/reports", label: "Reporte Préstamos", icon: <User className="w-5 h-5" /> },
      ]
    : userType === "creator"
    ? [
        { href: "/home", label: "Inicio", icon: <Home className="w-5 h-5" /> },
        { href: "/libraries", label: "Crear Librerias", icon: <BookOpen className="w-5 h-5" /> },
      ]
    : userType === "consumer"
    ? [
        { href: "/home", label: "Inicio", icon: <Home className="w-5 h-5" /> },
        { href: "/loans", label: "Préstamos", icon: <BookOpen className="w-5 h-5" /> },
        { href: "/history", label: "Historial", icon: <BookOpen className="w-5 h-5" /> },
      ]: null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-900">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Barra lateral */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-wide text-center text-white">
            ESPEBooks
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
          <p className="text-xs text-center text-gray-400">© 2024 ESPEBooks</p>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="ml-64 flex flex-col flex-grow">
        <header className="flex items-center justify-end p-4 bg-white shadow-md">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">
              Bienvenido, {email || "Usuario"}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>
        <main className="flex-grow p-6">
          <div className="bg-white shadow-sm rounded-lg p-6">{children}</div>
        </main>
        <footer className="p-4 text-center text-sm text-gray-500">
          © 2024 ESPEBooks. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
