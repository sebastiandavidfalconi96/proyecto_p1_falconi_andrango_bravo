"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Para redireccionar

  // Función para sanitizar valores (permite letras, números, espacios y puntos)
  const sanitizeValue = (value) => value.replace(/[^a-zA-Z0-9.@\s]/g, "");

  const handleEmailChange = (e) => {
    setEmail(sanitizeValue(e.target.value)); // Sanitiza el valor del correo electrónico
  };

  const handlePasswordChange = (e) => {
    setPassword(sanitizeValue(e.target.value)); // Sanitiza el valor de la contraseña
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer your-secret-key`, // Token textual directamente en el encabezado
          },
        }
      );
      if (response.data.success) {
        const { userType } = response.data.user; // Captura el userType
        const { id } = response.data.user;
        localStorage.setItem("token", response.data.token); // Guarda el token
        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", id);
        localStorage.setItem("email", email);

        router.push("/home"); // Redirige al dashboard
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error en el inicio de sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1">
              Correo Electrónico
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1">
              Contraseña
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <p className="text-sm mt-4 text-center">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </a>
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
