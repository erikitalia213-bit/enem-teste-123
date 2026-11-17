"use client";

import { Check, ChevronRight } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import type { Receita, Refeicao } from "@/content/tipos";
import { ROTULO_REFEICAO } from "@/content/receitas";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { marcarRefeicao } from "@/lib/acoes/aluna";
import { ReceitaDetalhe } from "./ReceitaDetalhe";

export interface ItemRefeicao {
  refeicao: Refeicao;
  receita: Receita;
}

/**
 * As 4 refeições de um dia: checkbox para marcar como feita (salvo no Supabase)
 * e toque no nome para abrir a receita num bottom sheet.
 */
export function ListaRefeicoes({
  data,
  itens,
  marcadas,
  podeMarcar,
}: {
  data: string;
  itens: ItemRefeicao[];
  marcadas: Refeicao[];
  podeMarcar: boolean;
}) {
  const [aberta, setAberta] = useState<Receita | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [, iniciar] = useTransition();
  const [otimista, alternarOtimista] = useOptimistic(new Set(marcadas), (atual, ref: Refeicao) => {
    const novo = new Set(atual);
    if (novo.has(ref)) novo.delete(ref);
    else novo.add(ref);
    return novo;
  });

  const alternar = (item: ItemRefeicao) => {
    const marcar = !otimista.has(item.refeicao);
    setErro(null);
    iniciar(async () => {
      alternarOtimista(item.refeicao);
      const r = await marcarRefeicao(data, item.refeicao, item.receita.id, marcar);
      if (!r.ok) setErro(r.erro);
    });
  };

  return (
    <>
      <ul className="flex flex-col gap-2.5">
        {itens.map((item) => {
          const feita = otimista.has(item.refeicao);
          return (
            <li key={item.refeicao} className={`cartao flex items-stretch overflow-hidden transition-colors ${feita ? "border-limao/50" : ""}`}>
              {podeMarcar && (
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={feita}
                  aria-label={`Marcar ${ROTULO_REFEICAO[item.refeicao]} como feito`}
                  onClick={() => alternar(item)}
                  className="grid w-14 shrink-0 place-items-center border-r border-borda"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-lg border-2 transition ${feita ? "animate-pop border-limao bg-limao text-fundo" : "border-borda"}`}
                  >
                    {feita && <Check size={18} strokeWidth={3} aria-hidden />}
                  </span>
                </button>
              )}
              <button type="button" onClick={() => setAberta(item.receita)} className="flex min-h-[64px] flex-1 items-center gap-2 px-3.5 py-3 text-left">
                <span className="flex-1">
                  <span className="rotulo block text-[10px] text-suave">{ROTULO_REFEICAO[item.refeicao]}</span>
                  <span className={`block text-[15px] font-semibold leading-snug ${feita ? "text-suave line-through decoration-limao/70" : ""}`}>
                    {item.receita.nome}
                  </span>
                  <span className="mt-0.5 block text-xs text-suave">
                    {item.receita.tempoMin} min · proteína aprox. {item.receita.proteinaG} g
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-suave" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
      {erro && (
        <p role="alert" className="mt-2 text-sm text-rosa">
          {erro}
        </p>
      )}
      <BottomSheet aberto={Boolean(aberta)} aoFechar={() => setAberta(null)} titulo={aberta?.nome ?? ""}>
        {aberta && <ReceitaDetalhe receita={aberta} />}
      </BottomSheet>
    </>
  );
}
