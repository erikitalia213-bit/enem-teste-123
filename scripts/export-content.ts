/* ============================================================
 *  Exporta todo el contenido del producto a Markdown en /content
 *  Uso: npm run content:export
 *  La fuente de verdad son los archivos de /data; este script
 *  genera copias legibles para revisar, editar en otro lugar o
 *  entregar como documentos.
 * ============================================================ */

import fs from "node:fs";
import path from "node:path";
import { CHAPTERS, MANUAL_SUBTITLE, MANUAL_TITLE, type Block } from "../data/manual";
import { CLASSES } from "../data/classes";
import { DRILLS, DRILL_CATEGORIES, DRILL_MAP } from "../data/drills";
import { PLAYS, PLAY_CATEGORIES } from "../data/plays";
import { BONUSES, MATCH_CHECKLIST, PLAN_30, QB_GUIDE, WR_GUIDE, type GuideSection } from "../data/bonuses";
import { READY_SESSIONS, EXTRA_SESSIONS } from "../data/readySessions";
import { DEFENSE_CONCEPTS, DEFENSE_SCHEMES, DEFENSE_SITUATIONS } from "../data/defense";
import { DIPLOMA_TYPES, RUBRIC, RUBRIC_LEVELS, SCHOOL_KIT_CLASSES, SCHOOL_PLAN, SCHOOL_TOURNAMENT_GUIDE } from "../data/schoolKit";
import { formationName } from "../lib/field";
import type { ReadySession, SchoolClass } from "../lib/types";

const ROOT = path.resolve(__dirname, "..", "content");
const write = (rel: string, md: string) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, md.trim() + "\n");
};
const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const olist = (items: string[]) => items.map((i, k) => `${k + 1}. ${i}`).join("\n");

