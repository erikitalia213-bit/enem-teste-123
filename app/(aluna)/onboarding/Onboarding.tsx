"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type { LocalTreino, Nivel, Objetivo } from "@/content/tipos";
import { BarraProgresso } from "@/components/ui/BarraProgresso";
import { concluirOnboarding } from "@/lib/acoes/aluna";
import { soltarConfete } from "@/lib/confete";
import { NOME_DIA_CURTO } from "@/lib/datas";
import { DIAS_TREINO } from "@/lib/protocolo/calendario";
import { lerQuizSalvo } from "@/lib/quiz";

const LOCAIS: { valor: LocalTreino; titulo: string; texto: string; img: string }[] = [
  { valor: "academia", titulo: "Na academia", texto: "Máquinas, barra e polia", img: "/img/local-academia.webp" },
  { valor: "casa", titulo: "Em casa", texto: "Peso do corpo, elástico e mochila", img: "/img/local-casa.webp" },
  { valor: "ambos", titulo: "Nos dois", texto: "Escolho no dia do treino", img: "/img/local-ambos.webp" },
];

const OBJETIVOS: { valor: Objetivo; titulo: string; img: string }[] = [
  { valor: "volume", titulo: "Mais volume", img: "/img/obj-volume.webp" },
  { valor: "empinado", titulo: "Mais empinado", img: "/img/obj-empinado.webp" },
  { valor: "firme", titulo: "Firme e definido", img: "/img/obj-firme.webp" },
  { valor: "flacidez", titulo: "Menos flacidez", img: "/img/obj-flacidez.webp" },
];

const NIVEIS: { valor: Nivel; titulo: string; texto: string; img: string }[] = [
  { valor: "iniciante", titulo: "Estou começando", texto: "Foco em técnica, volume mais leve no início", img: "/img/tempo-iniciante.webp" },
  { valor: "intermediario", titulo: "Treino há menos de 1 ano", texto: "Técnica + progressão de carga", img: "/img/tempo-menos1.webp" },
  { valor: "estagnada", titulo: "Treino há mais de 1 ano e travei", texto: "Técnicas avançadas para destravar", img: "/img/tempo-mais1.webp" },
];

const TOTAL_ETAPAS = 4;

