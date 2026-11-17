"use client";

import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Loader2,
  Pause,
  Play,
  Plus,
  SkipForward,
  Sparkles,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { VersaoTreino } from "@/content/tipos";
import { AvisoTreino } from "@/components/ui/AvisoTreino";
import { BarraProgresso } from "@/components/ui/BarraProgresso";
import { ImagemExercicio } from "@/components/ui/ImagemExercicio";
import { concluirTreinoDoDia } from "@/lib/acoes/aluna";
import { soltarConfete } from "@/lib/confete";
import { formatarDuracaoCurta, formatarReps, formatarTempo } from "@/lib/formatar";
import type { ItemGuiado, SessaoGuiada } from "@/lib/sessaoGuiada";

type Etapa = "intro" | number | "fim";

interface Cronometro {
  tipo: "descanso" | "execucao";
  /** Momento (ms) em que termina. Baseado em relógio para não atrasar com a tela em segundo plano. */
  terminaEm: number;
  total: number;
  pausadoRestante?: number;
}

interface Salvo {
  versao: VersaoTreino | "descanso";
  etapa: Etapa;
  series: Record<number, number>;
  inicio: number;
}

/** Relógio usado nos handlers de toque (fora da renderização). */
const relogio = () => Date.now();

const chaveSalvo = (dia: number) => `p42:treino:dia-${dia}`;
const chaveLocalHoje = "p42:ultimo-local";

// ---------------------------------------------------------------------------
// Som e vibração ao fim do descanso
// ---------------------------------------------------------------------------
let audioCtx: AudioContext | null = null;
function prepararAudio() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx && !audioCtx) audioCtx = new Ctx();
    if (audioCtx?.state === "suspended") void audioCtx.resume();
  } catch {
    audioCtx = null;
  }
}
function bipe() {
  try {
    if (!audioCtx) return;
    const agora = audioCtx.currentTime;
    [0, 0.22].forEach((atraso) => {
      const osc = audioCtx!.createOscillator();
      const ganho = audioCtx!.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      ganho.gain.setValueAtTime(0.0001, agora + atraso);
      ganho.gain.exponentialRampToValueAtTime(0.35, agora + atraso + 0.02);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + atraso + 0.16);
      osc.connect(ganho).connect(audioCtx!.destination);
      osc.start(agora + atraso);
      osc.stop(agora + atraso + 0.18);
    });
  } catch {
    // sem áudio: segue só com a vibração
  }
}
function vibrar() {
  try {
    navigator.vibrate?.([220, 100, 220]);
  } catch {
    // aparelho sem vibração
  }
}

