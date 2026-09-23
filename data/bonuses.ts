/* ============================================================
 *  BONUS — FLAGLAB 5x5
 *  1. 50 entrenamientos listos   → data/readySessions.ts
 *  2. Checklist del Día de Partido
 *  3. Plan de 30 días para un equipo nuevo
 *  4. Kit de Torneo               → herramienta interactiva
 *  5. Guía rápida para QB
 *  6. Guía rápida para receptores
 * ============================================================ */

export const BONUSES = [
  { id: "entrenamientos-listos", number: 1, title: "50 entrenamientos listos", desc: "Sesiones completas organizadas por nivel, con tiempos y ejercicios.", href: "/app/bonus/entrenamientos-listos" },
  { id: "checklist", number: 2, title: "Checklist del Día de Partido", desc: "Todo lo que necesitas antes, durante y después del partido.", href: "/app/bonus/checklist" },
  { id: "plan-30", number: 3, title: "Plan de 30 días para un equipo nuevo", desc: "Qué hacer cada día del primer mes, paso a paso.", href: "/app/bonus/plan-30-dias" },
  { id: "torneo", number: 4, title: "Kit de Torneo", desc: "Tabla de partidos, resultados, clasificación, stats y plan del día.", href: "/app/bonus/kit-torneo" },
  { id: "guia-qb", number: 5, title: "Guía rápida para QB", desc: "Mecánica, lecturas y hábitos del mariscal de campo.", href: "/app/bonus/guia-qb" },
  { id: "guia-receptores", number: 6, title: "Guía rápida para receptores", desc: "Postura, rutas, manos y trabajo después de la recepción.", href: "/app/bonus/guia-receptores" },
];

/* ---------------- Bonus 2: Checklist ---------------- */

export const MATCH_CHECKLIST: { group: string; items: string[] }[] = [
  { group: "Equipo", items: ["Confirmé asistencia de todos los jugadores", "Tengo al menos 2 suplentes", "Definí capitanes del partido", "Revisé horario y dirección de la cancha"] },
  { group: "Balones", items: ["2-3 balones inflados a la presión correcta", "Bomba de aire y aguja", "Balón del tamaño correcto para la categoría"] },
  { group: "Flags", items: ["Un cinturón por jugador", "2 cinturones de repuesto", "Flags del color correcto (distinto al rival)", "Revisé que ninguna flag esté amarrada o rota"] },
  { group: "Roster", items: ["Lista de jugadores con números", "Credenciales o registro si la liga lo pide", "Rotación de ataque y defensa escrita"] },
  { group: "Uniformes", items: ["Playeras con número visible", "Shorts sin bolsas o con bolsas cerradas", "Tenis o tacos permitidos por la liga", "Sin joyería, relojes ni accesorios"] },
  { group: "Agua", items: ["Agua suficiente (al menos 1 litro por jugador)", "Hielera o termo", "Vasos o botellas marcadas"] },
  { group: "Primeros auxilios", items: ["Botiquín completo (curitas, gasas, antiséptico, hielo instantáneo)", "Teléfonos de emergencia de cada jugador", "Protector solar", "Ubicación del hospital o clínica más cercana"] },
  { group: "Playbook", items: ["Playbook impreso o en el celular", "Jugadas de zona roja y conversión marcadas", "2 jugadas sorpresa listas"] },
  { group: "Wristbands", items: ["Tarjetas para muñequera impresas", "Muñequeras o protectores plásticos", "Copia de la tarjeta del coach"] },
  { group: "Pre-game", items: ["Llegada 45 minutos antes", "Calentamiento de 15 minutos", "Repaso de 3-4 jugadas caminando", "Revisión de flags y uniformes", "Mensaje corto al equipo (2 objetivos)"] },
  { group: "Halftime", items: ["Hidratación", "2 ajustes concretos (uno de ataque, uno de defensa)", "Revisar faltas y reglas marcadas por el árbitro", "Reconocer algo positivo"] },
  { group: "Post-game", items: ["Saludo al rival y a los árbitros", "Estiramiento", "Mensaje positivo", "Registrar estadísticas en el tracker", "Recoger todo el material", "Anotar 3 puntos a trabajar la próxima semana"] },
];

/* ---------------- Bonus 3: Plan de 30 días ---------------- */

export type PlanDayKind = "Entrenamiento" | "Coach" | "Descanso" | "Partido";

