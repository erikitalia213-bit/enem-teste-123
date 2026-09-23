import "server-only";
import { CLASSES } from "@/data/classes";
import { DRILLS } from "@/data/drills";
import { CHAPTERS, MANUAL_SUBTITLE, MANUAL_TITLE } from "@/data/manual";
import { PLAYS } from "@/data/plays";
import { BONUSES, MATCH_CHECKLIST, PLAN_30, QB_GUIDE, WR_GUIDE } from "@/data/bonuses";
import { EXTRA_SESSIONS, READY_SESSIONS } from "@/data/readySessions";
import { DEFENSE_CONCEPTS, DEFENSE_SCHEMES, DEFENSE_SITUATIONS } from "@/data/defense";
import { RUBRIC, RUBRIC_LEVELS, SCHOOL_KIT_CLASSES, SCHOOL_PLAN, SCHOOL_TOURNAMENT_GUIDE } from "@/data/schoolKit";
import type { AppContent } from "@/lib/content-types";
import type { ProductId } from "@/lib/entitlements";

/**
 * Arma el contenido que el usuario tiene derecho a ver.
 * Este módulo solo se importa desde el servidor: el contenido de pago
 * nunca forma parte del JavaScript público de la app.
 */
export function loadContent(entitlements: ProductId[]): AppContent | null {
  if (!entitlements.includes("core_flaglab")) return null;
  const content: AppContent = {
    core: {
      plays: PLAYS,
      drills: DRILLS,
      classes: CLASSES,
      chapters: CHAPTERS,
      manualTitle: MANUAL_TITLE,
      manualSubtitle: MANUAL_SUBTITLE,
      readySessions: READY_SESSIONS,
      checklist: MATCH_CHECKLIST,
      plan30: PLAN_30,
      qbGuide: QB_GUIDE,
      wrGuide: WR_GUIDE,
      bonuses: BONUSES,
    },
  };
  if (entitlements.includes("defensive_playbook")) content.defense = { schemes: DEFENSE_SCHEMES, concepts: DEFENSE_CONCEPTS, situations: DEFENSE_SITUATIONS };
  if (entitlements.includes("extra_trainings")) content.extraSessions = EXTRA_SESSIONS;
  if (entitlements.includes("school_coach_kit"))
    content.schoolKit = { classes: SCHOOL_KIT_CLASSES, plan: SCHOOL_PLAN, rubric: RUBRIC, rubricLevels: RUBRIC_LEVELS, tournamentGuide: SCHOOL_TOURNAMENT_GUIDE };
  return content;
}
