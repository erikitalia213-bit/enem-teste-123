/* ============================================================
 *  SESIONES PREDISEÑADAS
 *  - READY_SESSIONS: Bonus "50 entrenamientos listos" (por nivel)
 *  - EXTRA_SESSIONS: Order bump "Pack 50 Entrenamientos Extra"
 *  Formato de bloques: "drillId:minutos drillId:minutos ..."
 *  La suma de minutos debe coincidir con la duración.
 * ============================================================ */

import type { Level, ReadySession } from "@/lib/types";

type Row = [title: string, level: Level, age: string, duration: number, focus: string, blocks: string, note: string, group?: string];

const P: Level = "Principiante";
const I: Level = "Intermedio";
const A: Level = "Avanzado";

function build(prefix: string, rows: Row[]): ReadySession[] {
  return rows.map(([title, level, age, duration, focus, blocks, coachNote, group], i) => ({
    id: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    number: i + 1,
    title,
    level,
    age,
    duration,
    focus,
    group: group ?? level,
    coachNote,
    blocks: blocks.split(/\s+/).map((b) => {
      const [drillId, m] = b.split(":");
      return { drillId, minutes: Number(m) };
    }),
  }));
}

export const READY_SESSIONS: ReadySession[] = build("lista", [
  /* ---------- PRINCIPIANTE ---------- */
  ["Primer día del equipo", P, "6-11 años", 45, "Presentación y fundamentos", "wu-05:8 re-01:10 pa-01:10 fp-04:10 vc-02:7", "Aprende nombres, explica las 3 reglas básicas (sin contacto, flags visibles, respeto) y termina con un juego."],
  ["Aprendiendo a lanzar", P, "6-11 años", 45, "Pase", "wu-02:6 pa-01:12 pa-04:10 ju-03:12 vc-04:5", "Revisa el agarre de cada jugador. No aumentes distancia hasta que el pase corto sea bueno."],
  ["Manos seguras", P, "6-11 años", 45, "Recepción", "wu-03:6 re-01:10 re-03:8 ru-05:8 ju-03:8 vc-01:5", "Diamante arriba, canasta abajo. Repítelo hasta que lo digan solos."],
  ["Quitar flags como equipo", P, "6-11 años", 45, "Flag pulling", "wu-05:7 fp-01:10 fp-04:10 de-01:8 ju-01:10", "Primero la cadera, luego la mano. Premia la técnica, no solo la flag."],
  ["Rutas con conos", P, "9-14 años", 60, "Rutas", "wu-01:8 ru-01:15 ru-05:10 re-01:10 ju-01:12 vc-02:5", "Coloca los conos antes de que lleguen los jugadores. Ahorras 10 minutos."],
  ["Velocidad divertida", P, "6-11 años", 45, "Velocidad", "wu-03:6 ve-01:8 ve-02:10 ag-05:8 ju-03:10 vc-03:3", "La competencia sube la intensidad sin gritar. Mezcla los equipos en cada relevo."],
  ["El centro también juega", P, "9-14 años", 45, "Snap y centro", "wu-02:6 qb-02:8 ru-01:10 at-01:10 ju-03:8 vc-02:3", "Rota a todos por la posición de centro. Todos deben saber dar el snap."],
  ["Mi primera jugada", P, "9-14 años", 60, "Ataque", "wu-01:8 co-01:6 at-01:15 re-03:6 ju-01:20 vc-02:5", "Instala solo una jugada. Caminando, trotando y a velocidad."],
  ["Agilidad y pies rápidos", P, "6-11 años", 45, "Agilidad", "wu-04:6 ag-01:10 ag-05:8 fp-04:8 ju-03:10 vc-01:3", "Primero bien, luego rápido. La escalera mal hecha no sirve."],
  ["Defensa sin contacto", P, "6-11 años", 45, "Defensa", "wu-05:7 de-01:8 fp-01:10 de-05:8 ju-03:10 vc-03:2", "Refuerza la regla de no contacto en cada ejercicio."],
  ["Pase y recepción en parejas", P, "9-14 años", 60, "Pase y recepción", "wu-02:6 pa-01:10 re-01:10 pa-04:10 re-03:6 ju-01:15 vc-01:3", "Cambia de pareja cada ejercicio para que todos convivan."],
  ["Juego de oportunidades", P, "9-14 años", 60, "Reglas y juego", "wu-01:8 at-05:12 co-01:6 fp-01:10 ju-01:20 vc-02:4", "Que un jugador cante la oportunidad antes de cada jugada."],
  ["Capitanes", P, "9-14 años", 45, "Comunicación", "co-05:5 wu-01:8 co-03:6 at-01:10 ju-03:12 vc-02:4", "Elige como capitán a alguien que casi no habla. Te va a sorprender."],
  ["Zona roja para principiantes", P, "9-14 años", 60, "Red Zone", "wu-01:8 rz-05:12 ru-01:10 at-01:10 ju-01:15 vc-02:5", "Marca bien la zona de anotación con conos de otro color."],
  ["Semana de repaso", P, "9-14 años", 60, "Repaso general", "wu-03:6 pa-04:8 re-01:8 ru-01:10 fp-01:8 ju-01:16 vc-01:4", "Ideal cada 4 semanas para consolidar fundamentos."],
  ["Relevos y balón", P, "6-11 años", 30, "Sesión corta", "wu-02:5 ve-02:8 re-03:6 ju-03:9 vc-04:2", "Sesión exprés para días con poco tiempo o campo compartido."],
  ["Sesión exprés de pase", P, "6-14 años", 30, "Sesión corta de pase", "wu-02:5 pa-01:10 pa-04:8 re-03:5 vc-04:2", "Aprovecha para revisar agarre uno por uno."],
  ["Sesión exprés de defensa", P, "6-14 años", 30, "Sesión corta de defensa", "wu-05:6 fp-01:8 de-05:6 ju-03:8 vc-03:2", "Termina con el juego: es lo que más recuerdan."],
  ["Día de juego libre guiado", P, "6-14 años", 60, "Juego", "wu-05:7 at-01:10 fp-04:8 ju-03:15 ju-01:15 vc-02:5", "Deja jugar y corrige solo una cosa por jugador."],
  ["Evaluación de fundamentos", P, "9-14 años", 60, "Evaluación", "wu-01:8 pa-04:10 re-01:10 fp-01:10 ru-01:10 ju-01:8 vc-02:4", "Anota en tu tracker lo que observes. Compara en 4 semanas."],
  /* ---------- INTERMEDIO ---------- */
  ["Precisión del QB", I, "12-17 años", 60, "Pase", "wu-04:6 pa-02:12 qb-01:10 ru-04:12 ju-02:15 vc-01:5", "Lleva registro de aciertos de cada QB en la ventana."],
  ["Recepción en carrera", I, "12-17 años", 60, "Recepción", "wu-01:8 re-02:12 re-04:10 ru-02:10 ju-02:15 vc-01:5", "Manos abajo al correr y arriba solo al final."],
  ["Cortes limpios", I, "12-17 años", 60, "Rutas", "wu-04:6 ag-03:6 ru-02:12 ru-04:12 at-04:12 ju-01:12", "Pasos cortos antes del corte. Graba con el celular para que se vean."],
  ["Defensa en zona", I, "12-17 años", 60, "Defensa", "wu-01:8 de-01:6 de-02:14 co-02:8 ju-02:20 vc-02:4", "Los ojos al QB. En zona, él dice a dónde va el balón."],
  ["Hombre a hombre", I, "12-17 años", 60, "Defensa", "wu-04:6 de-01:6 de-03:14 fp-03:10 ju-02:20 vc-02:4", "Mira la cadera del receptor, no sus hombros."],
  ["Presión al QB", I, "12-17 años", 60, "Rusher y QB", "wu-01:8 de-04:12 qb-04:12 at-02:12 ju-01:12 vc-01:4", "Rota a varios jugadores como rusher para encontrar al mejor."],
  ["Ángulos de persecución", I, "12-17 años", 60, "Flag pulling", "wu-05:7 fp-02:10 fp-03:12 ag-02:8 ju-02:18 vc-03:5", "Corre al punto donde estará el atacante, no a donde está."],
  ["Instalación de jugadas", I, "12-17 años", 75, "Ataque", "wu-01:8 co-01:6 at-01:12 at-04:15 at-02:14 ju-02:15 vc-02:5", "Instala 3 jugadas nuevas como máximo por sesión."],
  ["Zona roja intermedia", I, "12-17 años", 60, "Red Zone", "wu-04:6 rz-01:12 rz-02:10 rz-04:12 ju-02:15 vc-02:5", "Cuenta solo si los pies del receptor están dentro."],
  ["Velocidad y cambio de ritmo", I, "12-17 años", 60, "Velocidad", "wu-01:8 ve-03:10 ve-04:8 ag-03:8 ru-02:10 ju-01:12 vc-03:4", "El cambio de ritmo engaña igual que un corte."],
  ["Comunicación total", I, "12-17 años", 60, "Comunicación", "wu-01:8 co-01:6 co-02:8 co-04:12 ju-02:22 vc-02:4", "Premia la comunicación aunque la jugada salga mal."],
  ["QB y receptores", I, "12-17 años", 75, "Timing", "wu-04:6 qb-01:10 pa-03:12 ru-04:12 re-02:10 at-04:20 vc-01:5", "Divide el campo: QBs y receptores de un lado, defensa del otro."],
  ["Tercera oportunidad", I, "12-17 años", 60, "Situaciones", "wu-01:8 at-02:15 rz-04:10 co-04:8 ju-02:15 vc-02:4", "Pon situaciones reales: 3a y 8, 4a y 2."],
  ["Defensa completa", I, "12-17 años", 75, "Defensa", "wu-05:7 de-01:6 de-03:12 de-02:12 de-04:10 ju-02:23 vc-02:5", "Trabaja zona y hombre en el mismo día para comparar."],
  ["Ataque contra zona", I, "12-17 años", 60, "Ataque", "wu-04:6 ru-04:10 pa-02:10 at-04:14 ju-02:16 vc-02:4", "Pide a la defensa jugar solo zona. El ataque encuentra huecos."],
  ["Semana antes del partido", I, "12-17 años", 60, "Preparación", "wu-01:8 at-01:8 rz-04:10 co-01:6 ju-02:24 vc-02:4", "Nada nuevo antes del partido. Solo repasa."],
  ["Circuito técnico", I, "12-17 años", 75, "Técnica general", "wu-01:8 pa-03:10 re-04:10 ru-02:10 fp-03:10 ag-02:8 ju-01:15 vc-01:4", "Estaciones de 10 minutos con un asistente o capitán en cada una."],
  ["Recuperación activa", I, "9-17 años", 45, "Recuperación", "wu-04:6 re-03:6 pa-04:8 co-03:6 ju-03:15 vc-01:4", "Úsala después de un torneo o un partido intenso."],
  /* ---------- AVANZADO ---------- */
  ["Lecturas del QB", A, "15+ años", 75, "QB", "wu-04:6 qb-01:8 pa-05:15 qb-03:12 ru-03:14 ju-02:15 vc-01:5", "El QB lee al defensor, no al receptor."],
  ["Rutas según defensa", A, "15+ años", 75, "Rutas", "wu-01:8 ag-04:7 ru-03:15 re-05:10 at-04:15 ju-02:15 vc-01:5", "Receptor y QB deben leer lo mismo. Pregúntales qué vieron."],
  ["Ataque sin huddle", A, "15+ años", 75, "Ataque", "wu-01:8 co-01:5 at-03:15 at-02:15 ju-04:27 vc-02:5", "Usa las muñequeras. Snap en menos de 10 segundos."],
  ["Defensa élite", A, "15+ años", 90, "Defensa", "wu-04:6 ag-04:8 de-03:14 fp-05:12 de-02:12 co-04:10 ju-04:23 vc-01:5", "Sesión exigente: controla hidratación y descansos."],
  ["Rollout y movilidad del QB", A, "15+ años", 75, "QB", "wu-04:6 qb-05:14 pa-03:12 qb-04:10 at-04:14 ju-02:15 vc-01:4", "En rollout: lanza o sal del campo. Nunca al tráfico."],
  ["Conversiones decisivas", A, "15+ años", 75, "Red Zone", "wu-01:8 rz-02:10 rz-03:15 rz-01:12 ju-04:25 vc-02:5", "Mide el porcentaje de éxito de cada jugada de conversión."],
  ["Velocidad de partido", A, "15+ años", 90, "Intensidad", "wu-01:8 ve-05:12 ag-04:8 re-05:10 at-03:15 ju-04:32 vc-01:5", "Todo a velocidad real. Si baja la calidad, baja el volumen."],
  ["Uno contra uno", A, "15+ años", 75, "Competencia", "wu-04:6 fp-05:12 rz-01:12 re-05:10 de-03:12 ju-02:18 vc-01:5", "Lleva un marcador de uno contra uno por jugador."],
  ["Simulación completa", A, "15+ años", 90, "Partido", "wu-01:8 co-01:5 at-01:10 rz-03:12 ju-04:45 vc-02:10", "Usa el tracker durante la simulación para tener datos reales."],
  ["Plan contra rival rápido", A, "15+ años", 75, "Preparación", "wu-04:6 qb-04:12 de-04:10 at-03:12 fp-05:10 ju-02:20 vc-02:5", "Rutas rápidas y ángulos de persecución largos."],
  ["Semana de playoffs", A, "15+ años", 90, "Preparación", "wu-01:8 at-03:12 pa-05:12 rz-03:12 co-04:8 ju-04:33 vc-02:5", "Confía en lo que ya funciona. No agregues jugadas nuevas."],
  ["Día previo al torneo", A, "15+ años", 60, "Activación", "wu-01:8 at-01:10 rz-03:10 co-01:5 ju-04:22 vc-02:5", "Intensidad media. Termina temprano y con buena energía."],
]);

