"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Refeicao } from "@/content/tipos";
import { ListaRefeicoes, type ItemRefeicao } from "@/components/cardapio/ListaRefeicoes";
import { NOME_DIA, NOME_DIA_CURTO, diaDaSemana } from "@/lib/datas";
import type { RefeicaoMarcada } from "@/lib/dados/tipos";

export interface DiaDoCardapio {
  diaProtocolo: number;
  data: string;
  itens: ItemRefeicao[];
}

export function CardapioSemana({ dias, hoje, semana, marcadas }: { dias: DiaDoCardapio[]; hoje: string; semana: number; marcadas: RefeicaoMarcada[] }) {
  const indiceHoje = Math.max(0, dias.findIndex((d) => d.data === hoje));
  const [aba, setAba] = useState(indiceHoje);
  const atual = dias[aba]!;
  const marcadasDoDia = marcadas.filter((m) => m.data === atual.data).map((m) => m.refeicao as Refeicao);
  const proteinaDia = atual.itens.reduce((t, i) => t + i.receita.proteinaG, 0);

  return (
    <div className="flex flex-col gap-4 px-5 pb-4">
      <div role="tablist" aria-label="Dias da semana" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        {dias.map((d, i) => {
          const ds = diaDaSemana(d.data);
          const selecionada = i === aba;
          return (
            <button
              key={d.data}
              type="button"
              role="tab"
              id={`aba-${i}`}
              aria-selected={selecionada}
              aria-controls="painel-dia"
              onClick={() => setAba(i)}
              className={`flex min-h-[60px] min-w-[52px] shrink-0 flex-col items-center justify-center rounded-app border-[1.5px] px-2 transition ${
                selecionada ? "border-limao bg-limao text-fundo" : d.data === hoje ? "border-limao/60 text-limao" : "border-borda text-suave"
              }`}
            >
              <span className="text-[11px] font-bold uppercase">{NOME_DIA_CURTO[ds]}</span>
              <span className="titulo text-lg leading-tight">{d.data.slice(8, 10)}</span>
            </button>
          );
        })}
      </div>

      <section id="painel-dia" role="tabpanel" aria-labelledby={`aba-${aba}`}>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="titulo text-[22px]">
            {NOME_DIA[diaDaSemana(atual.data)]}
            {atual.data === hoje && <span className="text-limao"> · hoje</span>}
          </h2>
          <span className="text-xs text-suave">proteína aprox. {proteinaDia} g no dia</span>
        </div>
        <ListaRefeicoes key={atual.data} data={atual.data} itens={atual.itens} marcadas={marcadasDoDia} podeMarcar={atual.data <= hoje} />
        {atual.data > hoje && <p className="mt-2 text-xs text-suave">Dá para marcar as refeições quando o dia chegar.</p>}
      </section>

      <Link href={`/cardapio/lista-compras?semana=${semana}`} className="botao-primario w-full">
        <ShoppingCart size={20} aria-hidden /> Lista de compras da semana
      </Link>
    </div>
  );
}
