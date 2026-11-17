import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, Crosshair, Dumbbell, MapPin, Sparkles, Target } from "lucide-react";
import { obterExercicio, ROTULO_MUSCULO } from "@/content/exercicios";
import { treinosBase } from "@/content/protocolo";
import { Cabecalho } from "@/components/app/Cabecalho";
import { AvisoTreino } from "@/components/ui/AvisoTreino";
import { ImagemExercicio } from "@/components/ui/ImagemExercicio";
import { temImagem } from "@/lib/imagens";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = obterExercicio((await params).slug);
  return { title: e?.nome ?? "Exercício" };
}

const ROTULO_LOCAL = { academia: "Academia", casa: "Casa", ambos: "Academia e casa" } as const;

export default async function PaginaExercicio({ params }: { params: Promise<{ slug: string }> }) {
  const e = obterExercicio((await params).slug);
  if (!e) notFound();

  const usadoEm = [...new Set(treinosBase.filter((t) => t.itens.some((i) => i.exercicio === e.slug)).map((t) => `Fase ${t.fase} · Treino ${t.letra}`))];

  return (
    <main className="flex flex-col">
      <Cabecalho titulo="Exercício" voltar="/biblioteca" />
      <article className="flex flex-col gap-4 px-5 pb-4">
        <ImagemExercicio slug={e.slug} nome={e.nome} temImagem={temImagem(e.slug)} prioridade />
        <h2 className="titulo text-[30px] leading-tight">{e.nome}</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="flex items-center gap-2">
            <Target size={16} className="text-limao" aria-hidden /> <b>Músculo alvo:</b> {ROTULO_MUSCULO[e.musculoAlvo]}
            {e.secundarios?.length ? <span className="text-suave">(+ {e.secundarios.join(", ")})</span> : null}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={16} className="text-limao" aria-hidden /> <b>Onde:</b> {ROTULO_LOCAL[e.local]}
          </li>
          <li className="flex items-start gap-2">
            <Dumbbell size={16} className="mt-0.5 shrink-0 text-limao" aria-hidden />
            <span>
              <b>Equipamento:</b> {e.equipamento}
            </span>
          </li>
        </ul>

        <section aria-labelledby="como-fazer">
          <h3 id="como-fazer" className="rotulo mb-2 text-limao">
            Como fazer
          </h3>
          <ol className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
            {e.passos.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="titulo grid size-7 shrink-0 place-items-center rounded-full bg-limao/15 text-sm text-limao">{i + 1}</span>
                <span className="pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="flex gap-2.5 rounded-app border border-limao/30 bg-limao/[0.07] p-3 text-sm leading-relaxed">
          <Crosshair size={18} className="mt-0.5 shrink-0 text-limao" aria-hidden />
          <span>
            <b className="text-limao">Onde sentir:</b> {e.ondeSentir}
          </span>
        </p>
        <p className="flex gap-2.5 rounded-app border border-rosa/40 bg-rosa/10 p-3 text-sm leading-relaxed">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rosa" aria-hidden />
          <span>
            <b className="text-rosa">Erro comum:</b> {e.erroComum}
          </span>
        </p>
        <p className="flex gap-2.5 rounded-app border border-dourado/30 bg-dourado/[0.07] p-3 text-sm leading-relaxed">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-dourado" aria-hidden />
          <span>
            <b className="text-dourado">Dica de ouro:</b> {e.dicaDeOuro}
          </span>
        </p>

        {usadoEm.length > 0 && (
          <section>
            <h3 className="rotulo mb-2 text-suave">Aparece no protocolo em</h3>
            <ul className="flex flex-wrap gap-1.5">
              {usadoEm.map((u) => (
                <li key={u} className="rounded-full border border-borda px-2.5 py-1 text-xs text-suave">
                  {u}
                </li>
              ))}
            </ul>
          </section>
        )}
        <AvisoTreino className="mt-2" />
      </article>
    </main>
  );
}
