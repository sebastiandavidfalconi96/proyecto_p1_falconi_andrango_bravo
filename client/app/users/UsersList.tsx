"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/users";

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(API_URL);
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar edición de usuario
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData(user);
    setIsEditing(true);
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${selectedUser.id}`, formData);
      setUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? response.data : user))
      );
      setIsEditing(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {error && <p className="text-red-500">Error: {error}</p>}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Tipo</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{`${user.fullName}`}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.userType}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditing && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div>
                <label className="block font-medium">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <div>
                <label className="block font-medium">Tipo de Usuario</label>
                <select
                  name="userType"
                  value={formData.userType || ""}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="creator">Creador</option>
                  <option value="consumer">Consumidor</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
