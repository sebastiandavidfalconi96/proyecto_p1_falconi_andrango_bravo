import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/", // Ruta raíz
        destination: "/login", // A dónde redirige
        permanent: false, // false significa que es un redireccionamiento temporal
      },
    ];
  },
  /* otras opciones de configuración aquí */
};

export default nextConfig;
