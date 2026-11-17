import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Check, ChevronRight, Leaf, Lock } from "lucide-react";
import { DICA_OBJETIVO, fases, NOME_TREINO } from "@/content/protocolo";
import { Cabecalho } from "@/components/app/Cabecalho";
import { CardTreinoDoDia } from "@/components/treino/CardTreinoDoDia";
import { NOME_DIA_CURTO, formatarData } from "@/lib/datas";
import { diasConcluidos, montarPlano } from "@/lib/plano";
import { estadoDoDia } from "@/lib/protocolo/progresso";
import { exigirAlunaPronta } from "@/lib/sessao";

export const metadata: Metadata = { title: "Treino" };

export default async function Treino() {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);
  const feitos = diasConcluidos(await repo.listarTreinos(usuario));
  const semana = plano.diaHojePlano.semana;
  const diasDaSemana = plano.calendario.filter((d) => d.semana === semana);
  const fase = fases[plano.fase - 1]!;

  return (
    <main className="flex flex-col gap-5">
      <Cabecalho titulo="Treino" subtitulo={`Semana ${semana} de 6 · Fase ${fase.numero}: ${fase.nome}`} />
      <div className="flex flex-col gap-5 px-5">
        {!plano.terminou && <CardTreinoDoDia dia={plano.diaHojePlano} nivel={perfil.nivel} concluido={feitos.has(plano.diaAtual)} />}

        <section aria-labelledby="titulo-semana">
          <h2 id="titulo-semana" className="titulo mb-3 text-[24px]">
            Sua semana
          </h2>
          <ul className="flex flex-col gap-2">
            {diasDaSemana.map((d) => {
              const estado = estadoDoDia(d.dia, plano.diaReal, feitos);
              const bloqueado = estado === "bloqueado";
              const conteudo = (
                <>
                  <span className="w-11 shrink-0 text-center">
                    <span className="block text-[11px] font-bold uppercase text-suave">{NOME_DIA_CURTO[d.diaSemana]}</span>
                    <span className="titulo block text-xl leading-tight">{formatarData(d.data, "dd")}</span>
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">
                      {d.tipo === "treino" ? `Treino ${d.letra}` : "Descanso ativo"}
                      {estado === "hoje" && <span className="ml-2 rounded-full bg-limao px-2 py-0.5 text-[10px] font-bold uppercase text-fundo">Hoje</span>}
                    </span>
                    <span className="block text-xs text-suave">{d.tipo === "treino" ? NOME_TREINO[d.letra!] : "5 min de mobilidade e ativação"}</span>
                  </span>
                  <span className="shrink-0">
                    {estado === "concluido" ? (
                      <span className="grid size-8 place-items-center rounded-full bg-limao text-fundo">
                        <Check size={18} strokeWidth={3} aria-label="Concluído" />
                      </span>
                    ) : bloqueado ? (
                      <Lock size={18} className="text-suave" aria-label="Bloqueado até o dia chegar" />
                    ) : d.tipo === "descanso" ? (
                      <Leaf size={18} className="text-ok" aria-hidden />
                    ) : (
                      <ChevronRight size={20} className="text-suave" aria-hidden />
                    )}
                  </span>
                </>
              );
              const classe = `cartao flex min-h-[64px] items-center gap-3 px-3 py-2.5 ${estado === "hoje" ? "border-limao/60" : ""} ${bloqueado ? "opacity-50" : ""}`;
              return (
                <li key={d.dia}>
                  {bloqueado ? (
                    <div className={classe}>{conteudo}</div>
                  ) : (
                    <Link href={`/treino/${d.dia}`} className={classe}>
                      {conteudo}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="cartao p-4">
          <h2 className="rotulo text-dourado">Foco da fase {fase.nome}</h2>
          <ul className="mt-2 grid grid-cols-2 gap-1.5 text-sm">
            {fase.foco.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-limao" /> {f}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-suave">💡 {DICA_OBJETIVO[perfil.objetivo]}</p>
        </section>

        <Link href="/biblioteca" className="cartao flex min-h-[72px] items-center gap-3 p-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-limao/15 text-limao">
            <BookOpen size={24} aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Biblioteca de exercícios</span>
            <span className="text-xs text-suave">Todos os exercícios com passo a passo, onde sentir e erro comum</span>
          </span>
          <ChevronRight size={20} className="text-suave" aria-hidden />
        </Link>
      </div>
    </main>
  );
}
