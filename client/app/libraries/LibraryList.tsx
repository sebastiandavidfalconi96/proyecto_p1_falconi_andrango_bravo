"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from "@/app/modal/modal";

const LibrariesList = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newLibrary, setNewLibrary] = useState({
    name: "",
    address: "",
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
      setError("No se pudieron cargar las bibliotecas. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const handleCreateLibrary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/libraries", newLibrary);
      setLibraries([...libraries, response.data]);
      setNewLibrary({ name: "", address: "" });
      setCreateModalOpen(false);
    } catch (err) {
      console.error("Error al crear la biblioteca:", err);
      setError("No se pudo crear la biblioteca.");
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
          <div>
            <label className="block text-sm font-medium">Nombre</label>
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
