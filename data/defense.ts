/* ============================================================
 *  ORDER BUMP 1 — PLAYBOOK DEFENSIVO 5x5
 *  30 esquemas defensivos originales con diagrama.
 *  Notación de defensores: [etiqueta, x, y, acción]
 *   acción: { z: [cx, cy, rx, ry] }  zona
 *           { d: [x, y] }            desplazamiento / caída
 *           { m: "X" }               marca hombre a hombre
 *           "rush"                   presión al QB
 *   Coordenadas del diagrama: 0-100 ancho, LOS en y=62.
 * ============================================================ */

import { LOS_Y, ROUTE_COLORS, offensePlayers } from "@/lib/field";
import type { Diagram, DiagramPlayer, DiagramRoute, DiagramZone, FormationId, Level } from "@/lib/types";

import { DEFENSE_GROUPS } from "@/lib/constants";
import type { DefenseGroup } from "@/lib/types";
export { DEFENSE_GROUPS };
export type { DefenseGroup };

type Action = { z: [number, number, number, number] } | { d: [number, number] } | { m: string } | "rush" | undefined;
type Def = [label: string, x: number, y: number, action?: Action];

import type { DefenseScheme } from "@/lib/types";
export type { DefenseScheme };

const ZONE_COLORS = ["#5AC8FA", "#49F05A", "#FFD23F", "#FF6BD6", "#9DA3A3"];

function buildDefense(vs: FormationId, defs: Def[], mirror = false): Diagram {
  const offense = offensePlayers(vs, mirror);
  const players: DiagramPlayer[] = [...offense];
  const routes: DiagramRoute[] = [];
  const zones: DiagramZone[] = [];
  defs.forEach(([label, x, y, action], i) => {
    const id = `D${i + 1}`;
    players.push({ id, team: "D", label, role: label, x, y });
    if (!action) return;
    if (action === "rush") {
      routes.push({ id: `dr${i}`, playerId: id, type: "rush", points: [{ x: 50, y: LOS_Y + 8 }], color: ROUTE_COLORS.defense, style: "solid", end: "arrow" });
    } else if ("z" in action) {
      const [cx, cy, rx, ry] = action.z;
      zones.push({ id: `z${i}`, x: cx, y: cy, rx, ry, color: ZONE_COLORS[zones.length % ZONE_COLORS.length] });
      routes.push({ id: `dr${i}`, playerId: id, type: "drop", points: [{ x: cx, y: cy }], color: "#FFFFFF", style: "dashed", end: "arrow" });
    } else if ("d" in action) {
      routes.push({ id: `dr${i}`, playerId: id, type: "drop", points: [{ x: action.d[0], y: action.d[1] }], color: "#FFFFFF", style: "solid", end: "arrow" });
    } else if ("m" in action) {
      const target = offense.find((o) => o.id === action.m);
      if (target) {
        const tx = x + (target.x - x) * 0.7;
        const ty = y + (target.y - y) * 0.7;
        routes.push({ id: `dr${i}`, playerId: id, type: "custom", points: [{ x: Math.round(tx * 10) / 10, y: Math.round(ty * 10) / 10 }], color: ROUTE_COLORS.defense, style: "dashed", end: "none" });
      }
    }
  });
  // las rutas de zona se dibujan pero las líneas de marca deben quedar debajo de los jugadores: ya lo hace PlayDiagram
  return { players, routes, notes: [], zones };
}

function scheme(
  id: string,
  name: string,
  group: DefenseGroup,
  level: Level,
  vs: FormationId,
  defs: Def[],
  t: { concept: string; strengths: string[]; weaknesses: string[]; when: string; tip: string },
  mirror = false,
): DefenseScheme {
  return { id, name, group, level, vs, diagram: buildDefense(vs, defs, mirror), concept: t.concept, strengths: t.strengths, weaknesses: t.weaknesses, whenToUse: t.when, coachTip: t.tip };
}

const R: Def = ["R", 50, 34, "rush"];

