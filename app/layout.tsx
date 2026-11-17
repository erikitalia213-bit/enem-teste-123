import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import { APP_NOME, APP_NOME_COMPLETO, urlApp } from "@/lib/config";
import { RegistrarServiceWorker } from "@/components/pwa/RegistrarServiceWorker";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--fonte-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--fonte-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(urlApp),
  title: { default: APP_NOME_COMPLETO, template: `%s · ${APP_NOME}` },
  description: "Seu treino de glúteo guiado por 42 dias, com cardápio e acompanhamento até o Réveillon.",
  applicationName: APP_NOME,
  appleWebApp: { capable: true, title: "42 Dias", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icones/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icones/icone-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icones/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${inter.variable}`}>
      <body className="bg-fundo text-texto">
        {children}
        <RegistrarServiceWorker />
      </body>
    </html>
  );
}
