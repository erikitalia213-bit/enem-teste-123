"use client";

import { LogOut } from "lucide-react";
import { sair } from "@/lib/acoes/sessao";

/** Sai da conta e apaga as páginas salvas pelo service worker neste aparelho. */
export function BotaoSair({ rotulo = "Sair" }: { rotulo?: string }) {
  return (
    <form
      action={sair}
      onSubmit={() => {
        navigator.serviceWorker?.controller?.postMessage({ tipo: "limpar-paginas" });
        try {
          Object.keys(localStorage)
            .filter((k) => k.startsWith("p42:treino:"))
            .forEach((k) => localStorage.removeItem(k));
        } catch {
          // sem armazenamento
        }
      }}
    >
      <button type="submit" className="botao-secundario w-full">
        <LogOut size={18} aria-hidden /> {rotulo}
      </button>
    </form>
  );
}
