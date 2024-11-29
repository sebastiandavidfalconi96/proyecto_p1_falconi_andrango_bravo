"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Search, User, Home, BookOpen, Settings } from "lucide-react"; // Librería de iconos

const Layout: React.FC = ({ children }) => {
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
            {[ // Define elementos del menú con mejor estructura visual.
              { href: "/", label: "Inicio", icon: <Home className="w-5 h-5" /> },
              { href: "/books", label: "Libros", icon: <BookOpen className="w-5 h-5" /> },
              { href: "/users", label: "Usuarios", icon: <User className="w-5 h-5" /> },
              { href: "/loans", label: "Préstamos", icon: <BookOpen className="w-5 h-5" /> },
              { href: "/settings", label: "Configuración", icon: <Settings className="w-5 h-5" /> },
            ].map((item) => (
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
          <p className="text-xs text-center text-gray-400">
            © 2024 MyLibrary
          </p>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow">
        {/* Encabezado */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <div className="flex items-center gap-2 w-1/2">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar libros, usuarios o préstamos..."
              className="bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Admin</span>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://via.placeholder.com/40" alt="Avatar del usuario" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-grow p-6">
          <div className="bg-white shadow-sm rounded-lg p-6">{children}</div>
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
