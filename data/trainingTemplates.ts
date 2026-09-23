/* ============================================================
 *  PLANTILLAS DEL GENERADOR DE ENTRENAMIENTOS
 *  Cada objetivo define fases con peso (proporción del tiempo)
 *  y las categorías de drills que pueden llenar esa fase.
 *  El generador (lib/generator.ts) reparte los minutos y elige
 *  drills según edad, nivel y número de jugadores.
 * ============================================================ */

import type { AgeGroup, DrillCategory, TrainingGoal } from "@/lib/types";

export interface TemplatePhase {
  phase: string;
  weight: number;
  cats: DrillCategory[];
  /** Se elimina en sesiones cortas (≤ 30 min) */
  optional?: boolean;
}

export const TRAINING_TEMPLATES: Record<TrainingGoal, TemplatePhase[]> = {
  Pase: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica de pase", weight: 25, cats: ["Pase"] },
    { phase: "QB y timing", weight: 20, cats: ["QB", "Rutas"], optional: true },
    { phase: "Situación ofensiva", weight: 20, cats: ["Ataque"] },
    { phase: "Scrimmage", weight: 15, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  Recepción: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica de recepción", weight: 25, cats: ["Recepción"] },
    { phase: "Recepción en ruta", weight: 20, cats: ["Rutas", "Recepción"], optional: true },
    { phase: "Situación ofensiva", weight: 20, cats: ["Ataque"] },
    { phase: "Scrimmage", weight: 15, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  Rutas: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica de rutas", weight: 25, cats: ["Rutas"] },
    { phase: "Cortes y agilidad", weight: 15, cats: ["Agilidad"], optional: true },
    { phase: "Timing con QB", weight: 20, cats: ["Rutas", "QB"] },
    { phase: "Scrimmage", weight: 20, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  "Flag pulling": [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica de flag pulling", weight: 25, cats: ["Flag pulling"] },
    { phase: "Agilidad defensiva", weight: 15, cats: ["Agilidad", "Defensa"], optional: true },
    { phase: "Situación defensiva", weight: 20, cats: ["Flag pulling", "Defensa"] },
    { phase: "Scrimmage", weight: 20, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  Agilidad: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Agilidad", weight: 25, cats: ["Agilidad"] },
    { phase: "Velocidad", weight: 20, cats: ["Velocidad"] },
    { phase: "Aplicación con balón", weight: 15, cats: ["Rutas", "Flag pulling"], optional: true },
    { phase: "Scrimmage", weight: 20, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  Ataque: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica individual", weight: 20, cats: ["Pase", "Recepción", "Rutas"] },
    { phase: "Instalación de jugadas", weight: 25, cats: ["Ataque"] },
    { phase: "Comunicación", weight: 10, cats: ["Comunicación"], optional: true },
    { phase: "Scrimmage", weight: 25, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  Defensa: [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Fundamentos defensivos", weight: 20, cats: ["Defensa"] },
    { phase: "Flag pulling", weight: 20, cats: ["Flag pulling"] },
    { phase: "Comunicación defensiva", weight: 15, cats: ["Comunicación", "Defensa"], optional: true },
    { phase: "Scrimmage", weight: 25, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  "Red Zone": [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Rutas cortas", weight: 20, cats: ["Rutas", "Red Zone"] },
    { phase: "Red Zone", weight: 30, cats: ["Red Zone"] },
    { phase: "Defensa en zona roja", weight: 10, cats: ["Defensa"], optional: true },
    { phase: "Scrimmage de zona roja", weight: 20, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  "Juego completo": [
    { phase: "Calentamiento", weight: 15, cats: ["Warm-up"] },
    { phase: "Técnica ofensiva", weight: 15, cats: ["Pase", "Recepción", "Rutas"] },
    { phase: "Técnica defensiva", weight: 15, cats: ["Flag pulling", "Defensa"] },
    { phase: "Situaciones", weight: 15, cats: ["Ataque", "Red Zone"], optional: true },
    { phase: "Scrimmage", weight: 35, cats: ["Juego"] },
    { phase: "Vuelta a la calma", weight: 5, cats: ["Vuelta a la calma"], optional: true },
  ],
  "Preparación para partido": [
    { phase: "Calentamiento de partido", weight: 15, cats: ["Warm-up"] },
    { phase: "Repaso de jugadas", weight: 20, cats: ["Ataque"] },
    { phase: "Comunicación", weight: 10, cats: ["Comunicación"], optional: true },
    { phase: "Zona roja y conversiones", weight: 15, cats: ["Red Zone"] },
    { phase: "Simulación de partido", weight: 35, cats: ["Juego"] },
    { phase: "Charla final", weight: 5, cats: ["Vuelta a la calma"] },
  ],
};

/** Consejos adicionales por edad que el generador agrega a cada bloque. */
export const AGE_TIPS: Record<AgeGroup, string> = {
  "6-8": "Con 6-8 años convierte el ejercicio en juego, usa instrucciones de una sola frase y cambia de actividad antes de que se aburran.",
  "9-11": "Con 9-11 años explica el porqué de cada ejercicio y usa pequeñas competencias para mantener la intensidad.",
  "12-14": "Con 12-14 años exige técnica correcta y empieza a enseñar lecturas simples de defensa.",
  "15-17": "Con 15-17 años trabaja a velocidad de partido y pide que los jugadores corrijan a sus compañeros.",
  Adultos: "Con adultos cuida el calentamiento y los descansos; prioriza la ejecución de jugadas sobre el volumen físico.",
};

/** Recomendaciones generales según duración. */
export const DURATION_NOTES: Record<number, string> = {
  30: "Sesión corta: menos explicaciones y más repeticiones. Llega con los conos ya colocados.",
  45: "Sesión estándar para escuelas y categorías infantiles.",
  60: "Duración ideal para la mayoría de los equipos. Incluye una pausa de hidratación a la mitad.",
  75: "Sesión larga: agrega dos pausas de hidratación y cambia de estación cada 10-15 minutos.",
  90: "Sesión completa: planea dos pausas de hidratación y reduce la intensidad en la última parte si hace calor.",
};