// ---------------------------------------------------------------------------
export function TreinoGuiado({
  dia,
  rotuloFase,
  versoes,
  descanso,
  concluidoAntes,
  dicaObjetivo,
}: {
  dia: number;
  rotuloFase: string;
  versoes: Partial<Record<VersaoTreino, SessaoGuiada>>;
  descanso: SessaoGuiada | null;
  concluidoAntes: boolean;
  dicaObjetivo: string;
}) {
  const router = useRouter();
  const opcoes = Object.keys(versoes) as VersaoTreino[];
  const escolheLocal = opcoes.length > 1;
  const [versao, setVersao] = useState<VersaoTreino | "descanso">(descanso ? "descanso" : opcoes[0]!);
  const sessao = (versao === "descanso" ? descanso : versoes[versao])!;

  const [etapa, setEtapa] = useState<Etapa>("intro");
  const [series, setSeries] = useState<Record<number, number>>({});
  const [inicio, setInicio] = useState<number>(0);
  const [crono, setCrono] = useState<Cronometro | null>(null);
  const [agora, setAgora] = useState(0);
  const [salvando, iniciarSalvar] = useTransition();
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const [registrado, setRegistrado] = useState(false);
  const [minutosTotais, setMinutosTotais] = useState(1);
  const carregou = useRef(false);

  // Recupera um treino em andamento (ex.: a tela recarregou) e o último local escolhido.
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(chaveSalvo(dia)) ?? "null") as Salvo | null;
      /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe no navegador */
      if (salvo && (salvo.versao === "descanso" ? descanso : versoes[salvo.versao as VersaoTreino]) && salvo.etapa !== "fim") {
        setVersao(salvo.versao);
        setEtapa(salvo.etapa);
        setSeries(salvo.series ?? {});
        setInicio(salvo.inicio ?? Date.now());
      } else if (escolheLocal) {
        const ultimo = localStorage.getItem(chaveLocalHoje) as VersaoTreino | null;
        if (ultimo && versoes[ultimo]) setVersao(ultimo);
      }
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // sem localStorage: começa do zero
    }
    carregou.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda uma vez ao abrir
  }, []);

  useEffect(() => {
    if (!carregou.current) return;
    try {
      if (etapa === "fim") localStorage.removeItem(chaveSalvo(dia));
      else if (etapa !== "intro") localStorage.setItem(chaveSalvo(dia), JSON.stringify({ versao, etapa, series, inicio } satisfies Salvo));
    } catch {
      // armazenamento cheio/bloqueado: o treino continua normalmente
    }
  }, [dia, versao, etapa, series, inicio]);

  // Mantém a tela acesa durante o treino (quando o navegador permite).
  useEffect(() => {
    if (typeof etapa !== "number" || !("wakeLock" in navigator)) return;
    let trava: WakeLockSentinel | null = null;
    navigator.wakeLock.request("screen").then((t) => (trava = t)).catch(() => undefined);
    return () => void trava?.release().catch(() => undefined);
  }, [etapa]);

  // Relógio do cronômetro
  useEffect(() => {
    if (!crono || crono.pausadoRestante !== undefined) return;
    const id = setInterval(() => setAgora(Date.now()), 250);
    return () => clearInterval(id);
  }, [crono]);

  const restante = crono ? (crono.pausadoRestante ?? Math.max(0, Math.ceil((crono.terminaEm - agora) / 1000))) : 0;

  /** Marca a série seguinte e, se ainda houver séries, dispara o descanso automático. */
  const concluirSerie = useCallback((idx: number, item: ItemGuiado, feitasAntes: number) => {
    const feitas = Math.min(item.series, feitasAntes + 1);
    setSeries((s) => ({ ...s, [idx]: feitas }));
    if (feitas < item.series && item.descansoSeg > 0) {
      const inicioDescanso = Date.now();
      setCrono({ tipo: "descanso", terminaEm: inicioDescanso + item.descansoSeg * 1000, total: item.descansoSeg });
      setAgora(inicioDescanso);
    } else {
      setCrono(null);
    }
  }, []);

  // Fim do cronômetro: bipe + vibração; série cronometrada é marcada sozinha.
  useEffect(() => {
    if (!crono || crono.pausadoRestante !== undefined || restante > 0 || agora === 0) return;
    bipe();
    vibrar();
    const finalizado = crono;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reação ao tempo esgotado
    setCrono(null);
    if (finalizado.tipo === "execucao" && typeof etapa === "number") concluirSerie(etapa, sessao.itens[etapa]!, series[etapa] ?? 0);
  }, [restante, crono, agora, etapa, sessao.itens, series, concluirSerie]);

  const totalSeries = useMemo(() => sessao.itens.reduce((t, i) => t + i.series, 0), [sessao.itens]);
  const seriesFeitas = Object.values(series).reduce((a, b) => a + b, 0);

  const comecar = () => {
    prepararAudio();
    if (versao !== "descanso") {
      try {
        localStorage.setItem(chaveLocalHoje, versao);
      } catch {
        /* sem armazenamento */
      }
    }
    setInicio(Date.now());
    setEtapa(0);
    window.scrollTo({ top: 0 });
  };

  const irPara = (proxima: Etapa) => {
    setCrono(null);
    setEtapa(proxima);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finalizar = () => {
    setMinutosTotais(Math.max(1, Math.round((relogio() - (inicio || relogio())) / 60000)));
    setCrono(null);
    setEtapa("fim");
    window.scrollTo({ top: 0 });
    void soltarConfete(true);
    registrar();
  };

  const registrar = () => {
    setErroSalvar(null);
    iniciarSalvar(async () => {
      const r = await concluirTreinoDoDia(dia, sessao.id);
      if (r.ok) {
        setRegistrado(true);
        router.refresh();
      } else setErroSalvar(r.erro);
    });
  };

  const sair = () => {
    if (typeof etapa === "number" && seriesFeitas > 0 && !window.confirm("Sair do treino? Seu progresso fica salvo neste aparelho.")) return;
    router.push("/hoje");
  };

  // -------------------------------------------------------------------------
  // Tela inicial
  // -------------------------------------------------------------------------
  if (etapa === "intro") {
    return (
      <main className="moldura flex flex-col px-5 pb-10">
        <div className="flex items-center justify-between pt-[max(16px,env(safe-area-inset-top))]">
          <Link href="/hoje" aria-label="Voltar para Hoje" className="-ml-2 grid size-11 place-items-center rounded-full text-suave">
            <ChevronLeft size={26} aria-hidden />
          </Link>
          <p className="rotulo text-dourado">
            Dia {dia} · {rotuloFase}
          </p>
          <span className="size-11" />
        </div>

        <h1 className="titulo mt-4 text-[38px] leading-none">{versao === "descanso" ? sessao.titulo : sessao.titulo.split(" · ")[0]}</h1>
        <p className="mt-2 text-[15px] text-texto/90">{sessao.foco}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-suave">
          <Timer size={16} aria-hidden /> ~{sessao.duracaoMin} min · {sessao.itens.length} exercícios · {totalSeries} séries
        </p>
        {concluidoAntes && (
          <p className="mt-3 flex items-center gap-2 rounded-app border border-limao/40 bg-limao/10 p-3 text-sm">
            <Check size={18} className="text-limao" aria-hidden /> Você já concluiu este dia. Pode refazer à vontade.
          </p>
        )}

        {escolheLocal && (
          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold">Hoje vou treinar em:</legend>
            <div role="radiogroup" className="grid grid-cols-2 gap-2 rounded-app border border-borda bg-card p-1.5">
              {opcoes.map((o) => (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={versao === o}
                  onClick={() => setVersao(o)}
                  className={`min-h-12 rounded-[12px] text-[15px] font-bold transition ${versao === o ? "bg-limao text-fundo" : "text-suave"}`}
                >
                  {o === "academia" ? "Academia" : "Casa"}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {sessao.aquecimento.length > 0 && (
          <section className="cartao mt-5 p-4">
            <h2 className="rotulo text-limao">Aquecimento</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-texto/90">
              {sessao.aquecimento.map((a) => (
                <li key={a} className="flex gap-2">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-limao" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-5">
          <h2 className="rotulo mb-2 text-suave">Exercícios de hoje</h2>
          <ol className="flex flex-col gap-2">
            {sessao.itens.map((it, i) => (
              <li key={`${it.exercicio}-${i}`} className="cartao flex items-center gap-3 p-3">
                <span className="titulo grid size-9 shrink-0 place-items-center rounded-xl bg-card-2 text-limao">{i + 1}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold leading-snug">{it.nome}</span>
                  <span className="text-xs text-suave">
                    {it.series}× {it.reps ? formatarReps(it.reps) : formatarDuracaoCurta(it.tempoSeg ?? 0)} · descanso {formatarDuracaoCurta(it.descansoSeg)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {versao !== "descanso" && <p className="mt-5 rounded-app border border-borda bg-card-2 p-3 text-[13px] leading-relaxed text-suave">💡 {dicaObjetivo}</p>}

        <button type="button" onClick={comecar} className="botao-primario mt-6 w-full text-[17px]">
          <Play size={20} fill="currentColor" aria-hidden /> {versao === "descanso" ? "Começar rotina" : "Começar treino"}
        </button>
        <AvisoTreino className="mt-6" />
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Fim do treino
  // -------------------------------------------------------------------------
  if (etapa === "fim") {
    return (
      <main className="moldura flex flex-col items-center px-6 pb-10 pt-[max(32px,env(safe-area-inset-top))] text-center">
        <Image src="/img/celebracao.webp" alt="Troféu" width={200} height={200} priority className="animate-pop" />
        <p className="rotulo mt-2 text-dourado">Dia {dia} concluído</p>
        <h1 className="titulo mt-2 text-[40px] leading-none">
          Mandou <span className="text-limao">muito bem!</span>
        </h1>
        <dl className="mt-6 grid w-full grid-cols-3 gap-2">
          {[
            ["Exercícios", String(sessao.itens.length)],
            ["Séries", `${seriesFeitas}/${totalSeries}`],
            ["Minutos", String(minutosTotais)],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="cartao px-2 py-3">
              <dd className="titulo text-[28px] leading-none text-limao">{valor}</dd>
              <dt className="mt-1 text-xs text-suave">{rotulo}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-4 min-h-6 text-sm" aria-live="polite">
          {salvando && (
            <span className="flex items-center justify-center gap-2 text-suave">
              <Loader2 size={16} className="animate-spin" aria-hidden /> Salvando na sua jornada...
            </span>
          )}
          {registrado && <span className="text-limao">✓ Salvo na sua jornada</span>}
          {erroSalvar && (
            <span className="text-rosa">
              {erroSalvar}{" "}
              <button type="button" onClick={registrar} className="font-bold underline min-h-11">
                Tentar de novo
              </button>
            </span>
          )}
        </div>
        <Link href="/hoje" className="botao-primario mt-6 w-full">
          Voltar para Hoje
        </Link>
        <Link href="/jornada" className="botao-secundario mt-3 w-full">
          Ver minha jornada
        </Link>
        <AvisoTreino className="mt-8" />
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Exercício atual
  // -------------------------------------------------------------------------
  const idx = etapa;
  const item = sessao.itens[idx]!;
  const feitas = series[idx] ?? 0;
  const ultimo = idx === sessao.itens.length - 1;
  const proximaSerie = feitas < item.series ? feitas + 1 : null;

  const tocarSerie = (n: number) => {
    prepararAudio();
    if (n !== feitas + 1) {
      // Toque numa série já feita desmarca a partir dela.
      if (n <= feitas) {
        setSeries((s) => ({ ...s, [idx]: n - 1 }));
        setCrono(null);
      }
      return;
    }
    if (item.tempoSeg) {
      const t0 = relogio();
      setCrono({ tipo: "execucao", terminaEm: t0 + item.tempoSeg * 1000, total: item.tempoSeg });
      setAgora(t0);
    } else {
      concluirSerie(idx, item, feitas);
    }
  };

  return (
    <main className="moldura flex flex-col pb-[calc(170px+env(safe-area-inset-bottom,0px))]">
      <div className="sticky top-0 z-20 bg-fundo/95 px-5 pb-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center gap-3">
          <button type="button" onClick={sair} aria-label="Sair do treino" className="-ml-2 grid size-11 place-items-center rounded-full text-suave">
            <X size={24} aria-hidden />
          </button>
          <BarraProgresso valor={(idx + (feitas >= item.series ? 1 : 0)) / sessao.itens.length} rotulo="Progresso do treino" className="flex-1" />
          <span className="min-w-11 text-right text-xs font-bold text-suave">
            {idx + 1}/{sessao.itens.length}
          </span>
        </div>
      </div>

      <div key={idx} className="animate-entrar flex flex-col gap-4 px-5">
        <ImagemExercicio slug={item.exercicio} nome={item.nome} temImagem={item.temImagem} prioridade />

        <div>
          <h1 className="titulo text-[28px] leading-tight">{item.nome}</h1>
          <p className="mt-0.5 text-xs text-suave">{item.equipamento}</p>
        </div>

        <ul className="flex flex-wrap gap-2 text-[13px] font-bold" aria-label="Prescrição">
          <li className="rounded-full bg-limao px-3 py-1.5 text-fundo">{item.series} séries</li>
          <li className="rounded-full bg-limao/15 px-3 py-1.5 text-limao">{item.reps ? formatarReps(item.reps) : `${formatarDuracaoCurta(item.tempoSeg ?? 0)} por série`}</li>
          <li className="rounded-full border border-borda px-3 py-1.5 text-suave">Descanso {formatarDuracaoCurta(item.descansoSeg)}</li>
        </ul>
        <p className="-mt-1 text-[13px] text-suave">
          <b className="text-texto">Cadência:</b> {item.cadencia}
        </p>

        {item.tecnica && (
          <p className="flex gap-2 rounded-app border border-dourado/40 bg-dourado/10 p-3 text-sm leading-relaxed">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-dourado" aria-hidden />
            <span>
              <b className="text-dourado">Técnica avançada:</b> {item.tecnica}
            </span>
          </p>
        )}

        <section aria-label="Séries" className="cartao p-4">
          <p className="text-sm font-semibold">
            {feitas >= item.series ? "Todas as séries feitas! ✅" : item.tempoSeg ? "Toque na série para iniciar o cronômetro" : "Toque em cada série ao terminar"}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {Array.from({ length: item.series }, (_, k) => k + 1).map((n) => {
              const feita = n <= feitas;
              const proxima = n === proximaSerie;
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => tocarSerie(n)}
                    aria-pressed={feita}
                    aria-label={`Série ${n}${feita ? ", feita (toque para desmarcar)" : proxima ? ", próxima" : ""}`}
                    className={`titulo grid size-14 place-items-center rounded-2xl border-2 text-xl transition ${
                      feita ? "animate-pop border-limao bg-limao text-fundo" : proxima ? "border-limao text-limao" : "border-borda text-suave"
                    }`}
                  >
                    {feita ? <Check size={24} strokeWidth={3} aria-hidden /> : n}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="titulo-passos">
          <h2 id="titulo-passos" className="rotulo mb-2 text-limao">
            Como fazer
          </h2>
          <ol className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
            {item.passos.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="titulo grid size-7 shrink-0 place-items-center rounded-full bg-limao/15 text-sm text-limao">{i + 1}</span>
                <span className="pt-0.5">{p}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-2.5">
          <p className="flex gap-2.5 rounded-app border border-limao/30 bg-limao/[0.07] p-3 text-sm leading-relaxed">
            <Crosshair size={18} className="mt-0.5 shrink-0 text-limao" aria-hidden />
            <span>
              <b className="text-limao">Onde sentir:</b> {item.ondeSentir}
            </span>
          </p>
          <p className="flex gap-2.5 rounded-app border border-rosa/40 bg-rosa/10 p-3 text-sm leading-relaxed">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rosa" aria-hidden />
            <span>
              <b className="text-rosa">Erro comum:</b> {item.erroComum}
            </span>
          </p>
          <p className="flex gap-2.5 rounded-app border border-dourado/30 bg-dourado/[0.07] p-3 text-sm leading-relaxed">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-dourado" aria-hidden />
            <span>
              <b className="text-dourado">Dica de ouro:</b> {item.dicaDeOuro}
            </span>
          </p>
          <p className="flex gap-2.5 rounded-app border border-borda bg-card p-3 text-[13px] leading-relaxed text-suave">
            <TrendingUp size={18} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              <b className="text-texto">Progressão:</b> {item.progressao}
            </span>
          </p>
        </div>

        <AvisoTreino className="mt-2" />
      </div>

      {/* Rodapé fixo: cronômetro + navegação */}
      <div className="fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-[480px] border-t border-borda bg-fundo/95 px-4 pt-3 backdrop-blur-md area-segura-baixo">
          {crono && (
            <div className="animate-subir mb-3 rounded-app border border-limao/40 bg-card p-3" role="timer" aria-live="off">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="rotulo text-[10px] text-limao">{crono.tipo === "descanso" ? "Descanso" : "Série em andamento"}</p>
                  <p className="titulo text-[40px] leading-none tabular-nums" aria-label={`${restante} segundos restantes`}>
                    {formatarTempo(restante)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={crono.pausadoRestante !== undefined ? "Continuar cronômetro" : "Pausar cronômetro"}
                  onClick={() =>
                    setCrono((c) =>
                      c
                        ? c.pausadoRestante !== undefined
                          ? { ...c, terminaEm: Date.now() + c.pausadoRestante * 1000, pausadoRestante: undefined }
                          : { ...c, pausadoRestante: restante }
                        : c,
                    )
                  }
                  className="grid size-12 place-items-center rounded-full border border-borda text-texto"
                >
                  {crono.pausadoRestante !== undefined ? <Play size={20} aria-hidden /> : <Pause size={20} aria-hidden />}
                </button>
                {crono.tipo === "descanso" && (
                  <button
                    type="button"
                    aria-label="Mais 15 segundos"
                    onClick={() => setCrono((c) => (c ? { ...c, terminaEm: c.terminaEm + 15000, total: c.total + 15, pausadoRestante: c.pausadoRestante !== undefined ? c.pausadoRestante + 15 : undefined } : c))}
                    className="grid size-12 place-items-center rounded-full border border-borda text-sm font-bold"
                  >
                    <Plus size={14} aria-hidden />
                    15
                  </button>
                )}
                <button
                  type="button"
                  aria-label={crono.tipo === "descanso" ? "Pular descanso" : "Concluir série agora"}
                  onClick={() => {
                    const c = crono;
                    setCrono(null);
                    if (c.tipo === "execucao") concluirSerie(idx, item, feitas);
                  }}
                  className="grid size-12 place-items-center rounded-full bg-limao text-fundo"
                >
                  <SkipForward size={20} aria-hidden />
                </button>
              </div>
              <BarraProgresso valor={crono.total ? restante / crono.total : 0} rotulo="Tempo restante" className="mt-2" />
            </div>
          )}
          <div className="flex gap-3 pb-2">
            <button type="button" onClick={() => irPara(idx === 0 ? "intro" : idx - 1)} className="botao-secundario flex-1">
              <ChevronLeft size={20} aria-hidden /> Anterior
            </button>
            {ultimo ? (
              <button type="button" onClick={finalizar} className="botao-primario flex-[1.4]">
                Concluir treino <Check size={20} aria-hidden />
              </button>
            ) : (
              <button type="button" onClick={() => irPara(idx + 1)} className="botao-primario flex-[1.4]">
                Próximo <ChevronRight size={20} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
