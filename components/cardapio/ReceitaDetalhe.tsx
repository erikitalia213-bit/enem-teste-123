import { Clock, Flame, Users } from "lucide-react";
import type { Receita } from "@/content/tipos";
import { formatarIngrediente } from "@/lib/formatar";

export function TagsReceita({ receita }: { receita: Receita }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Características">
      {receita.tags.map((t) => (
        <li key={t} className="rounded-full border border-borda bg-card-2 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-suave">
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Conteúdo completo de uma receita (usado dentro do bottom sheet). */
export function ReceitaDetalhe({ receita }: { receita: Receita }) {
  return (
    <div className="flex flex-col gap-5">
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="cartao px-2 py-3">
          <Clock className="mx-auto text-limao" size={18} aria-hidden />
          <dt className="sr-only">Tempo de preparo</dt>
          <dd className="mt-1 text-sm font-bold">{receita.tempoMin} min</dd>
        </div>
        <div className="cartao px-2 py-3">
          <Users className="mx-auto text-limao" size={18} aria-hidden />
          <dt className="sr-only">Porções</dt>
          <dd className="mt-1 text-sm font-bold">
            {receita.porcoes} {receita.porcoes > 1 ? "porções" : "porção"}
          </dd>
        </div>
        <div className="cartao px-2 py-3">
          <Flame className="mx-auto text-limao" size={18} aria-hidden />
          <dt className="sr-only">Proteína por porção</dt>
          <dd className="mt-1 text-sm font-bold">aprox. {receita.proteinaG} g</dd>
        </div>
      </dl>
      <TagsReceita receita={receita} />
      <section>
        <h3 className="rotulo mb-2 text-limao">Ingredientes</h3>
        <ul className="flex flex-col gap-1.5 text-[15px]">
          {receita.ingredientes.map((ing, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-limao" />
              {formatarIngrediente(ing)}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="rotulo mb-2 text-limao">Modo de preparo</h3>
        <ol className="flex flex-col gap-3 text-[15px] leading-relaxed">
          {receita.preparo.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span className="titulo grid size-7 shrink-0 place-items-center rounded-full bg-limao/15 text-sm text-limao">{i + 1}</span>
              <span className="pt-0.5">{p}</span>
            </li>
          ))}
        </ol>
      </section>
      <p className="text-xs text-suave">Proteína aproximada por porção, apenas como referência.</p>
    </div>
  );
}
