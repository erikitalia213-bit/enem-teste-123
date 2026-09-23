/* Forma del contenido que el servidor entrega a la app según los entitlements. */
import type { Chapter } from "@/data/manual-types";
import type { ProductId } from "./entitlements";
import type { DefenseScheme, Drill, Play, ReadySession, SchoolClass } from "./types";

export interface GuideSection {
  title: string;
  items: string[];
}
export interface GuideData {
  title: string;
  intro: string;
  sections: GuideSection[];
  drills: string[];
}

export interface CoreContent {
  plays: Play[];
  drills: Drill[];
  classes: SchoolClass[];
  chapters: Chapter[];
  manualTitle: string;
  manualSubtitle: string;
  readySessions: ReadySession[];
  checklist: { group: string; items: string[] }[];
  plan30: { day: number; kind: "Entrenamiento" | "Coach" | "Descanso" | "Partido"; title: string; tasks: string[]; sessionId?: string }[];
  qbGuide: GuideData;
  wrGuide: GuideData;
  bonuses: { id: string; number: number; title: string; desc: string; href: string }[];
}

export interface DefenseContent {
  schemes: DefenseScheme[];
  concepts: { title: string; body: string[] }[];
  situations: { situation: string; call: string; why: string }[];
}

export interface SchoolKitContent {
  classes: SchoolClass[];
  plan: { week: number; theme: string; classes: string[]; evidence: string }[];
  rubric: { criterion: string; levels: [string, string, string, string] }[];
  rubricLevels: string[];
  tournamentGuide: { step: string; detail: string }[];
}

export interface AppContent {
  core: CoreContent;
  defense?: DefenseContent;
  extraSessions?: ReadySession[];
  schoolKit?: SchoolKitContent;
}

export interface AccountInfo {
  id: string;
  email: string;
  coachName: string;
  teamName: string;
  mode: "supabase" | "dev";
  entitlements: ProductId[];
}
