import type { NextConfig } from "next";

/**
 * FLAGLAB 5x5 se exporta como sitio estático (carpeta /out).
 * Así puedes subirlo a Vercel, Netlify, Hostinger, Cloudflare Pages o cualquier hosting.
 * Todas las herramientas funcionan en el navegador (localStorage), sin backend.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