export const DEFENSE_SCHEMES: DefenseScheme[] = [
  /* ======================= ZONA ======================= */
  scheme("df-01", "Zona 2 Base", "Zona", "Principiante", "spread",
    [["CB", 12, 50, { z: [14, 46, 12, 7] }], ["CB", 88, 50, { z: [86, 46, 12, 7] }], ["S", 30, 30, { z: [28, 20, 22, 11] }], ["S", 70, 30, { z: [72, 20, 22, 11] }], R],
    { concept: "Dos safeties dividen el fondo en dos mitades. Las esquinas cuidan los flats. El rusher presiona.", strengths: ["Protege contra pases largos.", "Fácil de enseñar: cada quien cuida su espacio."], weaknesses: ["El centro corto queda libre.", "Hueco entre esquina y safety en la banda (15-20 yardas)."], when: "Contra equipos que buscan el pase largo o cuando proteges una ventaja.", tip: "Los safeties no deben bajar por pases cortos. Si bajan, el fondo queda abierto." }),
  scheme("df-02", "Zona 3", "Zona", "Principiante", "spread",
    [["CB", 10, 44, { z: [15, 18, 15, 12] }], ["CB", 90, 44, { z: [85, 18, 15, 12] }], ["S", 50, 26, { z: [50, 16, 17, 12] }], ["LB", 50, 48, { z: [50, 44, 24, 8] }], R],
    { concept: "Tres defensores dividen el fondo en tercios. El apoyador cuida todo lo corto en medio.", strengths: ["Muy segura contra pases profundos.", "Buena para equipos que empiezan a defender en zona."], weaknesses: ["Los flats quedan libres.", "Un solo defensor para toda la zona corta."], when: "Cuando el rival tiene un receptor muy rápido o un QB de brazo fuerte.", tip: "El apoyador debe leer al QB y moverse hacia donde mira. No se queda quieto." }),
  scheme("df-03", "Cuartos", "Zona", "Intermedio", "spread",
    [["CB", 10, 46, { z: [12, 28, 12, 14] }], ["S", 36, 34, { z: [37, 24, 12, 14] }], ["S", 64, 34, { z: [63, 24, 12, 14] }], ["CB", 90, 46, { z: [88, 28, 12, 14] }], R],
    { concept: "Cuatro defensores dividen el campo en cuatro carriles verticales.", strengths: ["Dificulta mucho los pases profundos.", "Buena contra cuatro verticales."], weaknesses: ["Todo lo corto está disponible.", "Exige buen flag pulling después de la recepción."], when: "Al final de la mitad o del partido cuando el rival necesita un pase largo.", tip: "Si aceptas los pases cortos, retira la flag de inmediato. Cero yardas después de la recepción." }),
  scheme("df-04", "Tres Abajo, Uno Arriba", "Zona", "Principiante", "twins",
    [["CB", 15, 50, { z: [15, 46, 14, 7] }], ["LB", 50, 50, { z: [50, 46, 14, 7] }], ["CB", 85, 50, { z: [85, 46, 14, 7] }], ["S", 50, 26, { z: [50, 18, 40, 11] }], R],
    { concept: "Tres defensores cubren el campo corto de lado a lado. Un safety cuida todo el fondo.", strengths: ["Cierra los pases cortos y medios.", "Ideal contra equipos que viven del pase rápido."], weaknesses: ["El safety tiene mucho espacio que cubrir.", "Vulnerable a dos rutas profundas."], when: "Contra equipos jóvenes o con QB de poco brazo.", tip: "El safety empieza profundo y no baja hasta que el balón sale." }),
  scheme("df-05", "Media Profunda", "Zona", "Intermedio", "spread",
    [["CB", 12, 48, { z: [14, 44, 12, 7] }], ["CB", 88, 48, { z: [86, 44, 12, 7] }], ["S", 30, 30, { z: [28, 20, 20, 11] }], ["S", 70, 30, { z: [72, 20, 20, 11] }], ["LB", 50, 48, { z: [50, 30, 9, 12] }]],
    { concept: "Variante de Zona 2 donde el apoyador corre hacia atrás a cubrir el centro profundo. Sin rusher.", strengths: ["Tapa el hueco del centro de la Zona 2.", "Cinco defensores en cobertura."], weaknesses: ["El QB tiene mucho tiempo.", "Exige un apoyador rápido."], when: "Contra equipos que atacan el centro con postes y cruces.", tip: "Sin rusher, cuenta en voz alta el tiempo del QB si tu liga usa reloj de pase." }),
  scheme("df-06", "Rotación Fuerte", "Zona", "Avanzado", "trips-right",
    [["CB", 12, 46, { z: [16, 22, 16, 13] }], ["S", 58, 28, { z: [50, 18, 16, 11] }], ["CB", 90, 50, { z: [86, 44, 12, 7] }], ["LB", 66, 50, { z: [62, 44, 12, 7] }], R],
    { concept: "La defensa gira hacia el lado de trips. El safety se mueve hacia el centro-derecha y la esquina de ese lado baja al flat.", strengths: ["Más defensores del lado donde hay más receptores.", "Tapa los ataques de sobrecarga."], weaknesses: ["El lado débil queda con un solo defensor.", "Si el ataque cambia de lado con motion, hay que girar de nuevo."], when: "Contra formaciones de trips o bunch.", tip: "Define una palabra para girar: 'derecha' o 'izquierda'. El safety la grita antes del snap." }),
  scheme("df-07", "Muro", "Zona", "Avanzado", "empty",
    [["CB", 10, 50, { z: [12, 44, 11, 8] }], ["LB", 36, 48, { z: [36, 42, 11, 8] }], ["LB", 64, 48, { z: [64, 42, 11, 8] }], ["CB", 90, 50, { z: [88, 44, 11, 8] }], ["S", 50, 24, { z: [50, 18, 38, 11] }]],
    { concept: "Cinco defensores en cobertura y ninguno presiona. Cuatro zonas cortas y un safety en el fondo.", strengths: ["Llena el campo de defensores.", "Frustra a QBs impacientes."], weaknesses: ["El QB tiene todo el tiempo.", "Requiere reloj de pase en tu liga para funcionar."], when: "Contra un QB muy bueno que castiga la presión.", tip: "Úsala solo algunas jugadas. Si la usas siempre, el QB se acomoda." }),
  scheme("df-08", "Zona Espejo", "Zona", "Intermedio", "trips-left",
    [["CB", 10, 46, { z: [14, 22, 15, 13] }], ["LB", 30, 50, { z: [28, 44, 13, 7] }], ["S", 44, 30, { z: [42, 18, 16, 11] }], ["CB", 88, 46, { z: [84, 28, 16, 16] }], R],
    { concept: "Ajuste de zona contra trips a la izquierda. Tres defensores del lado fuerte y una esquina sola en el lado débil.", strengths: ["Iguala el número de receptores y defensores.", "Fácil de ajustar a cualquier lado."], weaknesses: ["La esquina del lado débil está sola.", "Vulnerable a jugadas hacia el lado vacío."], when: "Cuando el rival usa trips con frecuencia.", tip: "Practica el ajuste cambiando la formación del ataque sin avisar." }),

  /* ======================= HOMBRE ======================= */
  scheme("df-09", "Hombre Puro", "Hombre", "Principiante", "spread",
    [["CB", 8, 56, { m: "X" }], ["CB", 92, 56, { m: "Z" }], ["LB", 60, 52, { m: "Y" }], ["S", 50, 48, { m: "C" }], R],
    { concept: "Cada defensor sigue a un receptor. Nadie ayuda en el fondo. El rusher presiona.", strengths: ["Muy agresiva.", "Fácil de explicar: 'tú con él'."], weaknesses: ["Si alguien pierde a su receptor, es touchdown.", "Vulnerable a cruces y dobles movimientos."], when: "Cuando tus defensores son más rápidos o en situaciones cortas.", tip: "Asigna parejas por velocidad. El defensor más rápido marca al receptor más peligroso." }),
  scheme("df-10", "Hombre con Safety", "Hombre", "Intermedio", "spread",
    [["CB", 8, 56, { m: "X" }], ["CB", 92, 56, { m: "Z" }], ["LB", 60, 52, { m: "Y" }], ["S", 50, 26, { z: [50, 18, 22, 11] }], R],
    { concept: "Tres defensores marcan hombre a hombre y un safety ayuda en el fondo. El centro queda para quien esté más cerca.", strengths: ["Ayuda contra pases largos.", "Permite marcar más pegado."], weaknesses: ["El centro puede quedar libre.", "El safety no puede ayudar a ambos lados a la vez."], when: "La defensa base para equipos intermedios.", tip: "Regla del centro: si el centro sale, el apoyador lo toma; si no sale, el apoyador ayuda en medio." }),
  scheme("df-11", "Hombre Presionado", "Hombre", "Avanzado", "twins",
    [["CB", 8, 58, { m: "X" }], ["CB", 76, 59, { m: "Y" }], ["CB", 88, 58, { m: "Z" }], ["S", 50, 26, { z: [50, 18, 22, 11] }], R],
    { concept: "Los defensores se colocan pegados a los receptores en la línea para romper el ritmo de las rutas.", strengths: ["Dificulta los pases rápidos.", "Rompe el timing QB-receptor."], weaknesses: ["Si el receptor gana la salida, queda libre.", "Riesgo de contacto: los defensores deben evitarlo."], when: "Contra equipos que dependen del pase rápido.", tip: "En tocho no hay contacto: el defensor espeja con los pies, nunca con las manos." }),
  scheme("df-12", "Hombre Suelto", "Hombre", "Principiante", "empty",
    [["CB", 5, 48, { m: "X" }], ["CB", 70, 50, { m: "Y" }], ["CB", 95, 48, { m: "Z" }], ["LB", 50, 50, { m: "C" }], R],
    { concept: "Marca hombre a hombre con 5-6 yardas de colchón. El defensor ve toda la ruta.", strengths: ["Pocas jugadas largas.", "Buena para defensores lentos."], weaknesses: ["Pases cortos fáciles.", "Exige buen flag pulling."], when: "Contra receptores más rápidos que tus defensores.", tip: "El colchón se mantiene hasta que el receptor corta. Luego, a cerrar el espacio." }),
  scheme("df-13", "Cambio en Stack", "Hombre", "Avanzado", "stack",
    [["CB", 8, 56, { m: "X" }], ["CB", 82, 54, { d: [86, 46] }], ["LB", 76, 50, { d: [68, 46] }], ["S", 50, 26, { z: [50, 18, 22, 11] }], R],
    { concept: "Contra stack, los dos defensores no eligen receptor antes del snap: uno toma al que sale por fuera y otro al que sale por dentro.", strengths: ["Evita que los receptores se liberen con cruces.", "Nadie choca persiguiendo."], weaknesses: ["Exige comunicación perfecta.", "Si ambos van al mismo receptor, uno queda libre."], when: "Contra stack y bunch.", tip: "Palabras clave: 'afuera' y 'adentro'. Se dicen antes del snap." }),
  scheme("df-14", "Espía", "Hombre", "Intermedio", "spread",
    [["CB", 8, 56, { m: "X" }], ["CB", 92, 56, { m: "Z" }], ["S", 60, 50, { m: "Y" }], ["LB", 50, 50, { d: [50, 54] }], R],
    { concept: "Tres defensores marcan hombre. El apoyador se queda frente al QB y al centro para reaccionar a pases cortos al medio.", strengths: ["Controla al centro y los pases rápidos al medio.", "Útil contra QBs que lanzan pronto."], weaknesses: ["Sin ayuda profunda.", "Si el centro corre profundo, el espía debe seguirlo."], when: "Contra equipos que usan mucho al centro.", tip: "El espía mira al QB. Donde miren los ojos del QB, va el espía." }),
  scheme("df-15", "Doble al Mejor", "Hombre", "Intermedio", "spread",
    [["CB", 8, 56, { m: "X" }], ["S", 22, 40, { d: [14, 34] }], ["CB", 92, 56, { m: "Z" }], ["LB", 60, 52, { m: "Y" }], R],
    { concept: "Dos defensores cubren al mejor receptor rival: uno por abajo y otro por arriba.", strengths: ["Quita al receptor estrella del partido.", "Obliga al QB a buscar su segunda opción."], weaknesses: ["El centro queda sin marca.", "Otro receptor tiene uno contra uno."], when: "Cuando el rival depende de un solo receptor.", tip: "Identifica al mejor receptor en la primera serie. Ajusta a partir de la segunda." }),

  /* ======================= PRESIÓN ======================= */
  scheme("df-16", "Blitz del Apoyador", "Presión", "Intermedio", "spread",
    [["CB", 8, 56, { m: "X" }], ["CB", 92, 56, { m: "Z" }], ["S", 60, 44, { m: "Y" }], ["LB", 40, 34, "rush"], R],
    { concept: "Dos jugadores presionan desde la línea de 7 yardas. Los otros tres marcan hombre a hombre.", strengths: ["El QB tiene muy poco tiempo.", "Provoca pases apresurados."], weaknesses: ["El centro queda libre.", "Si el QB lanza rápido, hay espacio."], when: "En segunda o tercera larga, cuando el rival necesita tiempo.", tip: "Revisa tu reglamento: algunas ligas limitan el número de rushers." }),
  scheme("df-17", "Blitz de Esquina", "Presión", "Avanzado", "twins",
    [["CB", 20, 40, "rush"], ["S", 28, 34, { z: [18, 26, 16, 14] }], ["CB", 76, 56, { m: "Y" }], ["CB", 88, 56, { m: "Z" }], R],
    { concept: "La esquina del lado débil presiona desde afuera y el safety rota para cubrir su zona.", strengths: ["Llega desde un ángulo que el QB no espera.", "Sorprende en jugadas hacia el lado débil."], weaknesses: ["El receptor del lado débil puede quedar libre si el safety llega tarde.", "Solo funciona como sorpresa."], when: "Una o dos veces por mitad.", tip: "La esquina se disfraza hasta el último segundo. Si se mueve antes, el QB lo ve." }),
  scheme("df-18", "Blitz Retrasado", "Presión", "Avanzado", "spread",
    [["CB", 12, 48, { z: [14, 44, 12, 7] }], ["CB", 88, 48, { z: [86, 44, 12, 7] }], ["S", 50, 26, { z: [50, 18, 30, 11] }], ["LB", 56, 36, { d: [52, 66] }], R],
    { concept: "El apoyador espera dos segundos como si cubriera zona y después presiona.", strengths: ["El QB cree que tiene tiempo.", "Rompe el ritmo del ataque."], weaknesses: ["Zona debilitada en el centro.", "Si el QB lanza en 2 segundos, no llega."], when: "Contra QBs que sostienen mucho el balón.", tip: "Cuenta 'uno, dos' y arranca. Practícalo con reloj." }),
  scheme("df-19", "Rusher Fantasma", "Presión", "Avanzado", "spread",
    [["R", 50, 34, { z: [50, 42, 12, 7] }], ["LB", 36, 34, "rush"], ["CB", 10, 48, { z: [14, 30, 14, 16] }], ["CB", 90, 48, { z: [86, 30, 14, 16] }], ["S", 50, 22, { z: [50, 16, 16, 9] }]],
    { concept: "El rusher habitual finge salir y se queda cubriendo el centro. Otro jugador presiona.", strengths: ["Confunde al QB y al centro.", "El pase rápido al medio encuentra a un defensor."], weaknesses: ["Requiere práctica y comunicación.", "El nuevo rusher puede ser más lento."], when: "Contra equipos que lanzan rápido al centro cuando ven presión.", tip: "El rusher fantasma da dos pasos de presión antes de retroceder. Tiene que parecer real." }),
  scheme("df-20", "Presión Total", "Presión", "Avanzado", "empty",
    [["CB", 5, 56, { m: "X" }], ["CB", 70, 56, { m: "Y" }], ["CB", 95, 56, { m: "Z" }], ["LB", 36, 34, "rush"], R],
    { concept: "Dos rushers y tres defensores en hombre sin ayuda. Todo o nada.", strengths: ["Máxima presión.", "Ideal para una jugada decisiva."], weaknesses: ["Cualquier error es touchdown.", "El centro queda totalmente libre."], when: "Cuarta oportunidad o jugada decisiva.", tip: "Úsala poco. Su fuerza es la sorpresa." }),

  /* ======================= MIXTAS ======================= */
  scheme("df-21", "Combo Zona-Hombre", "Mixtas", "Avanzado", "twins",
    [["CB", 8, 56, { m: "X" }], ["CB", 74, 48, { z: [78, 44, 12, 7] }], ["S", 84, 32, { z: [82, 22, 15, 12] }], ["LB", 50, 46, { z: [46, 42, 14, 8] }], R],
    { concept: "Hombre a hombre en el lado de un receptor y zona en el lado de dos receptores.", strengths: ["Ajusta la defensa a cada lado.", "Evita cruces en el lado fuerte."], weaknesses: ["Requiere que todos sepan qué juega cada lado.", "Vulnerable a motion."], when: "Contra formaciones 2x1 como twins.", tip: "Una sola palabra define el lado de zona. Ejemplo: 'Norte' = zona a la derecha." }),
  scheme("df-22", "Ladrón", "Mixtas", "Intermedio", "spread",
    [["CB", 8, 50, { m: "X" }], ["CB", 92, 50, { m: "Z" }], ["LB", 60, 52, { m: "Y" }], ["S", 50, 28, { d: [50, 42] }], R],
    { concept: "Marca de hombre con un safety que baja al centro para robar pases a rutas in, slant y cruces.", strengths: ["Genera intercepciones en el medio.", "Castiga al QB que lanza a lo seguro."], weaknesses: ["El fondo queda vacío.", "Si el QB lo ve, lanza por encima."], when: "Contra equipos que usan mucho slant e in.", tip: "El ladrón lee los ojos del QB. Si el QB lo mira, sube; si no, baja." }),
  scheme("df-23", "Trampa del Flat", "Mixtas", "Avanzado", "trips-right",
    [["CB", 12, 50, { m: "X" }], ["CB", 90, 42, { d: [88, 30] }], ["LB", 72, 52, { d: [86, 52] }], ["S", 56, 30, { z: [56, 18, 22, 11] }], R],
    { concept: "La esquina retrocede como si cubriera profundo y el apoyador corre al flat para atrapar el pase corto.", strengths: ["Provoca intercepciones en el flat.", "Confunde las lecturas del QB."], weaknesses: ["Vulnerable a rutas medias detrás del apoyador.", "Requiere un apoyador rápido."], when: "Contra equipos que siempre lanzan al flat.", tip: "La esquina tiene que vender la caída. Si se queda viendo el flat, no funciona." }),
  scheme("df-24", "Disfraz 2 a 3", "Mixtas", "Avanzado", "spread",
    [["CB", 12, 48, { z: [15, 18, 15, 12] }], ["CB", 88, 48, { z: [85, 18, 15, 12] }], ["S", 30, 30, { d: [48, 20] }], ["S", 70, 30, { z: [60, 44, 18, 7] }], R],
    { concept: "La defensa se alinea como Zona 2 y al snap rota a Zona 3: un safety sube al centro profundo y el otro baja.", strengths: ["El QB lee una defensa y enfrenta otra.", "Provoca pases a zonas cubiertas."], weaknesses: ["Si la rotación es lenta, quedan huecos.", "Requiere práctica constante."], when: "Contra QBs experimentados que leen antes del snap.", tip: "La rotación inicia con el snap, nunca antes. Paciencia." }),

  /* ======================= SITUACIONALES ======================= */
  scheme("df-25", "Zona Roja Cerrada", "Situacionales", "Intermedio", "twins",
    [["CB", 10, 54, { z: [12, 44, 11, 10] }], ["LB", 40, 52, { z: [38, 44, 12, 10] }], ["LB", 64, 52, { z: [64, 44, 12, 10] }], ["CB", 88, 54, { z: [88, 44, 11, 10] }], R],
    { concept: "Cuatro zonas cortas pegadas a la zona de anotación. El campo es corto, no hace falta cubrir profundo.", strengths: ["Cierra huecos en espacio reducido.", "Todos los pases son disputados."], weaknesses: ["Vulnerable a rutas al fondo de la zona si el campo es más largo.", "Exige disciplina de zona."], when: "Dentro de las 10 yardas.", tip: "Marca la línea final de la zona de anotación como techo. Nadie la pasa." }),
  scheme("df-26", "Conversión de 1 Punto", "Situacionales", "Intermedio", "trips-right",
    [["CB", 12, 56, { m: "X" }], ["CB", 90, 56, { m: "Z" }], ["LB", 76, 56, { m: "Y" }], ["S", 50, 48, { m: "C" }], R],
    { concept: "Hombre a hombre pegado en espacio mínimo. Cada defensor niega el primer paso de su receptor.", strengths: ["No hay espacio para pases.", "Presión en todo el campo."], weaknesses: ["Sin ayuda.", "Vulnerable a rutas cruzadas."], when: "Conversión de 1 punto (5 yardas).", tip: "Pies rápidos y manos quietas. Una interferencia regala el punto." }),
  scheme("df-27", "Ave María Defensiva", "Situacionales", "Principiante", "empty",
    [["CB", 10, 30, { z: [15, 10, 16, 7] }], ["S", 36, 22, { z: [38, 10, 14, 7] }], ["S", 64, 22, { z: [62, 10, 14, 7] }], ["CB", 90, 30, { z: [85, 10, 16, 7] }], ["LB", 50, 44, { z: [50, 40, 30, 8] }]],
    { concept: "Todos en el fondo, dentro de la zona de anotación. Se permite cualquier pase corto.", strengths: ["Evita el touchdown en la última jugada.", "Muchos defensores para disputar el balón."], weaknesses: ["Pases cortos totalmente libres.", "Solo sirve cuando el reloj está por terminar."], when: "Última jugada de la mitad o del partido.", tip: "Instrucción clave: nadie deja que un receptor pase detrás de él." }),
  scheme("df-28", "Dos Minutos", "Situacionales", "Intermedio", "empty",
    [["CB", 8, 44, { z: [10, 36, 10, 12] }], ["CB", 92, 44, { z: [90, 36, 10, 12] }], ["LB", 50, 48, { z: [50, 42, 22, 8] }], ["S", 50, 22, { z: [50, 16, 30, 10] }], R],
    { concept: "Zona suave que cuida las bandas y el fondo. Se permite el pase corto al centro para que corra el reloj.", strengths: ["Evita jugadas largas.", "Hace que el ataque gaste tiempo."], weaknesses: ["El ataque avanza poco a poco.", "Exige flag pulling inmediato en el centro."], when: "Cuando vas ganando al final de la mitad.", tip: "Retira la flag dentro del campo. Si sale por la banda, en algunas ligas se detiene el reloj." }),
  scheme("df-29", "Cuarta y Corta", "Situacionales", "Intermedio", "twins",
    [["CB", 8, 58, { m: "X" }], ["CB", 76, 58, { m: "Y" }], ["CB", 88, 58, { m: "Z" }], ["LB", 50, 52, { m: "C" }], R],
    { concept: "Todos pegados a la línea, negando pases cortos. Si el ataque quiere lanzar largo, que lo intente bajo presión.", strengths: ["Niega la ruta corta que necesita el ataque.", "Obliga a lanzar más lejos."], weaknesses: ["Sin ayuda profunda.", "Si el QB acierta el pase largo, es touchdown."], when: "Cuarta oportunidad con 1-3 yardas por avanzar.", tip: "La marca es la meta. El defensor se coloca justo en la marca de primero y diez." }),
  scheme("df-30", "Contra Bunch", "Situacionales", "Avanzado", "bunch",
    [["CB", 10, 50, { z: [12, 30, 12, 18] }], ["CB", 86, 54, { d: [90, 46] }], ["LB", 72, 54, { d: [66, 46] }], ["S", 79, 40, { z: [78, 26, 16, 12] }], R],
    { concept: "Tres defensores contra el bunch: uno toma el primer receptor que sale afuera, otro el que sale adentro y el safety el que va profundo.", strengths: ["Evita cruces y confusiones.", "Cada defensor sabe su regla."], weaknesses: ["Si dos receptores salen al mismo lado, hay que comunicarse rápido.", "El lado débil queda con un defensor."], when: "Contra bunch o trips cerrado.", tip: "Reglas simples: 'primero afuera', 'primero adentro', 'el profundo'. Practícalas contra tu propio bunch." }),
];