export const PLAN_30: { day: number; kind: PlanDayKind; title: string; tasks: string[]; sessionId?: string }[] = [
  { day: 1, kind: "Coach", title: "Arranque del proyecto", tasks: ["Lee los capítulos 1 a 3 del manual.", "Consigue el reglamento de tu liga.", "Haz la lista de material que necesitas."] },
  { day: 2, kind: "Coach", title: "Equipo y comunicación", tasks: ["Registra a tus jugadores en Mi Equipo.", "Crea el grupo de mensajes con papás o jugadores.", "Envía horario del primer entrenamiento."] },
  { day: 3, kind: "Entrenamiento", title: "Primer día del equipo", tasks: ["Presentación y reglas básicas.", "Pase, recepción y flag pulling en juego."], sessionId: "lista-01" },
  { day: 4, kind: "Descanso", title: "Reto en casa", tasks: ["Los jugadores practican 20 pases con un familiar.", "Tú revisas qué jugadores mostraron facilidad para lanzar."] },
  { day: 5, kind: "Entrenamiento", title: "Aprendiendo a lanzar", tasks: ["Agarre, postura y pase a 5 yardas.", "Termina con juego 3 contra 3."], sessionId: "lista-02" },
  { day: 6, kind: "Coach", title: "Primeras observaciones", tasks: ["Anota posiciones tentativas en Mi Equipo.", "Revisa el capítulo 2 del manual (posiciones)."] },
  { day: 7, kind: "Descanso", title: "Descanso", tasks: ["Descanso total para el equipo.", "Tú lees el capítulo 12 (cómo montar un entrenamiento)."] },
  { day: 8, kind: "Entrenamiento", title: "Manos seguras", tasks: ["Diamante y canasta.", "Rutas en espejo."], sessionId: "lista-03" },
  { day: 9, kind: "Coach", title: "Primer playbook", tasks: ["Elige 4 jugadas de la categoría 'Para principiantes'.", "Crea tu playbook y agrégalas a Ofensiva."] },
  { day: 10, kind: "Entrenamiento", title: "Quitar flags como equipo", tasks: ["Espejo de flags y embudo.", "Scrimmage controlado."], sessionId: "lista-04" },
  { day: 11, kind: "Descanso", title: "Reto en casa", tasks: ["Los jugadores dibujan su ruta favorita.", "Tú imprimes el playbook inicial."] },
  { day: 12, kind: "Entrenamiento", title: "Rutas con conos", tasks: ["Árbol de rutas básico.", "Recepción al final de cada ruta."], sessionId: "lista-05" },
  { day: 13, kind: "Coach", title: "Revisión de la semana 2", tasks: ["¿Qué fundamentos van bien? ¿Cuáles no?", "Ajusta el plan: repite la sesión más débil si es necesario."] },
  { day: 14, kind: "Descanso", title: "Descanso", tasks: ["Descanso total."] },
  { day: 15, kind: "Entrenamiento", title: "El centro también juega", tasks: ["Snap, conteo y centro como receptor.", "Primera jugada del playbook caminando."], sessionId: "lista-07" },
  { day: 16, kind: "Coach", title: "Formaciones", tasks: ["Lee el capítulo 7 del manual.", "Elige 2 formaciones base para tu equipo."] },
  { day: 17, kind: "Entrenamiento", title: "Mi primera jugada", tasks: ["Instalar una jugada: caminando, trotando y a velocidad.", "Huddle en 15 segundos."], sessionId: "lista-08" },
  { day: 18, kind: "Descanso", title: "Reto en casa", tasks: ["Los jugadores memorizan el nombre y su ruta en la jugada 1."] },
  { day: 19, kind: "Entrenamiento", title: "Defensa sin contacto", tasks: ["Backpedal, flag pulling e intercepción.", "Juego 3 contra 3."], sessionId: "lista-10" },
  { day: 20, kind: "Coach", title: "Muñequeras", tasks: ["Numera tus jugadas en el playbook.", "Genera e imprime las tarjetas para muñequera."] },
  { day: 21, kind: "Descanso", title: "Descanso", tasks: ["Descanso total."] },
  { day: 22, kind: "Entrenamiento", title: "Juego de oportunidades", tasks: ["Reglas de oportunidades en juego.", "Usar las jugadas del playbook."], sessionId: "lista-12" },
  { day: 23, kind: "Coach", title: "Zona roja", tasks: ["Elige 2 jugadas de Red Zone y 1 de Conversión.", "Agrégalas a tu playbook."] },
  { day: 24, kind: "Entrenamiento", title: "Zona roja para principiantes", tasks: ["Rutas cortas y atrapar dentro de la zona.", "Conversiones."], sessionId: "lista-14" },
  { day: 25, kind: "Descanso", title: "Reto en casa", tasks: ["Los jugadores repasan su tarjeta de muñequera."] },
  { day: 26, kind: "Entrenamiento", title: "Evaluación de fundamentos", tasks: ["Circuito de evaluación.", "Registra resultados en el tracker."], sessionId: "lista-20" },
  { day: 27, kind: "Coach", title: "Plan de partido", tasks: ["Define rotaciones.", "Revisa el Checklist del Día de Partido.", "Confirma horario y cancha."] },
  { day: 28, kind: "Entrenamiento", title: "Preparación para partido", tasks: ["Repaso de jugadas, zona roja y simulación.", "Nada nuevo: solo confianza."], sessionId: "lista-36" },
  { day: 29, kind: "Descanso", title: "Descanso previo", tasks: ["Descanso, hidratación y buena comida.", "Mensaje al equipo con horario y material."] },
  { day: 30, kind: "Partido", title: "¡Primer partido!", tasks: ["Sigue el Checklist del Día de Partido.", "Usa el tracker durante el juego.", "Celebra el esfuerzo antes que el resultado."] },
];

