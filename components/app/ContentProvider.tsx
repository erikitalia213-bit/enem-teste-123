"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AccountInfo, AppContent } from "@/lib/content-types";
import type { ProductId } from "@/lib/entitlements";
import { setStorageNamespace } from "@/lib/storage";

interface Ctx {
  content: AppContent;
  account: AccountInfo;
  has: (p: ProductId) => boolean;
}

const ContentCtx = createContext<Ctx | null>(null);

/**
 * Recibe del servidor el contenido autorizado y la cuenta del usuario.
 * También separa el almacenamiento local por usuario (dos cuentas en el
 * mismo navegador no mezclan jugadas ni equipos).
 */
export function ContentProvider({ content, account, children }: { content: AppContent; account: AccountInfo; children: ReactNode }) {
  useState(() => setStorageNamespace(account.id));
  const value: Ctx = { content, account, has: (p) => account.entitlements.includes(p) };
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

function useCtx() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent debe usarse dentro de /app (ContentProvider)");
  return ctx;
}

export const useContent = () => useCtx().content;
export const useAccount = () => useCtx().account;
export const useHas = () => useCtx().has;