export const DEFENSE_MAP: Record<string, DefenseScheme> = Object.fromEntries(DEFENSE_SCHEMES.map((d) => [d.id, d]));

/* ---------------- Conceptos defensivos ---------------- */

export const DEFENSE_CONCEPTS: { title: string; body: string[] }[] = [
  {
    title: "Zona vs. hombre",
    body: [
      "En zona, cada defensor cuida un espacio del campo y reacciona al balón. Es más fácil de aprender y protege contra jugadas largas.",
      "En hombre a hombre, cada defensor sigue a un receptor. Es más agresiva, pero cualquier error deja a alguien libre.",
      "La mayoría de los equipos juveniles empiezan con zona y agregan hombre a hombre cuando sus defensores dominan el backpedal y el flag pulling.",
    ],
  },
  {
    title: "El rusher",
    body: [
      "El rusher sale desde la línea marcada por tu reglamento (comúnmente 7 yardas). Su objetivo es apurar al QB, no necesariamente retirarle la flag.",
      "Un rusher con los brazos arriba reduce la visión del QB y provoca pases elevados.",
      "Si no mandas rusher, el QB tiene más tiempo, pero tienes un defensor más en cobertura. Revisa si tu liga usa reloj de pase.",
    ],
  },
  {
    title: "Comunicación defensiva",
    body: [
      "Una defensa que habla ve más. Define palabras cortas para: formación del rival, motion, tipo de cobertura y el lado de la rotación.",
      "El safety suele ser el que comunica porque ve todo el campo de frente.",
      "Tres señales bastan para empezar: zona, hombre y presión.",
    ],
  },
  {
    title: "Flag pulling después de la recepción",
    body: [
      "La mejor cobertura no sirve si el receptor gana 15 yardas después de atrapar.",
      "Rodea al portador con ángulos, usa la banda como defensor extra y retira la flag con una mano mientras la otra mantiene el equilibrio.",
      "Cuenta en práctica las yardas después de la recepción. Es un número que la defensa puede controlar.",
    ],
  },
  {
    title: "Cómo elegir la defensa del día",
    body: [
      "Observa las primeras dos series del rival: ¿lanza corto o largo? ¿Usa al centro? ¿Tiene un receptor estrella?",
      "Si lanza corto: Tres Abajo Uno Arriba o Hombre Suelto. Si lanza largo: Zona 2, Zona 3 o Cuartos.",
      "Si depende de un receptor: Doble al Mejor. Si usa mucho al centro: Espía o Ladrón.",
      "No cambies de defensa en cada jugada. Elige 3 o 4 y domínalas.",
    ],
  },
];