/* ---------------- Bonus 5 y 6: Guías rápidas ---------------- */

export interface GuideSection {
  title: string;
  items: string[];
}

export const QB_GUIDE: { title: string; intro: string; sections: GuideSection[]; drills: string[] } = {
  title: "Guía rápida para QB",
  intro: "El QB toca el balón en cada jugada de ataque. No necesita ser el más rápido ni el más fuerte: necesita ser el más tranquilo y el que mejor decide.",
  sections: [
    { title: "Antes del snap", items: ["Confirma la formación de tu equipo.", "Cuenta los defensores profundos: ¿uno, dos o ninguno?", "Busca defensores pegados a los receptores (señal de hombre a hombre).", "Identifica al defensor clave de la jugada.", "Mira dónde está el rusher."] },
    { title: "Mecánica", items: ["Agarre con los dedos en las costuras y espacio en la palma.", "Balón a la altura de la oreja, codo arriba del hombro.", "Paso con el pie contrario hacia el objetivo.", "La cadera gira primero; el brazo la sigue.", "Terminación con el pulgar hacia abajo."] },
    { title: "Lecturas", items: ["Mira al defensor, no al receptor.", "Principal (verde) → secundaria (amarilla) → centro → fuera del campo.", "Si dudas, no lances. Un pase incompleto es mejor que una intercepción.", "Contra zona: busca huecos. Contra hombre: busca la ruta que cambia de dirección."] },
    { title: "Contra el rusher", items: ["Siente al rusher, no lo mires.", "Si llega rápido, usa rutas de 1 y 3 pasos.", "Un paso lateral puede darte un segundo extra.", "El screen y el centro son tus salidas seguras."] },
    { title: "Liderazgo", items: ["En el huddle hablas claro y corto.", "Después de un error, eres el primero en animar.", "Conoce la ruta de todos, no solo la tuya.", "Pregunta al coach, pero decide en el campo."] },
  ],
  drills: ["qb-01", "qb-02", "qb-03", "qb-04", "qb-05", "pa-02", "pa-05"],
};

export const WR_GUIDE: { title: string; intro: string; sections: GuideSection[]; drills: string[] } = {
  title: "Guía rápida para receptores",
  intro: "En 5x5 todos reciben. El buen receptor corre la ruta exacta, llega a tiempo y atrapa lo que le lanzan. Lo demás es extra.",
  sections: [
    { title: "Postura y salida", items: ["Pie de adentro adelante.", "Rodillas flexionadas, peso en la punta de los pies.", "Primeros 3 pasos explosivos y cortos.", "Mira el balón para salir con el snap."] },
    { title: "Rutas", items: ["Vende la vertical en los primeros pasos.", "Pasos cortos antes del corte.", "Corte definido: nada de curvas.", "Llega siempre al mismo punto: el QB lanza al lugar, no a ti.", "Contra zona, busca el hueco y detente. Contra hombre, sigue corriendo."] },
    { title: "Manos", items: ["Diamante arriba del pecho, canasta abajo.", "Manos lejos del cuerpo.", "Mira el balón hasta que entre en tus manos.", "Manos suaves: absorbe el balón."] },
    { title: "Después de atrapar", items: ["Primero atrapa, después corre.", "Balón bajo el brazo del lado de la banda.", "Corre hacia adelante; evita correr hacia atrás.", "Nunca protejas tus flags con la mano."] },
    { title: "Sin balón", items: ["Si no eres la lectura, tu ruta abre espacio para otro.", "Corre tu ruta completa aunque el balón vaya a otro lado.", "Si el QB sale del pocket, muévete hacia su lado.", "Cuando el balón está en el aire, todos van hacia él."] },
  ],
  drills: ["re-01", "re-02", "re-04", "re-05", "ru-01", "ru-02", "ru-03", "ru-04"],
};
