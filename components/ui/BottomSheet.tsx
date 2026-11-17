"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

/** Painel que sobe de baixo (receitas, lista de compras). Fecha com Esc, toque fora ou no X. */
export function BottomSheet({
  aberto,
  aoFechar,
  titulo,
  children,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    document.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    painel.current?.focus();
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={aoFechar} />
      <div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        tabIndex={-1}
        className="animate-subir relative max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-t-[24px] border border-b-0 border-borda bg-card px-5 pt-3 pb-8 outline-none area-segura-baixo"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-borda" aria-hidden />
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id={id} className="titulo text-2xl">
            {titulo}
          </h2>
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-suave hover:text-texto">
            <X size={22} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
