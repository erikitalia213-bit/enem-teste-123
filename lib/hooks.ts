"use client";

import { useCallback, useMemo } from "react";
import { BUMP_UNLOCK_CODES, type OrderBumpId } from "@/config";
import { DEFENSE_MAP, type DefenseScheme } from "@/data/defense";
import { PLAY_MAP } from "@/data/plays";
import { KEYS, useCollection, useStored } from "./storage";
import type { Play, Playbook, PlayRef, Player, TrackerSession, TrainingSession, DepthChart } from "./types";

/* ---------------- Perfil ---------------- */

export interface Profile {
  coachName: string;
  teamName: string;
  createdAt: number;
}

export function useProfile() {
  const [profile, setProfile, hydrated] = useStored<Profile | null>(KEYS.profile, null);
  return { profile, setProfile, hydrated };
}

/* ---------------- Colecciones ---------------- */

export const usePlays = () => useCollection<Play>(KEYS.plays);
export const usePlaybooks = () => useCollection<Playbook>(KEYS.playbooks);
export const useTrainings = () => useCollection<TrainingSession>(KEYS.trainings);
export const useRoster = () => useCollection<Player>(KEYS.roster);
export const useTracker = () => useCollection<TrackerSession>(KEYS.tracker);
export const useDepthChart = () => useStored<DepthChart>(KEYS.depth, {});

/* ---------------- Jugadas: referencias ---------------- */

export function defenseAsPlay(s: DefenseScheme): Play {
  return {
    id: s.id,
    name: s.name,
    side: "defense",
    formation: s.vs,
    category: `Defensa · ${s.group}`,
    level: s.level,
    diagram: s.diagram,
    objective: s.whenToUse,
    description: s.concept,
    primaryRead: s.strengths.join(" "),
    secondaryRead: s.weaknesses.join(" "),
    coachTip: s.coachTip,
    source: "library",
  };
}

export function useResolvePlay() {
  const { items } = usePlays();
  return useCallback(
    (ref: PlayRef): Play | undefined => {
      if (ref.source === "library") return PLAY_MAP[ref.id];
      if (ref.source === "defense") return DEFENSE_MAP[ref.id] ? defenseAsPlay(DEFENSE_MAP[ref.id]) : undefined;
      return items.find((p) => p.id === ref.id);
    },
    [items],
  );
}

/* ---------------- Playbook helpers ---------------- */

export const PLAYBOOK_SECTIONS = [
  { id: "ofensiva", label: "Ofensiva" },
  { id: "defensiva", label: "Defensiva" },
  { id: "redzone", label: "Red Zone" },
  { id: "conversion", label: "Conversión" },
  { id: "especiales", label: "Situaciones especiales" },
] as const;

export function emptyPlaybook(coach = "", team = ""): Playbook {
  const now = Date.now();
  return {
    id: `pb_${now.toString(36)}`,
    teamName: team || "Mi equipo",
    category: "",
    season: String(new Date().getFullYear()),
    coach,
    notes: "",
    sections: { ofensiva: [], defensiva: [], redzone: [], conversion: [], especiales: [] },
    createdAt: now,
    updatedAt: now,
  };
}

/** Sección sugerida según la categoría de la jugada. */
export function suggestSection(play: Play): keyof Playbook["sections"] {
  if (play.side === "defense") return "defensiva";
  if (play.category === "Red Zone") return "redzone";
  if (play.category === "Conversiones") return "conversion";
  if (play.category === "Situaciones especiales" || play.category === "Jugadas sorpresa") return "especiales";
  return "ofensiva";
}

/** Añade una jugada al playbook activo (o crea uno). Devuelve el nombre del playbook. */
export function useAddToPlaybook() {
  const { items, upsert } = usePlaybooks();
  const { profile } = useProfile();
  const [prefs, setPrefs] = useStored<{ activePlaybook?: string }>(KEYS.prefs, {});
  const active = useMemo(() => items.find((p) => p.id === prefs.activePlaybook) ?? items[0], [items, prefs.activePlaybook]);
  const add = useCallback(
    (ref: PlayRef, play: Play, playbookId?: string) => {
      let pb = (playbookId && items.find((p) => p.id === playbookId)) || active;
      if (!pb) {
        pb = emptyPlaybook(profile?.coachName, profile?.teamName);
        setPrefs((p) => ({ ...p, activePlaybook: pb!.id }));
      }
      const exists = Object.values(pb.sections).some((list) => list.some((r) => r.id === ref.id && r.source === ref.source));
      if (exists) return { playbook: pb, added: false };
      const section = suggestSection(play);
      const next: Playbook = { ...pb, sections: { ...pb.sections, [section]: [...pb.sections[section], ref] }, updatedAt: Date.now() };
      upsert(next);
      return { playbook: next, added: true };
    },
    [active, items, profile, setPrefs, upsert],
  );
  return { add, active, playbooks: items, setActive: (id: string) => setPrefs((p) => ({ ...p, activePlaybook: id })) };
}

/* ---------------- Order bumps ---------------- */

export function useUnlocked(id: OrderBumpId) {
  const [unlocks, setUnlocks] = useStored<string[]>(KEYS.unlocks, []);
  const code = BUMP_UNLOCK_CODES[id];
  const unlocked = !code || unlocks.includes(id);
  const tryUnlock = (input: string) => {
    if (input.trim().toUpperCase() === code.trim().toUpperCase()) {
      setUnlocks((u) => Array.from(new Set([...u, id])));
      return true;
    }
    return false;
  };
  return { unlocked, tryUnlock };
}
