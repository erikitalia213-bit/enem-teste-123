"use client";

/** Comemoração com confete nas cores do app (carregado sob demanda). */
export async function soltarConfete(intenso = false) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const cores = ["#c6f432", "#ff3d8b", "#f5d76e", "#ffffff"];
  confetti({ particleCount: intenso ? 160 : 90, spread: 80, origin: { y: 0.65 }, colors: cores, disableForReducedMotion: true });
  if (intenso) {
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: cores }), 250);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: cores }), 400);
  }
}
