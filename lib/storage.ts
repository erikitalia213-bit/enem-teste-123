"use client";

/* ============================================================
 *  Capa de persistencia de FLAGLAB
 *  Por defecto guarda todo en localStorage (sin backend).
 *  Para conectar Supabase u otro backend, implementa un
 *  StorageDriver y llama setStorageDriver() al iniciar la app.
 *  Ver docs/SUPABASE.md
 * ============================================================ */

import { useCallback, useSyncExternalStore } from "react";

export interface StorageDriver {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
  /** Lista de llaves administradas (para respaldo). */
  keys(): string[];
}

export const STORAGE_PREFIX = "flaglab:v1:";
/** Prefijo activo: cada usuario autenticado tiene su propio espacio en el navegador. */
let prefix = `${STORAGE_PREFIX}anon:`;

/** Cambia el espacio de almacenamiento al del usuario (lo llama ContentProvider). */
export function setStorageNamespace(userId: string) {
  const next = `${STORAGE_PREFIX}u:${userId}:`;
  if (next === prefix) return;
  prefix = next;
  cache.clear();
  listeners.forEach((set) => set.forEach((fn) => fn()));
}

const localDriver: StorageDriver = {
  read: (key) => {
    try {
      return window.localStorage.getItem(prefix + key);
    } catch {
      return null;
    }
  },
  write: (key, value) => {
    try {
      window.localStorage.setItem(prefix + key, value);
    } catch (err) {
      console.warn("FLAGLAB: no se pudo guardar en este navegador", err);
    }
  },
  remove: (key) => {
    try {
      window.localStorage.removeItem(prefix + key);
    } catch {
      /* noop */
    }
  },
  keys: () => {
    try {
      return Object.keys(window.localStorage)
        .filter((k) => k.startsWith(prefix))
        .map((k) => k.slice(prefix.length));
    } catch {
      return [];
    }
  },
};

let driver: StorageDriver = localDriver;
export function setStorageDriver(d: StorageDriver) {
  driver = d;
  cache.clear();
  listeners.forEach((set) => set.forEach((fn) => fn()));
}

/* ---------------- Store reactivo ---------------- */

const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
const fallbacks = new Map<string, unknown>();

function emit(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith(prefix)) {
      const k = e.key.slice(prefix.length);
      cache.delete(k);
      emit(k);
    }
  });
}

export function readKey<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = driver.read(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: T = fallback;
  if (raw != null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeKey<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  driver.write(key, raw);
  cache.set(key, { raw, value });
  emit(key);
}

export function removeKey(key: string) {
  driver.remove(key);
  cache.delete(key);
  emit(key);
}

function subscribe(key: string, fn: () => void) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(fn);
  return () => set!.delete(fn);
}

function stableFallback<T>(key: string, fallback: T): T {
  if (!fallbacks.has(key)) fallbacks.set(key, fallback);
  return fallbacks.get(key) as T;
}

/**
 * Hook para leer/escribir un valor persistente.
 * Devuelve [valor, setValor, hidratado].
 */
export function useStored<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void, boolean] {
  const fb = stableFallback(key, fallback);
  const value = useSyncExternalStore(
    (fn) => subscribe(key, fn),
    () => readKey(key, fb),
    () => fb,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const prev = readKey(key, fb);
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      writeKey(key, next);
    },
    [key, fb],
  );
  return [value, set, hydrated];
}

/** Hook de colección con helpers CRUD por id. */
export function useCollection<T extends { id: string }>(key: string) {
  const [items, setItems, hydrated] = useStored<T[]>(key, []);
  const upsert = useCallback(
    (item: T) =>
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === item.id);
        if (idx === -1) return [item, ...prev];
        const copy = prev.slice();
        copy[idx] = item;
        return copy;
      }),
    [setItems],
  );
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), [setItems]);
  const get = useCallback((id: string) => items.find((p) => p.id === id), [items]);
  return { items, setItems, upsert, remove, get, hydrated };
}

/* ---------------- Llaves ---------------- */

export const KEYS = {
  profile: "profile",
  plays: "plays",
  playbooks: "playbooks",
  trainings: "trainings",
  roster: "roster",
  depth: "depth",
  tracker: "tracker",
  wristband: "wristband",
  tournament: "tournament",
  checklist: "checklist",
  plan30: "plan30",
  prefs: "prefs",
} as const;

/* ---------------- Respaldo ---------------- */

export function exportAll(): string {
  const data: Record<string, unknown> = {};
  for (const k of driver.keys()) {
    const raw = driver.read(k);
    if (raw != null) {
      try {
        data[k] = JSON.parse(raw);
      } catch {
        /* ignora */
      }
    }
  }
  return JSON.stringify({ app: "FLAGLAB 5x5", version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function importAll(json: string): number {
  const parsed = JSON.parse(json) as { app?: string; data?: Record<string, unknown> };
  if (!parsed || typeof parsed !== "object" || !parsed.data) throw new Error("Archivo de respaldo no válido");
  const allowed = new Set<string>(Object.values(KEYS));
  let n = 0;
  for (const [k, v] of Object.entries(parsed.data)) {
    if (!allowed.has(k)) continue;
    writeKey(k, v);
    n++;
  }
  return n;
}

export function clearAll() {
  for (const k of driver.keys()) removeKey(k);
}

export function downloadFile(filename: string, content: string, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