export function Onboarding({ nomeInicial }: { nomeInicial: string }) {
  const [etapa, setEtapa] = useState(0);
  const [direcao, setDirecao] = useState<"frente" | "tras">("frente");
  const [nome, setNome] = useState(nomeInicial);
  const [local, setLocal] = useState<LocalTreino | null>(null);
  const [dias, setDias] = useState(3);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciar] = useTransition();
  const [concluido, setConcluido] = useState(false);

  // Pré-preenche com as respostas do quiz (salvas em /bem-vinda).
  useEffect(() => {
    const q = lerQuizSalvo();
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe no navegador */
    if (q.nome && !nomeInicial) setNome(q.nome);
    if (q.local) setLocal(q.local);
    if (q.dias) setDias(q.dias);
    if (q.objetivo) setObjetivo(q.objetivo);
    if (q.nivel) setNivel(q.nivel);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [nomeInicial]);

  useEffect(() => {
    if (concluido) void soltarConfete(true);
  }, [concluido]);

  const avancar = () => {
    setDirecao("frente");
    setEtapa((e) => Math.min(TOTAL_ETAPAS - 1, e + 1));
  };
  const voltar = () => {
    setDirecao("tras");
    setEtapa((e) => Math.max(0, e - 1));
  };

  const finalizar = () => {
    if (!local || !objetivo || !nivel) return;
    setErro(null);
    iniciar(async () => {
      const r = await concluirOnboarding({ nome, local_treino: local, dias_semana: dias, objetivo, nivel });
      if (r.ok) setConcluido(true);
      else setErro(r.erro);
    });
  };

  if (concluido) {
    return (
      <main className="moldura flex flex-col items-center justify-center px-6 py-10 text-center">
        <Image src="/img/celebracao.webp" alt="Troféu de comemoração" width={220} height={220} priority className="animate-pop" />
        <p className="rotulo mt-4 text-dourado">Dia 1 de 42 · Fase Ativação</p>
        <h1 className="titulo mt-2 text-[38px] leading-none">
          Seu protocolo <span className="text-limao">começa hoje</span>
        </h1>
        <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-suave">
          {nome.trim() ? `${nome.trim()}, s` : "S"}eus 42 dias estão montados: treinos, descanso ativo e cardápio, tudo no seu ritmo até o
          Réveillon.
        </p>
        <Link href="/hoje" className="botao-primario mt-8 w-full max-w-sm">
          Ver meu dia 1
        </Link>
      </main>
    );
  }

  const animacao = direcao === "frente" ? "animate-entrar" : "animate-entrar-rev";

  return (
    <main className="moldura flex flex-col px-5 pb-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-[url('/img/bg-quiz.webp')] bg-cover bg-[center_20%] opacity-15" />
      <div aria-hidden className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-gradient-to-b from-fundo/50 via-fundo/90 to-fundo" />

      <div className="relative z-10 flex items-center gap-3 pt-[max(16px,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={voltar}
          disabled={etapa === 0}
          aria-label="Voltar"
          className="-ml-2 grid size-11 place-items-center rounded-full text-suave disabled:invisible"
        >
          <ChevronLeft size={26} aria-hidden />
        </button>
        <BarraProgresso valor={(etapa + 1) / TOTAL_ETAPAS} rotulo={`Etapa ${etapa + 1} de ${TOTAL_ETAPAS}`} className="flex-1" />
        <span className="min-w-9 text-right text-xs font-bold text-suave" aria-hidden>
          {etapa + 1}/{TOTAL_ETAPAS}
        </span>
      </div>

      <div key={etapa} className={`relative z-10 flex flex-1 flex-col pt-8 ${animacao}`}>
        {etapa === 0 && (
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (nome.trim().length >= 2) avancar();
            }}
          >
            <h1 className="titulo text-center text-[32px]">
              Vamos montar o <span className="text-limao">seu protocolo</span>
            </h1>
            <p className="mt-2 text-center text-[15px] text-suave">São 4 perguntas rápidas. Primeiro: qual é o seu nome?</p>
            <label htmlFor="nome" className="sr-only">
              Seu nome
            </label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="given-name"
              maxLength={40}
              placeholder="Seu primeiro nome"
              className="mt-8 min-h-[58px] w-full rounded-app border-[1.5px] border-borda bg-card px-4 text-center text-lg font-semibold text-texto placeholder:text-suave/60 focus:border-limao focus:outline-none"
            />
            <div className="mt-auto pt-8">
              <button type="submit" disabled={nome.trim().length < 2} className="botao-primario w-full">
                Continuar
              </button>
            </div>
          </form>
        )}

        {etapa === 1 && (
          <div>
            <h1 className="titulo text-center text-[30px]">
              Onde você vai <span className="text-limao">treinar?</span>
            </h1>
            <p className="mt-2 text-center text-[15px] text-suave">Cada treino tem versão de academia e de casa.</p>
            <div role="radiogroup" aria-label="Local de treino" className="mt-6 flex flex-col gap-3">
              {LOCAIS.map((o) => (
                <button
                  key={o.valor}
                  type="button"
                  role="radio"
                  aria-checked={local === o.valor}
                  className="opcao"
                  onClick={() => {
                    setLocal(o.valor);
                    setTimeout(avancar, 260);
                  }}
                >
                  <Image src={o.img} alt="" width={58} height={58} className="size-[58px] shrink-0 rounded-[14px] object-cover" />
                  <span>
                    <span className="block text-base">{o.titulo}</span>
                    <span className="block text-sm font-normal text-suave">{o.texto}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="flex flex-1 flex-col">
            <h1 className="titulo text-center text-[30px]">
              Quantos dias por <span className="text-limao">semana?</span>
            </h1>
            <p className="mt-2 text-center text-[15px] text-suave">Escolha o que cabe na sua rotina. Dá para mudar depois.</p>
            <p className="titulo mt-8 text-center text-[88px] leading-none text-limao" aria-live="polite">
              {dias}
              <span className="ml-2 text-2xl text-texto">dias</span>
            </p>
            <label htmlFor="dias" className="sr-only">
              Dias de treino por semana
            </label>
            <input
              id="dias"
              type="range"
              min={2}
              max={6}
              step={1}
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="mt-6 h-11 w-full cursor-pointer accent-[#c6f432]"
              aria-valuetext={`${dias} dias por semana`}
            />
            <div className="mt-1 flex justify-between px-1 text-xs font-bold text-suave" aria-hidden>
              {[2, 3, 4, 5, 6].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
            <ul className="mt-6 grid grid-cols-7 gap-1.5" aria-label="Dias de treino na semana">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const treina = DIAS_TREINO[dias]!.includes(d);
                return (
                  <li
                    key={d}
                    className={`rounded-xl border py-2 text-center text-xs font-bold ${treina ? "border-limao bg-limao/15 text-limao" : "border-borda text-suave"}`}
                  >
                    {NOME_DIA_CURTO[d]}
                    <span className="sr-only">{treina ? ": treino" : ": descanso ativo"}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-center text-xs text-suave">Nos outros dias: descanso ativo de 5 minutos.</p>
            <div className="mt-auto pt-8">
              <button type="button" onClick={avancar} className="botao-primario w-full">
                Continuar
              </button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="flex flex-1 flex-col">
            <h1 className="titulo text-center text-[30px]">
              Seu <span className="text-limao">objetivo</span>
            </h1>
            <div role="radiogroup" aria-label="Objetivo" className="mt-5 grid grid-cols-2 gap-3">
              {OBJETIVOS.map((o) => (
                <button
                  key={o.valor}
                  type="button"
                  role="radio"
                  aria-checked={objetivo === o.valor}
                  onClick={() => setObjetivo(o.valor)}
                  className="opcao flex-col items-stretch gap-2 p-2.5 text-center"
                >
                  <Image src={o.img} alt="" width={160} height={160} className="aspect-square w-full rounded-[12px] object-cover" />
                  <span className="text-[15px]">{o.titulo}</span>
                </button>
              ))}
            </div>

            <h2 className="titulo mt-8 text-center text-[26px]">
              Seu <span className="text-limao">momento</span>
            </h2>
            <div role="radiogroup" aria-label="Nível" className="mt-4 flex flex-col gap-3">
              {NIVEIS.map((o) => (
                <button key={o.valor} type="button" role="radio" aria-checked={nivel === o.valor} onClick={() => setNivel(o.valor)} className="opcao">
                  <Image src={o.img} alt="" width={52} height={52} className="size-[52px] shrink-0 rounded-[12px] object-cover" />
                  <span>
                    <span className="block text-[15px]">{o.titulo}</span>
                    <span className="block text-[13px] font-normal text-suave">{o.texto}</span>
                  </span>
                </button>
              ))}
            </div>

            {erro && (
              <p role="alert" className="mt-4 rounded-app border border-rosa/40 bg-rosa/10 p-3 text-sm">
                {erro}
              </p>
            )}
            <div className="mt-auto pt-8">
              <button type="button" onClick={finalizar} disabled={!objetivo || !nivel || !local || salvando} className="botao-primario w-full">
                {salvando && <Loader2 className="animate-spin" size={20} aria-hidden />}
                {salvando ? "Montando seus 42 dias..." : "Gerar meu protocolo"}
              </button>
              {!local && (
                <p className="mt-2 text-center text-xs text-rosa">Volte e escolha onde vai treinar.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
