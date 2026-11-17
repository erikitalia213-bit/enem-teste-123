import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Protocolo 42 Dias: Bumbum pro Réveillon",
    short_name: "42 Dias",
    description: "Treino de glúteo guiado por 42 dias, com cardápio e acompanhamento até o Réveillon.",
    lang: "pt-BR",
    dir: "ltr",
    start_url: "/hoje",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    categories: ["health", "fitness", "lifestyle"],
    icons: [
      { src: "/icones/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones/icone-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icones/icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Treino de hoje", url: "/hoje", icons: [{ src: "/icones/icone-192.png", sizes: "192x192" }] },
      { name: "Cardápio", url: "/cardapio", icons: [{ src: "/icones/icone-192.png", sizes: "192x192" }] },
    ],
  };
}