function blocks(bs: Block[]): string {
  return bs
    .map((b) => {
      switch (b.t) {
        case "p":
          return b.text;
        case "h":
          return `### ${b.text}`;
        case "ul":
          return list(b.items);
        case "ol":
          return olist(b.items);
        case "tip":
          return `> 💡 ${b.text}`;
        case "table":
          return [`| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
      }
    })
    .join("\n\n");
}

/* Manual */
write(
  "manual/MANUAL-TOCHO-BANDERA-5x5.md",
  `# ${MANUAL_TITLE}\n\n_${MANUAL_SUBTITLE}_\n\n## Índice\n\n${CHAPTERS.map((c) => `- ${c.number ? `Capítulo ${c.number}: ` : ""}${c.title}`).join("\n")}\n\n` +
    CHAPTERS.map((c) => `---\n\n## ${c.number ? `Capítulo ${c.number} · ` : ""}${c.title}\n\n_${c.summary}_\n\n${blocks(c.blocks)}`).join("\n\n"),
);

/* Clases */
const classMd = (c: SchoolClass) => `## Clase ${String(c.number).padStart(2, "0")} · ${c.title}

**Edad:** ${c.age} · **Duración:** ${c.duration} min

**Objetivos**
${list(c.objectives)}

**Material**
${list(c.material)}

**Calentamiento**
${list(c.warmup)}

**Actividad principal**
${list(c.main)}

**Juego final**
${list(c.finalGame)}

**Vuelta a la calma**
${list(c.cooldown)}

**Notas de seguridad**
${list(c.safety)}`;
write("classes/20-CLASES-TOCHO-BANDERA.md", `# 20 clases listas para enseñar Tocho Bandera\n\n${CLASSES.map(classMd).join("\n\n---\n\n")}`);

/* Drills */
write(
  "drills/BIBLIOTECA-DE-DRILLS.md",
  `# Biblioteca de drills (${DRILLS.length})\n\n` +
    DRILL_CATEGORIES.map(
      (cat) =>
        `## ${cat}\n\n` +
        DRILLS.filter((d) => d.category === cat)
          .map(
            (d) => `### ${d.name}
- **Objetivo:** ${d.objective}
- **Edad:** ${d.ages.join(", ")} · **Nivel:** ${d.level} · **Jugadores:** ${d.players.ideal} (mín. ${d.players.min}) · **Duración:** ${d.duration} min
- **Material:** ${d.material.join(", ")}
- **Organización:** ${d.setup}

**Cómo hacerlo**
${olist(d.steps)}

**Variaciones**
${list(d.variations)}

**Errores comunes**
${list(d.commonErrors)}

> 💡 ${d.coachTip}`,
          )
          .join("\n\n"),
    ).join("\n\n"),
);

/* Jugadas */
write(
  "plays/BIBLIOTECA-DE-JUGADAS.md",
  `# Biblioteca de jugadas (${PLAYS.length})\n\nLos diagramas se ven en la app (Biblioteca). Leyenda: X, Y, Z = receptores · C = centro · QB = mariscal. Verde = lectura principal · Amarillo = secundaria.\n\n` +
    PLAY_CATEGORIES.map(
      (cat) =>
        `## ${cat}\n\n` +
        PLAYS.filter((p) => p.category === cat)
          .map(
            (p) => `### ${p.name} (${p.id})
- **Formación:** ${formationName(p.formation)} · **Nivel:** ${p.level}
- **Rutas:** ${p.diagram.routes.filter((r) => r.type !== "motion").map((r) => `${r.playerId}: ${r.type}`).join(" · ")}
- **Objetivo:** ${p.objective}
- **Descripción:** ${p.description}
- **Lectura principal:** ${p.primaryRead}
- **Lectura secundaria:** ${p.secondaryRead}
- **Consejo:** ${p.coachTip}`,
          )
          .join("\n\n"),
    ).join("\n\n"),
);

/* Bonus */
const sessionMd = (s: ReadySession) =>
  `### ${String(s.number).padStart(2, "0")}. ${s.title}\n**${s.level} · ${s.age} · ${s.duration} min · ${s.focus}**\n\n| Min | Ejercicio | Duración |\n|---|---|---|\n` +
  s.blocks.map((b, i) => `| ${s.blocks.slice(0, i).reduce((a, x) => a + x.minutes, 0)}' | ${DRILL_MAP[b.drillId].name} (${DRILL_MAP[b.drillId].category}) | ${b.minutes} min |`).join("\n") +
  `\n\n> Nota del coach: ${s.coachNote}`;
const groupSessions = (arr: ReadySession[]) => Array.from(new Set(arr.map((s) => s.group!))).map((g) => `## ${g}\n\n${arr.filter((s) => s.group === g).map(sessionMd).join("\n\n")}`).join("\n\n");
const guideMd = (g: { title: string; intro: string; sections: GuideSection[]; drills: string[] }) => `# ${g.title}\n\n${g.intro}\n\n${g.sections.map((s) => `## ${s.title}\n\n${list(s.items)}`).join("\n\n")}\n\n## Drills recomendados\n\n${list(g.drills.map((id) => DRILL_MAP[id].name))}`;

write("bonuses/README.md", `# Bonus incluidos\n\n${BONUSES.map((b) => `${b.number}. **${b.title}** — ${b.desc}`).join("\n")}`);
write("bonuses/01-50-ENTRENAMIENTOS-LISTOS.md", `# 50 entrenamientos listos\n\n${groupSessions(READY_SESSIONS)}`);
write("bonuses/02-CHECKLIST-DIA-DE-PARTIDO.md", `# Checklist del Día de Partido\n\n${MATCH_CHECKLIST.map((g) => `## ${g.group}\n\n${g.items.map((i) => `- [ ] ${i}`).join("\n")}`).join("\n\n")}`);
write("bonuses/03-PLAN-30-DIAS.md", `# Plan de 30 días para un equipo nuevo\n\n${PLAN_30.map((d) => `## Día ${d.day} · ${d.title} (${d.kind})\n\n${list(d.tasks)}`).join("\n\n")}`);
write(
  "bonuses/04-KIT-DE-TORNEO.md",
  `# Kit de Torneo\n\nLa versión interactiva está en la app (Recursos → Kit de Torneo): genera calendario todos contra todos, captura resultados, calcula clasificación, registra stats y arma el plan del día.\n\n## Tabla de partidos\n\n| Ronda | Hora | Campo | Local | Marcador | Visitante |\n|---|---|---|---|---|---|\n${Array.from({ length: 8 }, () => "|  |  |  |  |  —  |  |").join("\n")}\n\n## Clasificación\n\n| # | Equipo | PJ | G | E | P | PF | PC | DIF | PTS |\n|---|---|---|---|---|---|---|---|---|---|\n${Array.from({ length: 6 }, (_, i) => `| ${i + 1} |  |  |  |  |  |  |  |  |  |`).join("\n")}\n\n## Roster y stats\n\n| # | Jugador | Posición | TD | REC | INT | FLG |\n|---|---|---|---|---|---|---|\n${Array.from({ length: 10 }, () => "|  |  |  |  |  |  |  |").join("\n")}\n\n## Plan del día\n\n- 60 min antes: llegada del coach\n- 45 min antes: llegada del equipo\n- 30 min antes: calentamiento\n- 10 min antes: repaso y mensaje\n- Partidos según la tabla\n- Cierre: estiramiento y reconocimiento`,
);
write("bonuses/05-GUIA-RAPIDA-QB.md", guideMd(QB_GUIDE));
write("bonuses/06-GUIA-RAPIDA-RECEPTORES.md", guideMd(WR_GUIDE));

/* Order bumps */
write(
  "order-bumps/01-PLAYBOOK-DEFENSIVO-5x5.md",
  `# Playbook Defensivo 5x5\n\n## Conceptos\n\n${DEFENSE_CONCEPTS.map((c) => `### ${c.title}\n\n${c.body.join("\n\n")}`).join("\n\n")}\n\n## 30 esquemas\n\n${DEFENSE_SCHEMES.map(
    (s, i) => `### ${String(i + 1).padStart(2, "0")}. ${s.name}\n**${s.group} · ${s.level} · contra ${formationName(s.vs)}**\n\n${s.concept}\n\n**Fortalezas**\n${list(s.strengths)}\n\n**Debilidades**\n${list(s.weaknesses)}\n\n**Cuándo usarla:** ${s.whenToUse}\n\n> 💡 ${s.coachTip}`,
  ).join("\n\n")}\n\n## Situaciones\n\n| Situación | Defensa sugerida | Por qué |\n|---|---|---|\n${DEFENSE_SITUATIONS.map((s) => `| ${s.situation} | ${s.call} | ${s.why} |`).join("\n")}`,
);
write("order-bumps/02-PACK-50-ENTRENAMIENTOS-EXTRA.md", `# Pack 50 Entrenamientos Extra\n\n${groupSessions(EXTRA_SESSIONS)}`);
write(
  "order-bumps/03-KIT-COACH-ESCOLAR.md",
  `# Kit Coach Escolar\n\n## Planificación (8 semanas)\n\n| Semana | Tema | Clases | Evidencia |\n|---|---|---|---|\n${SCHOOL_PLAN.map((w) => `| ${w.week} | ${w.theme} | ${w.classes.join(", ")} | ${w.evidence} |`).join("\n")}\n\n## Rúbrica de evaluación\n\n| Criterio | ${RUBRIC_LEVELS.join(" | ")} |\n|---|---|---|---|---|\n${RUBRIC.map((r) => `| ${r.criterion} | ${r.levels.join(" | ")} |`).join("\n")}\n\n## Torneo escolar\n\n${olist(SCHOOL_TOURNAMENT_GUIDE.map((s) => `**${s.step}:** ${s.detail}`))}\n\n## Diplomas editables\n\nEn la app (Kit Coach Escolar → Diplomas) escribe los nombres y elige el reconocimiento: ${DIPLOMA_TYPES.join(", ")}.\n\n## 20 clases adicionales\n\n${SCHOOL_KIT_CLASSES.map(classMd).join("\n\n---\n\n")}`,
);

console.log("✓ Contenido exportado a /content");
