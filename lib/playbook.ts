import { PLAYBOOK_SECTIONS } from "./hooks";
import type { Playbook, PlaybookSectionId, PlayRef } from "./types";

export interface FlatEntry {
  ref: PlayRef;
  section: PlaybookSectionId;
  index: number;
  number: number;
}

/** Lista plana numerada (01, 02…) siguiendo el orden de secciones. */
export function flattenPlaybook(pb: Playbook): FlatEntry[] {
  const out: FlatEntry[] = [];
  let n = 1;
  for (const s of PLAYBOOK_SECTIONS) {
    pb.sections[s.id].forEach((ref, index) => out.push({ ref, section: s.id, index, number: n++ }));
  }
  return out;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function moveRef(pb: Playbook, from: { section: PlaybookSectionId; index: number }, to: { section: PlaybookSectionId; index: number }): Playbook {
  const sections = { ...pb.sections };
  const src = sections[from.section].slice();
  const [item] = src.splice(from.index, 1);
  if (!item) return pb;
  sections[from.section] = src;
  const dst = from.section === to.section ? src : sections[to.section].slice();
  let idx = to.index;
  if (from.section === to.section && from.index < to.index) idx -= 1;
  dst.splice(Math.max(0, Math.min(idx, dst.length)), 0, item);
  sections[to.section] = dst;
  return { ...pb, sections, updatedAt: Date.now() };
}

export function removeRef(pb: Playbook, section: PlaybookSectionId, index: number): Playbook {
  const list = pb.sections[section].slice();
  list.splice(index, 1);
  return { ...pb, sections: { ...pb.sections, [section]: list }, updatedAt: Date.now() };
}

export function countPlays(pb: Playbook) {
  return Object.values(pb.sections).reduce((a, l) => a + l.length, 0);
}
