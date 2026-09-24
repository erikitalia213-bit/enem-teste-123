import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ToastProvider } from "@/components/ui";
import { BRAND } from "@/config";

// Fuentes locales con precarga y fallback ajustado (evita saltos de diseño al cargar).
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const barlow = localFont({
  src: [
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", weight: "700" },
    { path: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-barlow",
  display: "swap",
  adjustFontFallback: "Arial",
});

const title = "FLAGLAB 5x5 | Jugadas y Entrenamientos de Tocho Bandera";
const description = "Herramienta digital para coaches de tocho bandera 5x5. Crea jugadas, organiza tu playbook y prepara entrenamientos.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: { default: title, template: "%s | FLAGLAB 5x5" },
  description,
  applicationName: "FLAGLAB 5x5",
  keywords: ["tocho bandera", "flag football", "flag football 5x5", "jugadas de tocho bandera", "entrenamientos de tocho", "playbook tocho bandera", "coach tocho bandera", "México"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "FLAGLAB 5x5",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "FLAGLAB 5x5 — sistema digital para coaches de tocho bandera" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070909",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${barlow.variable}`}>
      <body className="min-h-dvh">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-volt focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">
          Saltar al contenido
        </a>
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
