"use client";

import Image from "next/image";
import { useState } from "react";
import { imagensExercicio } from "@/content/exercicios";

/**
 * Imagens de início e fim lado a lado. Toque alterna o destaque entre as duas
 * (e anima). Sem imagens geradas ainda: placeholder elegante com a silhueta.
 */
export function ImagemExercicio({
  slug,
  nome,
  temImagem,
  prioridade = false,
}: {
  slug: string;
  nome: string;
  temImagem: boolean;
  prioridade?: boolean;
}) {
  const [fase, setFase] = useState<"inicio" | "fim">("inicio");
  const img = imagensExercicio(slug);
  const alternar = () => setFase((f) => (f === "inicio" ? "fim" : "inicio"));

  if (!temImagem) {
    return (
      <div className="relative overflow-hidden rounded-app border border-borda bg-[#0b0b0b]" aria-label={`Ilustração do exercício ${nome} em breve`} role="img">
        <div className="grid grid-cols-2">
          {(["Início", "Fim"] as const).map((r, i) => (
            <div key={r} className="relative aspect-square">
              <Image
                src="/img/mapa-base.webp"
                alt=""
                fill
                sizes="(max-width: 480px) 50vw, 240px"
                className={`object-cover object-[center_62%] opacity-40 ${i === 1 ? "scale-x-[-1]" : ""}`}
                priority={prioridade}
              />
              <span className="rotulo absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-suave">{r}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/85 to-transparent px-4 pb-3 pt-10">
          <p className="titulo text-lg leading-tight text-texto">{nome}</p>
          <p className="text-xs text-suave">Ilustração chegando em breve. Siga os passos abaixo.</p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="group relative block w-full overflow-hidden rounded-app border border-borda bg-[#0b0b0b] text-left"
      aria-label={`Imagens do exercício ${nome}. Mostrando a posição ${fase === "inicio" ? "inicial" : "final"}. Toque para alternar.`}
    >
      <div className="grid grid-cols-2">
        {(["inicio", "fim"] as const).map((p) => (
          <div key={p} className="relative aspect-square">
            <Image
              src={img[p]}
              alt={`${nome}: posição ${p === "inicio" ? "inicial" : "final"}`}
              fill
              sizes="(max-width: 480px) 50vw, 240px"
              priority={prioridade}
              className={`object-cover transition duration-300 ${fase === p ? "scale-100 opacity-100" : "scale-95 opacity-45"}`}
            />
            <span className={`rotulo absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] ${fase === p ? "bg-limao text-fundo" : "bg-black/60 text-suave"}`}>
              {p === "inicio" ? "Início" : "Fim"}
            </span>
          </div>
        ))}
      </div>
      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-suave">Toque para alternar</span>
    </button>
  );
}
