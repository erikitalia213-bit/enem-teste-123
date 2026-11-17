import { CheckCircle2, Clock, Dumbbell, Leaf, Play } from "lucide-react";
import Link from "next/link";
import { NOME_TREINO, rotinaDescanso } from "@/content/protocolo";
import type { Nivel, NumeroFase } from "@/content/tipos";
import type { DiaPlano } from "@/lib/protocolo/calendario";
import { montarTreino, resolverVersao } from "@/lib/protocolo/montarTreino";

/** Card grande do treino (ou descanso ativo) de um dia. */
export function CardTreinoDoDia({ dia, nivel, concluido, destaque = true }: { dia: DiaPlano; nivel: Nivel; concluido: boolean; destaque?: boolean }) {
  const ehDescanso = dia.tipo === "descanso";
  const treino = !ehDescanso && dia.letra ? montarTreino(dia.fase as NumeroFase, dia.letra, resolverVersao(dia.local), nivel) : null;
  const titulo = ehDescanso ? rotinaDescanso.nome : `Treino ${dia.letra}`;
  const foco = ehDescanso ? "Mobilidade e ativação" : NOME_TREINO[dia.letra!];
  const duracao = ehDescanso ? rotinaDescanso.duracaoMin : treino!.duracaoMin;
  const nExercicios = ehDescanso ? rotinaDescanso.itens.length : treino!.itens.length;

  return (
    <section
      aria-label={`${titulo} do dia ${dia.dia}`}
      className={`relative overflow-hidden rounded-[20px] border p-5 ${
        concluido ? "border-limao/40 bg-limao/[0.06]" : destaque ? "border-limao/30 bg-gradient-to-br from-[#1b2208] via-card to-card" : "cartao"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="rotulo text-limao">{ehDescanso ? "Hoje é dia de recuperar" : "Treino do dia"}</p>
          <h2 className="titulo mt-1 text-[34px] leading-none">{titulo}</h2>
          <p className="mt-1.5 text-[15px] text-texto/90">{foco}</p>
        </div>
        <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${ehDescanso ? "bg-ok/15 text-ok" : "bg-limao/15 text-limao"}`}>
          {ehDescanso ? <Leaf size={28} aria-hidden /> : <Dumbbell size={28} aria-hidden />}
        </span>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-suave">
        <li className="flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1">
          <Clock size={14} aria-hidden /> ~{duracao} min
        </li>
        <li className="rounded-full bg-black/30 px-2.5 py-1">{nExercicios} exercícios</li>
        {!ehDescanso && (
          <li className="rounded-full bg-black/30 px-2.5 py-1">{dia.local === "ambos" ? "Academia ou casa" : dia.local === "casa" ? "Em casa" : "Academia"}</li>
        )}
      </ul>
      {concluido ? (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-bold text-limao">
            <CheckCircle2 size={22} aria-hidden /> Concluído!
          </p>
          <Link href={`/treino/${dia.dia}`} className="botao-secundario">
            Ver de novo
          </Link>
        </div>
      ) : (
        <Link href={`/treino/${dia.dia}`} className="botao-primario animate-pulso mt-5 w-full text-[17px]">
          <Play size={20} fill="currentColor" aria-hidden /> {ehDescanso ? "Começar rotina de 5 min" : "Começar treino"}
        </Link>
      )}
    </section>
  );
}
