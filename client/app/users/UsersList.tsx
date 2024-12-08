"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  status: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justification, setJustification] = useState<string>("");  // Justificación para suspensión
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [action, setAction] = useState<"suspend" | "delete" | "reactivate" | null>(null);
  const [userIdToActOn, setUserIdToActOn] = useState<string | null>(null);

  const API_URL = "http://localhost:4000/api/users";

  // Obtener usuarios
  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(API_URL);
      // Filtrar solo los usuarios activos o suspendidos
      const filteredUsers = response.data.filter(user => user.status !== 'eliminado');
      setUsers(filteredUsers);
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

  const [userType, setUserType] = useState("");
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("email");

    if (storedUserType) setUserType(storedUserType);

    setLoading(false);
  }, []);

  // Parte donde manejas la suspensión de usuarios
  const [suspensionReason, setSuspensionReason] = useState<string>("");

  // Manejar cambio en el campo de justificación
  const handleSuspensionReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuspensionReason(e.target.value);
  };

  const handleSuspend = (userId: string) => {
    setAction("suspend");
    setUserIdToActOn(userId);
    setIsConfirmationModalOpen(true);  // Abre el modal de confirmación
  };

  const handleReactivate = (userId: string) => {
    setAction("reactivate");
    setUserIdToActOn(userId);
    setIsConfirmationModalOpen(true);  // Abre el modal de confirmación
  };

  const handleDelete = (userId: string) => {
    setAction("delete");
    setUserIdToActOn(userId);
    setIsConfirmationModalOpen(true);  // Abre el modal de confirmación
  };

  const handleConfirmAction = async () => {
    setLoading(true);

    try {
      if (action === "suspend" && justification) {
        // Confirmar suspensión
        await axios.patch(`${API_URL}/${userIdToActOn}/suspend`, { justification });
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userIdToActOn ? { ...user, status: 'suspendido' } : user
          )
        );
        setSuspensionReason("");  // Limpiar justificación
      } else if (action === "delete") {
        // Confirmar eliminación
        await axios.delete(`${API_URL}/${userIdToActOn}`);
        setUsers((prev) => prev.filter((user) => user.id !== userIdToActOn));
      } else if (action === "reactivate") {
        // Confirmar reactivación
        await axios.patch(`${API_URL}/${userIdToActOn}/reactivate`);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userIdToActOn ? { ...user, status: 'activo', suspensionReason: null } : user
          )
        );
      }
      setIsConfirmationModalOpen(false);  // Cerrar el modal
    } catch (err: any) {
      setError("Error al realizar la acción");
    } finally {
      setLoading(false);
      setAction(null);
      setUserIdToActOn(null);  // Limpiar estado
    }
  };

  return (
    <div className="p-6">

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
              {userType === "admin" ? (
                <th className="py-2 px-4 border-b">Acciones</th>
              ) : <th></th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.userType}</td>
                <td className="py-2 px-4 border-b">{user.status === 'activo' ? 'Activo' : 'Suspendido'}</td>
                {userType === 'admin' && (
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    {user.status !== 'suspendido' && (
                      <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 ml-2"
                        onClick={() => handleSuspend(user.id)}
                      >
                        Suspender
                      </button>
                    )}
                    {user.status === 'suspendido' && (
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 ml-2"
                        onClick={() => handleReactivate(user.id)}
                      >
                        Reactivar
                      </button>
                    )}
                    {user.status !== 'eliminado' && (
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                        onClick={() => handleDelete(user.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-xl font-bold mb-4">Confirmar Acción</h2>
            <div className="space-y-4">
              <p>¿Estás seguro de que deseas {action === "suspend" ? "suspender" : action === "delete" ? "eliminar" : "reactivar"} este usuario?</p>
              {action === "suspend" && (
                <div>
                  <label className="block font-medium">Justificación</label>
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                    placeholder="Escribe la razón de la suspensión"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setIsConfirmationModalOpen(false)}  // Cerrar modal
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleConfirmAction}  // Confirmar la acción
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
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
