"use client";

import { useEffect } from "react";

export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="moldura flex flex-col items-center justify-center px-6 text-center">
      <h1 className="titulo text-[30px]">Ops, algo deu errado</h1>
      <p className="mt-2 max-w-[32ch] text-[15px] text-suave">Não foi culpa sua. Tente de novo; se continuar, fale com o suporte pelo seu perfil.</p>
      <button type="button" onClick={reset} className="botao-primario mt-8 w-full max-w-xs">
        Tentar de novo
      </button>
    </main>
  );
}
