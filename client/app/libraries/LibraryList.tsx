"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from "@/app/modal/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LibrariesList = () => {
  
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newLibrary, setNewLibrary] = useState({
    name: "",
    address: "",
    subscription: "",
    status: "ACTIVE",
  });

  const validateInput = (name, value) => {
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9@.]*$/;
      return emailRegex.test(value);
    }

    if (name === "firstName" || name === "lastName" || name === "password") {
      const textRegex = /^[a-zA-Z0-9]{0,10}$/;
      return textRegex.test(value);
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (validateInput(name, value)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    libraryId: "",
    password: "",
    confirmPassword: "",
    userType: "admin",
  });

  const [editLibrary, setEditLibrary] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [libraryToDelete, setLibraryToDelete] = useState(null);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/libraries");
      setLibraries(response.data);
    } catch (err) {
      console.error("Error al cargar las bibliotecas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  

  const handleCreateLibrary = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      // 1. Crear la biblioteca
      const libraryRes = await axios.post("http://localhost:4000/api/libraries", newLibrary);
      const newLibraryId = libraryRes.data.id;
  
      // 2. Validar los datos del usuario (quitamos libraryId porque ya no lo necesitamos del form)
      const { firstName, lastName, email, password, confirmPassword } = formData;
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError("Por favor, completa todos los campos.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
  
      // 3. Crear el usuario usando el ID de la biblioteca recién creada
      const userRes = await axios.post("http://localhost:4000/api/users", {
        ...formData,
        libraryId: newLibraryId, // Usamos el ID que acabamos de obtener
      });
      if (userRes.status === 201) {
        alert("Usuario registrado con éxito.");
      }
  
      // 4. Actualizar estado de bibliotecas y limpiar formularios
      setLibraries([...libraries, libraryRes.data]);
      setNewLibrary({ name: "", address: "", subscription: "", status: ""});
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        // libraryId: "" // Si quieres lo puedes eliminar completamente
      });
      setCreateModalOpen(false);
  
    } catch (err) {
      console.error("Error al crear la biblioteca o el usuario:", err);
      setError(err.response?.data?.error || "No se pudo crear la biblioteca o el usuario.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleEditLibrary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/api/libraries/${editLibrary.id}`,
        editLibrary
      );
      const updatedLibraries = libraries.map((library) =>
        library.id === editLibrary.id ? response.data : library
      );
      setLibraries(updatedLibraries);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error al editar la biblioteca:", err);
      setError("No se pudo editar la biblioteca.");
    }
  };

  const handleDeleteLibrary = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/libraries/${libraryToDelete.id}`);
      setLibraries(libraries.filter((library) => library.id !== libraryToDelete.id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error("Error al eliminar la biblioteca:", err);
      setError("No se pudo eliminar la biblioteca.");
    }
  };

  if (loading) return <p>Cargando bibliotecas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => setCreateModalOpen(true)}
        className="p-2 mb-4 bg-green-500 text-white rounded-md"
      >
        Crear Nueva Biblioteca
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((library) => (
          <Card key={library.id} className="shadow-sm hover:shadow-md transition">
            <CardHeader>
              <CardTitle>{library.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{library.address}</CardDescription>
              <CardDescription>{library.subscription}</CardDescription>
              <CardDescription>{library.status}</CardDescription>
              <button
                onClick={() => {
                  setEditLibrary(library);
                  setEditModalOpen(true);
                }}
                className="mt-2 text-blue-500"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setLibraryToDelete(library);
                  setDeleteModalOpen(true);
                }}
                className="mt-2 ml-4 text-red-500"
              >
                Eliminar
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para crear biblioteca */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Crear Biblioteca</h2>
        <form onSubmit={handleCreateLibrary} className="space-y-4">
          <h1><b>Datos Biblioteca</b></h1>
          <div>
            
            <label className="block text-sm font-medium">Nombre Biblioteca</label>
            <input
              type="text"
              name="name"
              value={newLibrary.name}
              onChange={(e) => setNewLibrary({ ...newLibrary, name: e.target.value })}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              name="address"
              value={newLibrary.address}
              onChange={(e) => setNewLibrary({ ...newLibrary, address: e.target.value })}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tiempo Subscripción</label>
            <select
              name="subscription"
              value={newLibrary.subscription}
              onChange={(e) => setNewLibrary({ ...newLibrary, subscription: e.target.value })}
              className="p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Selecciona una opción</option>
              <option value="3 meses">3 meses</option>
              <option value="6 meses">6 meses</option>
              <option value="12 meses">12 meses</option>
            </select>
          </div>
    
          <div>

          <h1><b>Datos Administrador</b></h1>
            <Label htmlFor="firstName" className="mb-1">
              Nombre
            </Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Ingresa tu nombre"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-1">
              Apellido
            </Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Ingresa tu apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1">
              Correo Electrónico
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="password" className="mb-1">
              Contraseña
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-1">
              Confirmar Contraseña
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Crear
          </button>
        </form>
      </Modal>

      {/* Modal para editar biblioteca */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Editar Biblioteca</h2>
        <form onSubmit={handleEditLibrary} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={editLibrary?.name || ""}
              onChange={(e) => setEditLibrary({ ...editLibrary, name: e.target.value })}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              name="address"
              value={editLibrary?.address || ""}
              onChange={(e) => setEditLibrary({ ...editLibrary, address: e.target.value })}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Guardar
          </button>
        </form>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-xl font-bold">¿Estás seguro de que quieres eliminar esta biblioteca?</h2>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleDeleteLibrary}
            className="p-2 bg-red-600 text-white rounded-md"
          >
            Eliminar
          </button>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="p-2 bg-gray-500 text-white rounded-md"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LibrariesList;
