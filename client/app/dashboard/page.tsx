"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Search, User, Home, BookOpen, Settings, ChevronDown, ChevronRight, Trash2, Edit } from "lucide-react";
import Link from "next/link"; // Usamos Link para navegar

const Layout: React.FC = ({ children }) => {
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isLoansOpen, setIsLoansOpen] = useState(false);

  const toggleSubmenu = (menu: string) => {
    if (menu === "books") {
      setIsBooksOpen(!isBooksOpen);
    } else if (menu === "users") {
      setIsUsersOpen(!isUsersOpen);
    } else if (menu === "loans") {
      setIsLoansOpen(!isLoansOpen);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Barra lateral */}
      <aside className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold tracking-wide text-center text-white">
            MyLibrary
          </h1>
        </div>

        <nav className="flex-grow px-4 overflow-y-auto">
          <ul className="space-y-3 mt-4">
            {/* Menú de Inicio */}
            <li>
              <a
                href="/"
                className={cn(
                  "flex items-center gap-4 py-3 px-4 rounded-lg text-sm font-medium",
                  "transition duration-200",
                  "hover:bg-gray-700 hover:text-white"
                )}
              >
                <Home className="w-5 h-5" />
                Inicio
              </a>
            </li>

            {/* Menú de Libros */}
            {/* Menú de Libros */}
            <li>
              <div
                className="flex items-center gap-4 py-3 px-4 cursor-pointer rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white"
                onClick={() => toggleSubmenu("books")}
              >
                <BookOpen className="w-5 h-5" />
                <span>Libros</span>
                {isBooksOpen ? (
                  <ChevronDown className="ml-auto w-5 h-5" />
                ) : (
                  <ChevronRight className="ml-auto w-5 h-5" />
                )}
              </div>
              {isBooksOpen && (
                <ul className="ml-6 space-y-2">
                  <li>
                    <Link
                      href="/books/ListarLibros"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Listar Libros
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/books/eliminarlibros"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Eliminar Libros
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/books/crearlibro"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Crear Libro
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/books/editarlibro"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Editar Libro
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Menú de Usuarios */}
            <li>
              <div
                className="flex items-center gap-4 py-3 px-4 cursor-pointer rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white"
                onClick={() => toggleSubmenu("users")}
              >
                <User className="w-5 h-5" />
                <span>Usuarios</span>
                {isUsersOpen ? (
                  <ChevronDown className="ml-auto w-5 h-5" />
                ) : (
                  <ChevronRight className="ml-auto w-5 h-5" />
                )}
              </div>
              {isUsersOpen && (
                <ul className="ml-6 space-y-2">
                  <li>
                    <a
                      href="/usuarios"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Listar Usuarios
                    </a>
                  </li>
                  <li>
                    <a
                      href="/usuarios/crear"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Crear Usuario
                    </a>
                  </li>
                  <li>
                    <a
                      href="/usuarios/editar"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Editar Usuario
                    </a>
                  </li>
                  <li>
                    <a
                      href="/usuarios/eliminar"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Eliminar Usuario
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Menú de Préstamos */}
            {/* Menú de Préstamos */}
            <li>
              <div
                className="flex items-center gap-4 py-3 px-4 cursor-pointer rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white"
                onClick={() => toggleSubmenu("loans")}
              >
                <BookOpen className="w-5 h-5" />
                <span>Préstamos</span>
                {isLoansOpen ? (
                  <ChevronDown className="ml-auto w-5 h-5" />
                ) : (
                  <ChevronRight className="ml-auto w-5 h-5" />
                )}
              </div>
              {isLoansOpen && (
                <ul className="ml-6 space-y-2">
                  <li>
                    <a
                      href="/prestamos"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Listar Préstamos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/prestamos/registrar"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Registrar Préstamo
                    </a>
                  </li>
                  <li>
                    <a
                      href="/prestamos/actualizar"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Actualizar Préstamo
                    </a>
                  </li>
                  <li>
                    <a
                      href="/prestamos/eliminar"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Eliminar Préstamo
                    </a>
                  </li>
                  <li>
                    <a
                      href="/prestamos/devoluciones"
                      className="flex items-center gap-4 py-2 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Devolver Libro
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Menú de Configuración */}
            <li>
              <a
                href="/settings"
                className="flex items-center gap-4 py-3 px-4 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="w-5 h-5" />
                Configuración
              </a>
            </li>
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
        <main className="flex-grow p-6 overflow-y-auto">
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
