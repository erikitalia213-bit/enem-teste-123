import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Trophy } from "lucide-react";
import { fases } from "@/content/protocolo";
import { ListaRefeicoes } from "@/components/cardapio/ListaRefeicoes";
import { CardTreinoDoDia } from "@/components/treino/CardTreinoDoDia";
import { BarraProgresso } from "@/components/ui/BarraProgresso";
import { refeicoesDoDia } from "@/lib/cardapioDia";
import { TOTAL_DIAS } from "@/lib/config";
import { diasAteReveillon, formatarData } from "@/lib/datas";
import { capitalizar } from "@/lib/formatar";
import { diasConcluidos, montarPlano } from "@/lib/plano";
import { faseDoDia } from "@/lib/protocolo/calendario";
import { calcularSequencia, progressoDaFase } from "@/lib/protocolo/progresso";
import { exigirAlunaPronta } from "@/lib/sessao";

export const metadata: Metadata = { title: "Hoje" };

export default async function Hoje() {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);
  const [treinos, refeicoes] = await Promise.all([repo.listarTreinos(usuario), repo.listarRefeicoes(usuario, plano.hoje, plano.hoje)]);
  const feitos = diasConcluidos(treinos);
  const sequencia = calcularSequencia(feitos, plano.diaAtual);
  const fase = fases[plano.fase - 1]!;
  const progFase = progressoDaFase(plano.calendario, feitos, plano.fase, plano.diaAtual);
  const faltam = diasAteReveillon(plano.hoje);
  // Depois do dia 42 o cardápio continua girando no ciclo de 14 dias da reta final.
  const diaCardapio = plano.terminou ? plano.diaReal : plano.diaAtual;
  const itensRefeicao = refeicoesDoDia(diaCardapio, plano.terminou ? 3 : faseDoDia(plano.diaAtual));
  const marcadas = refeicoes.map((r) => r.refeicao);
  const nome = perfil.nome?.trim();

  return (
    <main className="flex flex-col gap-5 px-5 pt-[max(20px,env(safe-area-inset-top))]">
      <header>
        <p className="text-sm text-suave">{capitalizar(formatarData(plano.hoje, "EEEE, d 'de' MMMM"))}</p>
        <h1 className="titulo mt-1 text-[34px] leading-tight">{nome ? `Oi, ${nome}!` : "Oi!"}</h1>
        <p className="titulo text-[22px] text-limao">
          {plano.terminou ? "Protocolo concluído 🎆" : `Dia ${plano.diaAtual} de ${TOTAL_DIAS}`}
        </p>
      </header>

      {plano.terminou ? (
        <section className="cartao flex flex-col items-center p-6 text-center">
          <Image src="/img/celebracao.webp" alt="" width={140} height={140} />
          <h2 className="titulo mt-2 text-3xl">Você completou os 42 dias!</h2>
          <p className="mt-2 text-sm text-suave">
            Foram {feitos.size} dias cumpridos. Quer manter o ritmo? Você pode recomeçar o protocolo no seu perfil, e as cargas de agora viram
            o novo ponto de partida.
          </p>
          <Link href="/jornada" className="botao-secundario mt-4 w-full">
            <Trophy size={18} aria-hidden /> Ver minha jornada
          </Link>
        </section>
      ) : (
        <>
          <section className="cartao p-4" aria-label="Fase atual">
            <div className="flex items-baseline justify-between">
              <p className="rotulo text-dourado">
                Fase {fase.numero} · {fase.nome}
              </p>
              <p className="text-xs font-semibold text-suave">
                Dia {progFase.diasPassados} de {progFase.diasNaFase}
              </p>
            </div>
            <BarraProgresso valor={progFase.pctTempo} rotulo={`Progresso da fase ${fase.nome}`} className="mt-3" />
            <p className="mt-3 text-[13px] leading-relaxed text-suave">{fase.resumo}</p>
          </section>

          <CardTreinoDoDia dia={plano.diaHojePlano} nivel={perfil.nivel} concluido={feitos.has(plano.diaAtual)} />
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <section className="cartao p-4" aria-label="Sequência">
          <p className="flex items-center gap-1 text-[13px] font-semibold text-suave">
            <Flame size={16} className="text-rosa" aria-hidden /> Sequência
          </p>
          <p className="titulo mt-1 text-[40px] leading-none">
            {sequencia}
            <span aria-hidden> 🔥</span>
          </p>
          <p className="mt-1 text-xs text-suave">{sequencia === 1 ? "dia seguido" : "dias seguidos"}</p>
        </section>
        <section className="cartao relative overflow-hidden p-4" aria-label="Contagem regressiva">
          <Image src="/img/calendario-reveillon.webp" alt="" width={72} height={72} className="absolute -right-3 -top-2 opacity-60" />
          <p className="relative text-[13px] font-semibold text-suave">Réveillon</p>
          <p className="titulo relative mt-1 text-[40px] leading-none text-dourado">{faltam}</p>
          <p className="relative mt-1 text-xs text-suave">{faltam === 0 ? "É hoje! 🎆" : faltam === 1 ? "dia para o dia 31" : "dias para o dia 31"}</p>
        </section>
      </div>

      <section aria-labelledby="titulo-refeicoes" className="pb-2">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="titulo-refeicoes" className="titulo text-[24px]">
            Refeições de hoje
          </h2>
          <Link href="/cardapio" className="text-sm font-semibold text-limao">
            Cardápio
          </Link>
        </div>
        <ListaRefeicoes data={plano.hoje} itens={itensRefeicao} marcadas={marcadas} podeMarcar />
      </section>
    </main>
  );
}
