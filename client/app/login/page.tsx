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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://stunning-fortnight-j9xv4995xw3q6j6-4000.app.github.dev/api/users/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { userType } = response.data.user; // Captura el userType
        localStorage.setItem("token", response.data.token); // Guarda el token
        localStorage.setItem("userType", userType);
        localStorage.setItem("email", email);
        router.push("/dashboard"); // Redirige al dashboard
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
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
