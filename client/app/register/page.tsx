"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "consumer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      setError(""); // Clear error if input becomes valid
    } else {
      setError("Algunos campos tienen caracteres no permitidos o exceden el límite.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/users", formData);

      if (response.status === 201) {
        alert("Usuario registrado con éxito.");
        router.push("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Registrarse"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;