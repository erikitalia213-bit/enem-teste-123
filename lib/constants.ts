/* Constantes públicas (no contienen contenido de pago). */
import type { DefenseGroup, DrillCategory } from "./types";

export const PLAY_CATEGORIES = [
  "Pases cortos",
  "Pases medios",
  "Pases profundos",
  "Red Zone",
  "Conversiones",
  "Screens",
  "Motion",
  "Conceptos simples",
  "Para principiantes",
  "Contra zona",
  "Contra hombre",
  "Jugadas sorpresa",
  "Situaciones especiales",
] as const;

export type PlayCategory = (typeof PLAY_CATEGORIES)[number];

export const DRILL_CATEGORIES: DrillCategory[] = [
  "Warm-up",
  "Pase",
  "Recepción",
  "Rutas",
  "Flag pulling",
  "Agilidad",
  "Velocidad",
  "Ataque",
  "Defensa",
  "Comunicación",
  "QB",
  "Red Zone",
  "Juego",
  "Vuelta a la calma",
];

export const DEFENSE_GROUPS: DefenseGroup[] = ["Zona", "Hombre", "Presión", "Mixtas", "Situacionales"];

export const DIPLOMA_TYPES = [
  "Campeón del Torneo",
  "Subcampeón del Torneo",
  "Juego Limpio",
  "Mejor Compañero",
  "Mejor Atrapada",
  "Mejor Defensa",
  "Espíritu Deportivo",
  "Participación Destacada",
];
