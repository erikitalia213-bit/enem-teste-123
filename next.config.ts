import type { NextConfig } from "next";

/**
 * FLAGLAB 5x5 corre como app Next.js con servidor (Vercel, Netlify, Render o Node propio):
 * el servidor valida la sesión de Supabase y solo envía al navegador el contenido que el
 * usuario compró. Los webhooks de pago (/api/webhooks/*) también requieren servidor.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/app/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
};

export default nextConfig;