export const EXTRA_SESSIONS: ReadySession[] = build("extra", [
  /* ---------- INFANTILES 6-8 ---------- */
  ["Exploradores del balón", P, "6-8 años", 45, "Primer contacto", "wu-03:6 re-03:8 pa-01:10 ag-05:8 ju-03:10 vc-04:3", "Instrucciones de una sola frase. Cambia antes de que se aburran.", "Infantiles 6-8"],
  ["Cazadores de flags", P, "6-8 años", 45, "Flag pulling", "wu-05:7 fp-04:10 fp-01:8 ve-02:8 ju-03:10 vc-04:2", "Celebra cada flag retirada con técnica correcta.", "Infantiles 6-8"],
  ["Carreras y rutas", P, "6-8 años", 45, "Rutas", "wu-03:6 ru-05:10 ve-01:6 re-01:8 ju-03:12 vc-03:3", "Nombra las rutas con palabras fáciles: 'diagonal', 'a la orilla', 'regreso'.", "Infantiles 6-8"],
  ["Pases de puntería", P, "6-8 años", 45, "Pase", "wu-02:6 pa-04:10 re-03:6 co-03:6 ju-03:12 vc-04:5", "Usa balones pequeños o suaves si los de tocho les quedan grandes.", "Infantiles 6-8"],
  ["Mi primer huddle", P, "6-8 años", 45, "Comunicación", "wu-03:6 co-01:6 at-05:12 fp-04:8 ju-03:10 vc-02:3", "El huddle con niños es un abrazo de equipo. Hazlo divertido.", "Infantiles 6-8"],
  ["Semáforo y relevos", P, "6-8 años", 45, "Velocidad", "wu-03:8 ve-02:10 ag-01:8 fp-04:8 ju-03:8 vc-04:3", "Equipos mezclados en cada relevo para que nadie pierda siempre.", "Infantiles 6-8"],
  ["Pequeños QBs", P, "6-8 años", 45, "Pase", "wu-02:6 pa-01:10 qb-02:8 pa-04:8 ju-03:10 vc-04:3", "Todos pasan por QB. Descubrirás talentos inesperados.", "Infantiles 6-8"],
  ["Defensores valientes", P, "6-8 años", 45, "Defensa", "wu-05:7 de-01:6 de-05:8 fp-01:10 ju-03:10 vc-03:4", "Enseña a celebrar las intercepciones con todo el equipo.", "Infantiles 6-8"],
  ["Circuito divertido", P, "6-8 años", 45, "Agilidad", "wu-03:6 ag-05:8 ag-01:8 re-01:8 ju-03:12 vc-04:3", "Usa música en el circuito si es posible.", "Infantiles 6-8"],
  ["Fiesta de tocho", P, "6-8 años", 45, "Juego", "co-05:4 wu-05:6 at-05:10 ju-03:20 vc-04:5", "Ideal para la última sesión del mes o para invitar a papás.", "Infantiles 6-8"],
  /* ---------- QB ---------- */
  ["Mecánica de QB", I, "12-17 años", 60, "QB", "wu-04:6 pa-01:8 qb-01:12 pa-02:12 qb-02:6 ju-01:12 vc-01:4", "Graba en cámara lenta el lanzamiento de cada QB.", "Posición: QB"],
  ["QB en movimiento", A, "15+ años", 60, "QB", "wu-04:6 pa-03:12 qb-05:14 qb-04:10 at-04:14 vc-01:4", "Hombros al objetivo aunque los pies vayan hacia otro lado.", "Posición: QB"],
  ["Decisiones rápidas", A, "15+ años", 60, "QB", "wu-04:6 pa-05:14 qb-03:12 qb-04:10 ju-02:14 vc-02:4", "Cronometra: el balón debe salir en menos de 3 segundos.", "Posición: QB"],
  ["Precisión profunda", I, "12-17 años", 60, "QB", "wu-04:6 pa-04:10 pa-02:14 ru-04:12 ju-02:14 vc-01:4", "El pase largo se lanza alto y adelante del receptor.", "Posición: QB"],
  ["Snap y conteo", P, "9-14 años", 60, "QB y centro", "wu-02:6 qb-02:12 co-01:6 at-01:14 ju-01:18 vc-02:4", "Un mal snap arruina cualquier jugada. Dedícale tiempo.", "Posición: QB"],
  /* ---------- RECEPTORES ---------- */
  ["Manos de receptor", P, "9-14 años", 60, "Recepción", "wu-01:8 re-01:10 re-03:8 re-02:12 ju-01:18 vc-01:4", "Mirar el balón hasta que entra en las manos.", "Posición: receptores"],
  ["Cortes y separación", I, "12-17 años", 60, "Rutas", "wu-04:6 ag-03:6 ru-02:14 ru-04:12 re-04:10 ju-01:8 vc-01:4", "La separación se gana en el corte, no en la velocidad.", "Posición: receptores"],
  ["Receptores en tráfico", A, "15+ años", 60, "Recepción", "wu-01:8 re-05:12 re-04:10 ru-03:12 ju-02:14 vc-01:4", "Entrena con ruido: el partido lo tendrá.", "Posición: receptores"],
  ["Rutas profundas", I, "12-17 años", 60, "Rutas", "wu-01:8 ve-03:8 re-02:12 ru-04:12 ju-02:16 vc-01:4", "Correr con las manos abajo hasta el último momento.", "Posición: receptores"],
  ["Receptores de zona roja", I, "12-17 años", 60, "Red Zone", "wu-04:6 rz-05:10 rz-02:12 rz-01:12 ju-02:16 vc-01:4", "Pies dentro, balón asegurado, luego celebra.", "Posición: receptores"],
  /* ---------- DEFENSA ---------- */
  ["Base defensiva", P, "9-14 años", 60, "Defensa", "wu-05:7 de-01:8 fp-01:10 de-05:10 ju-01:20 vc-03:5", "Postura atlética en todo momento.", "Posición: defensa"],
  ["Cobertura de zona", I, "12-17 años", 60, "Defensa", "wu-04:6 de-02:15 co-02:8 co-04:10 ju-02:17 vc-02:4", "La zona funciona si todos hablan.", "Posición: defensa"],
  ["Cobertura de hombre", I, "12-17 años", 60, "Defensa", "wu-01:8 de-03:15 fp-03:10 de-05:8 ju-02:15 vc-02:4", "Asigna parejas por velocidad similar.", "Posición: defensa"],
  ["Rusher y presión", I, "12-17 años", 60, "Defensa", "wu-01:8 ve-01:6 de-04:14 qb-04:10 ju-02:18 vc-02:4", "Brazos arriba siempre: aunque no llegue, tapa la visión.", "Posición: defensa"],
  ["Flag pulling élite", A, "15+ años", 60, "Flag pulling", "wu-05:7 fp-05:14 fp-03:10 ag-04:8 ju-04:17 vc-01:4", "Mide cuántas flags se retiran en el primer intento.", "Posición: defensa"],
  /* ---------- PRETEMPORADA ---------- */
  ["Pretemporada 1: evaluación", I, "12+ años", 75, "Evaluación", "wu-01:8 ag-04:8 ve-05:10 pa-04:10 re-01:10 fp-01:10 ju-01:15 vc-02:4", "Registra tiempos y resultados para comparar al final.", "Pretemporada"],
  ["Pretemporada 2: fundamentos ofensivos", I, "12+ años", 75, "Ataque", "wu-01:8 pa-01:10 re-01:10 ru-01:15 at-01:12 ju-01:15 vc-01:5", "Aunque sean veteranos, repasa lo básico.", "Pretemporada"],
  ["Pretemporada 3: fundamentos defensivos", I, "12+ años", 75, "Defensa", "wu-05:7 de-01:8 de-03:12 fp-02:12 de-04:10 ju-01:21 vc-01:5", "Define quiénes serán tus rushers de la temporada.", "Pretemporada"],
  ["Pretemporada 4: formaciones", I, "12+ años", 75, "Formaciones", "wu-01:8 co-01:6 at-01:15 at-04:15 ju-02:26 vc-02:5", "Instala 3 formaciones base y no más.", "Pretemporada"],
  ["Pretemporada 5: timing", I, "12+ años", 75, "Timing", "wu-04:6 qb-01:10 ru-04:15 pa-02:12 at-04:12 ju-02:15 vc-01:5", "QB y receptores trabajan juntos todo el día.", "Pretemporada"],
  ["Pretemporada 6: situaciones", I, "12+ años", 75, "Situaciones", "wu-01:8 at-02:15 rz-04:12 rz-01:10 ju-02:25 vc-02:5", "Practica tercera y larga, cuarta y corta y zona roja.", "Pretemporada"],
  ["Pretemporada 7: defensa de equipo", I, "12+ años", 75, "Defensa", "wu-01:8 de-02:14 co-04:10 fp-03:10 ju-02:28 vc-02:5", "Define tus señales defensivas para la temporada.", "Pretemporada"],
  ["Pretemporada 8: partido interno", I, "12+ años", 75, "Partido", "wu-01:8 co-01:5 at-01:10 ju-04:45 vc-02:7", "Usa el tracker y revisa los números con el equipo.", "Pretemporada"],
  /* ---------- SEMANA DE PARTIDO ---------- */
  ["Lunes: revisión", I, "12+ años", 60, "Revisión", "wu-04:6 at-04:15 de-03:12 co-04:8 ju-01:15 vc-02:4", "Corrige los 3 errores principales del último partido.", "Semana de partido"],
  ["Martes: ataque", I, "12+ años", 60, "Ataque", "wu-01:8 at-01:10 at-02:15 rz-04:10 ju-02:13 vc-02:4", "Instala el plan de juego ofensivo.", "Semana de partido"],
  ["Miércoles: defensa", I, "12+ años", 60, "Defensa", "wu-05:7 de-02:12 de-04:10 fp-03:10 ju-02:17 vc-02:4", "Simula las jugadas favoritas del rival.", "Semana de partido"],
  ["Jueves: situaciones", I, "12+ años", 60, "Situaciones", "wu-01:8 rz-03:12 co-02:8 at-03:12 ju-04:16 vc-02:4", "Conversiones, reloj y zona roja.", "Semana de partido"],
  ["Viernes: activación ligera", I, "12+ años", 45, "Activación", "wu-01:8 pa-04:6 re-03:6 at-01:15 co-05:5 vc-02:5", "Poca intensidad, mucha confianza.", "Semana de partido"],
  /* ---------- SESIONES DE 30 MINUTOS ---------- */
  ["30 min: pase", I, "9+ años", 30, "Pase", "wu-02:5 pa-01:8 pa-02:10 ju-03:5 vc-04:2", "Llega con los conos puestos.", "Sesiones de 30 min"],
  ["30 min: recepción", I, "9+ años", 30, "Recepción", "wu-02:5 re-01:8 re-02:10 ju-03:5 vc-01:2", "Muchas repeticiones, pocas palabras.", "Sesiones de 30 min"],
  ["30 min: flags", P, "6+ años", 30, "Flag pulling", "wu-05:5 fp-01:8 fp-02:10 ju-03:5 vc-03:2", "Ideal antes de un partido de práctica.", "Sesiones de 30 min"],
  ["30 min: rutas", I, "9+ años", 30, "Rutas", "wu-01:5 ru-01:10 ru-04:10 ju-03:5", "Una ruta nueva por sesión corta.", "Sesiones de 30 min"],
  ["30 min: agilidad", P, "6+ años", 30, "Agilidad", "wu-04:5 ag-01:8 ag-02:8 ve-01:7 vc-03:2", "Perfecta para días de lluvia ligera en espacio techado.", "Sesiones de 30 min"],
  ["30 min: zona roja", I, "9+ años", 30, "Red Zone", "wu-01:5 rz-05:8 rz-04:12 vc-02:5", "Termina con un reto: anotar 3 de 5.", "Sesiones de 30 min"],
  ["30 min: juego", P, "6+ años", 30, "Juego", "wu-05:5 ju-03:20 vc-02:5", "Varios campos pequeños para que todos jueguen.", "Sesiones de 30 min"],
  /* ---------- CALOR Y ESPACIO REDUCIDO ---------- */
  ["Calor: técnica de baja intensidad", P, "Todas", 60, "Técnica", "wu-04:6 pa-01:10 re-01:10 co-03:6 qb-02:8 at-01:10 co-01:5 vc-01:5", "Pausas de hidratación cada 15 minutos y actividades a la sombra cuando sea posible.", "Calor y espacio reducido"],
  ["Calor: estaciones cortas", P, "Todas", 50, "Técnica", "wu-02:5 pa-04:8 re-03:6 fp-01:8 ag-01:8 ju-03:10 vc-03:5", "Estaciones de 8 minutos con 2 minutos de agua entre cada una.", "Calor y espacio reducido"],
  ["Medio campo", P, "Todas", 50, "Espacio reducido", "wu-03:6 re-03:6 fp-04:8 ag-05:8 ju-03:17 vc-02:5", "Cuando compartes campo con otro equipo.", "Calor y espacio reducido"],
  ["Cancha de básquetbol", P, "Todas", 45, "Espacio reducido", "wu-02:6 pa-04:8 re-01:8 co-03:6 ju-03:12 vc-04:5", "Cuidado con superficies duras: sin lanzarse al piso.", "Calor y espacio reducido"],
  ["Grupo grande (20+ jugadores)", P, "Todas", 60, "Organización", "wu-01:8 ag-02:8 re-03:6 fp-04:8 ju-03:25 vc-02:5", "Divide en estaciones y usa capitanes como asistentes.", "Calor y espacio reducido"],
]);

export const getReadySession = (id: string) => [...READY_SESSIONS, ...EXTRA_SESSIONS].find((s) => s.id === id);
