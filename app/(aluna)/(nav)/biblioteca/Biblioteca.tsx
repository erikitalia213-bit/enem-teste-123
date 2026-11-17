"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { imagensExercicio, ROTULO_MUSCULO } from "@/content/exercicios";
import type { LocalTreino, Musculo } from "@/content/tipos";

interface ItemBiblioteca {
  slug: string;
  nome: string;
  local: LocalTreino;
  musculoAlvo: Musculo;
  equipamento: string;
  temImagem: boolean;
}

type FiltroLocal = "todos" | "academia" | "casa";

const ROTULO_LOCAL: Record<LocalTreino, string> = { academia: "Academia", casa: "Casa", ambos: "Academia e casa" };

/** Remove acentos para a busca ("gluteo" encontra "glúteo"). */
const normalizar = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function Biblioteca({ exercicios }: { exercicios: ItemBiblioteca[] }) {
  const [local, setLocal] = useState<FiltroLocal>("todos");
  const [musculo, setMusculo] = useState<Musculo | "todos">("todos");
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = normalizar(busca.trim());
    return exercicios.filter(
      (e) =>
        (local === "todos" || e.local === local || e.local === "ambos") &&
        (musculo === "todos" || e.musculoAlvo === musculo) &&
        (!termo || normalizar(`${e.nome} ${e.equipamento}`).includes(termo)),
    );
  }, [exercicios, local, musculo, busca]);

  const chip = (ativo: boolean) =>
    `min-h-11 shrink-0 rounded-full border-[1.5px] px-4 text-sm font-semibold transition ${ativo ? "border-limao bg-limao text-fundo" : "border-borda text-suave"}`;

  return (
    <div className="flex flex-col gap-3 px-5 pb-4">
      <label className="relative block">
        <span className="sr-only">Buscar exercício</span>
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-suave" aria-hidden />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar exercício ou equipamento"
          className="min-h-12 w-full rounded-app border-[1.5px] border-borda bg-card pl-10 pr-4 text-[15px] placeholder:text-suave/60 focus:border-limao focus:outline-none"
        />
      </label>

      <div role="radiogroup" aria-label="Filtrar por local" className="flex gap-2">
        {(["todos", "academia", "casa"] as const).map((l) => (
          <button key={l} type="button" role="radio" aria-checked={local === l} onClick={() => setLocal(l)} className={chip(local === l)}>
            {l === "todos" ? "Todos" : l === "academia" ? "Academia" : "Casa"}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label="Filtrar por músculo" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        <button type="button" role="radio" aria-checked={musculo === "todos"} onClick={() => setMusculo("todos")} className={chip(musculo === "todos")}>
          Todos os músculos
        </button>
        {(Object.keys(ROTULO_MUSCULO) as Musculo[]).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={musculo === m} onClick={() => setMusculo(m)} className={chip(musculo === m)}>
            {ROTULO_MUSCULO[m]}
          </button>
        ))}
      </div>

      <p className="text-xs text-suave" aria-live="polite">
        {filtrados.length} {filtrados.length === 1 ? "exercício" : "exercícios"}
      </p>

      <ul className="grid grid-cols-2 gap-3">
        {filtrados.map((e) => (
          <li key={e.slug}>
            <Link href={`/exercicios/${e.slug}`} className="cartao flex h-full flex-col overflow-hidden">
              <span className="relative block aspect-square bg-[#0b0b0b]">
                <Image
                  src={e.temImagem ? imagensExercicio(e.slug).inicio : "/img/mapa-base.webp"}
                  alt=""
                  fill
                  sizes="(max-width: 480px) 50vw, 220px"
                  className={e.temImagem ? "object-cover" : "object-cover object-[center_62%] opacity-40"}
                />
              </span>
              <span className="flex flex-1 flex-col p-3">
                <span className="text-[14px] font-semibold leading-snug">{e.nome}</span>
                <span className="mt-auto pt-1.5 text-[11px] text-suave">
                  {ROTULO_MUSCULO[e.musculoAlvo]} · {ROTULO_LOCAL[e.local]}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {filtrados.length === 0 && <p className="cartao p-4 text-center text-sm text-suave">Nenhum exercício com esses filtros.</p>}
    </div>
  );
}