export const DEFENSE_SITUATIONS: { situation: string; call: string; why: string }[] = [
  { situation: "Primera y 10", call: "Zona 3 o Hombre con Safety", why: "Defensa equilibrada mientras lees al rival." },
  { situation: "Tercera y larga", call: "Cuartos o Blitz del Apoyador", why: "Cubre el fondo o fuerza un pase apresurado." },
  { situation: "Cuarta y corta", call: "Cuarta y Corta", why: "Niega la ruta corta que necesitan." },
  { situation: "Zona roja (10 yardas o menos)", call: "Zona Roja Cerrada", why: "Espacio reducido: cierra huecos." },
  { situation: "Conversión de 1 punto", call: "Conversión de 1 Punto", why: "Marca pegada, sin espacio." },
  { situation: "Conversión de 2 puntos", call: "Hombre con Safety o Zona Roja Cerrada", why: "Más espacio: necesitas ayuda." },
  { situation: "Última jugada", call: "Ave María Defensiva", why: "Nadie detrás de ti." },
  { situation: "Vas ganando con 2 minutos", call: "Dos Minutos", why: "Que el reloj corra." },
  { situation: "Rival con trips", call: "Rotación Fuerte o Zona Espejo", why: "Iguala números en el lado fuerte." },
  { situation: "Rival con stack o bunch", call: "Cambio en Stack o Contra Bunch", why: "Evita cruces y confusiones." },
];
