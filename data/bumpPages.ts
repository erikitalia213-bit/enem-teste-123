/* ============================================================
 *  Páginas de venta/resumen de los order bumps (/extras/…)
 * ============================================================ */

import type { OrderBumpId } from "@/config";

export const BUMP_PAGES: Record<OrderBumpId, { tagline: string; intro: string; includes: string[]; forWho: string[]; appPath: string }> = {
  defensa: {
    tagline: "Tu defensa, organizada y lista para el partido.",
    intro: "30 esquemas defensivos originales con diagrama, explicación, fortalezas, debilidades, cuándo usarlos y consejo para el coach. Además, conceptos clave y una guía de defensa por situación.",
    includes: [
      "30 esquemas con diagrama: zona, hombre, presión, mixtas y situacionales",
      "Conceptos: zona vs hombre, rusher, comunicación y flag pulling",
      "Coberturas explicadas paso a paso",
      "Guía de situaciones: primera y 10, tercera y larga, zona roja, conversiones y última jugada",
      "Agrega cualquier esquema a la sección Defensiva de tu playbook",
      "Vista imprimible",
    ],
    forWho: ["Coaches que quieren dejar de improvisar en defensa", "Equipos que reciben muchos puntos por pases largos o cruces", "Categorías juveniles que empiezan a usar zona y hombre"],
    appPath: "/app/extras/playbook-defensivo/",
  },
  pack50: {
    tagline: "50 sesiones más, organizadas por tema.",
    intro: "Un pack adicional de entrenamientos completos con tiempos y ejercicios, pensados para situaciones concretas de tu temporada.",
    includes: [
      "10 sesiones para infantiles de 6 a 8 años",
      "15 sesiones por posición: QB, receptores y defensa",
      "8 sesiones de pretemporada en progresión",
      "5 sesiones para la semana de partido",
      "7 sesiones exprés de 30 minutos",
      "5 sesiones para calor, espacio reducido y grupos grandes",
      "Guárdalas en tus entrenamientos y edítalas",
    ],
    forWho: ["Coaches que entrenan 2-3 veces por semana", "Academias con varias categorías", "Quien quiere variedad sin repetir sesiones"],
    appPath: "/app/extras/pack-50-entrenamientos/",
  },
  escolar: {
    tagline: "Todo lo que un profesor necesita para una unidad completa.",
    intro: "Complementa las 20 clases incluidas con 20 clases más, planificación, evaluación con rúbrica, torneo escolar y diplomas editables.",
    includes: [
      "20 clases adicionales (clases 21 a 40)",
      "Planificación de 8 semanas",
      "Rúbrica de evaluación con 6 criterios y 4 niveles",
      "Hoja de registro del grupo imprimible",
      "Guía para organizar un torneo escolar",
      "Diplomas editables e imprimibles (8 reconocimientos)",
    ],
    forWho: ["Profesores de educación física", "Coordinadores deportivos escolares", "Clubes que trabajan con escuelas"],
    appPath: "/app/extras/kit-coach-escolar/",
  },
};
