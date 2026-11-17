"use client";

import { Loader2, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { LocalTreino, Nivel, Objetivo } from "@/content/tipos";
import { reiniciarProtocolo, salvarDados, salvarRotina, type ResultadoAcao } from "@/lib/acoes/aluna";
import { NOME_DIA_CURTO } from "@/lib/datas";
import { DIAS_TREINO } from "@/lib/protocolo/calendario";

const OBJETIVOS: Record<Objetivo, string> = { volume: "Mais volume", empinado: "Mais empinado", firme: "Firme e definido", flacidez: "Menos flacidez" };
const NIVEIS: Record<Nivel, string> = { iniciante: "Estou começando", intermediario: "Treino há menos de 1 ano", estagnada: "Treino há mais de 1 ano e travei" };
const LOCAIS: Record<LocalTreino, string> = { academia: "Academia", casa: "Casa", ambos: "Os dois" };

const campo = "min-h-12 w-full rounded-app border-[1.5px] border-borda bg-fundo px-3.5 text-[15px] text-texto focus:border-limao focus:outline-none";

function Retorno({ r }: { r: ResultadoAcao | null }) {
  if (!r) return null;
  return (
    <p role="status" className={`text-sm ${r.ok ? "text-limao" : "text-rosa"}`}>
      {r.ok ? "✓ Salvo!" : r.erro}
    </p>
  );
}

export function FormDados({ nome, objetivo, nivel }: { nome: string; objetivo: Objetivo; nivel: Nivel }) {
  const [valores, setValores] = useState({ nome, objetivo, nivel });
  const [r, setR] = useState<ResultadoAcao | null>(null);
  const [salvando, iniciar] = useTransition();
  const mudou = valores.nome !== nome || valores.objetivo !== objetivo || valores.nivel !== nivel;

  return (
    <form
      className="cartao flex flex-col gap-3 p-4"
      aria-labelledby="titulo-dados"
      onSubmit={(e) => {
        e.preventDefault();
        iniciar(async () => setR(await salvarDados(valores)));
      }}
    >
      <h2 id="titulo-dados" className="font-bold">
        Seus dados
      </h2>
      <label className="text-sm">
        <span className="mb-1 block text-suave">Nome</span>
        <input className={campo} value={valores.nome} maxLength={40} onChange={(e) => setValores({ ...valores, nome: e.target.value })} autoComplete="given-name" />
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-suave">Objetivo</span>
        <select className={campo} value={valores.objetivo} onChange={(e) => setValores({ ...valores, objetivo: e.target.value as Objetivo })}>
          {Object.entries(OBJETIVOS).map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block text-suave">Momento</span>
        <select className={campo} value={valores.nivel} onChange={(e) => setValores({ ...valores, nivel: e.target.value as Nivel })}>
          {Object.entries(NIVEIS).map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!mudou || salvando} className="botao-secundario">
        {salvando ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Save size={18} aria-hidden />} Salvar dados
      </button>
      <Retorno r={r} />
    </form>
  );
}

export function FormRotina({ local, dias, diaAtual }: { local: LocalTreino; dias: number; diaAtual: number }) {
  const router = useRouter();
  const [novoLocal, setNovoLocal] = useState(local);
  const [novosDias, setNovosDias] = useState(dias);
  const [r, setR] = useState<ResultadoAcao | null>(null);
  const [salvando, iniciar] = useTransition();
  const mudou = novoLocal !== local || novosDias !== dias;

  return (
    <form
      className="cartao flex flex-col gap-3 p-4"
      aria-labelledby="titulo-rotina"
      onSubmit={(e) => {
        e.preventDefault();
        iniciar(async () => {
          const res = await salvarRotina({ local_treino: novoLocal, dias_semana: novosDias });
          setR(res);
          if (res.ok) router.refresh();
        });
      }}
    >
      <h2 id="titulo-rotina" className="font-bold">
        Sua rotina de treino
      </h2>
      <fieldset>
        <legend className="mb-1 text-sm text-suave">Onde você treina</legend>
        <div role="radiogroup" className="grid grid-cols-3 gap-1.5 rounded-app border border-borda bg-fundo p-1.5">
          {(Object.keys(LOCAIS) as LocalTreino[]).map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={novoLocal === l}
              onClick={() => setNovoLocal(l)}
              className={`min-h-11 rounded-[12px] text-sm font-bold ${novoLocal === l ? "bg-limao text-fundo" : "text-suave"}`}
            >
              {LOCAIS[l]}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="text-sm">
        <span className="mb-1 flex justify-between text-suave">
          Dias por semana <b className="text-limao">{novosDias} dias</b>
        </span>
        <input
          type="range"
          min={2}
          max={6}
          value={novosDias}
          onChange={(e) => setNovosDias(Number(e.target.value))}
          className="h-11 w-full accent-[#c6f432]"
          aria-valuetext={`${novosDias} dias por semana`}
        />
      </label>
      <ul className="grid grid-cols-7 gap-1" aria-label="Dias de treino">
        {[1, 2, 3, 4, 5, 6, 0].map((d) => {
          const treina = DIAS_TREINO[novosDias]!.includes(d);
          return (
            <li key={d} className={`rounded-lg border py-1.5 text-center text-[11px] font-bold ${treina ? "border-limao bg-limao/15 text-limao" : "border-borda text-suave"}`}>
              {NOME_DIA_CURTO[d]}
            </li>
          );
        })}
      </ul>
      <p className="text-xs leading-relaxed text-suave">
        A mudança vale a partir de hoje (dia {diaAtual}). O calendário é refeito daqui para frente e tudo o que você já fez continua salvo.
      </p>
      <button type="submit" disabled={!mudou || salvando} className="botao-secundario">
        {salvando ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Save size={18} aria-hidden />} Salvar rotina
      </button>
      <Retorno r={r} />
    </form>
  );
}

export function ReiniciarProtocolo() {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [r, setR] = useState<ResultadoAcao | null>(null);
  const [salvando, iniciar] = useTransition();

  return (
    <section className="cartao border-rosa/30 p-4" aria-labelledby="titulo-reiniciar">
      <h2 id="titulo-reiniciar" className="font-bold">
        Reiniciar protocolo
      </h2>
      <p className="mt-1 text-sm text-suave">Começa de novo no dia 1, hoje. Os treinos marcados são apagados; as refeições marcadas continuam.</p>
      {!confirmando ? (
        <button type="button" onClick={() => setConfirmando(true)} className="botao-secundario mt-3 w-full border-rosa/40 text-rosa">
          <RotateCcw size={18} aria-hidden /> Reiniciar do dia 1
        </button>
      ) : (
        <div className="mt-3 flex flex-col gap-2" role="alertdialog" aria-labelledby="confirma-reinicio">
          <p id="confirma-reinicio" className="text-sm font-semibold text-rosa">
            Tem certeza? Essa ação não pode ser desfeita.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirmando(false)} className="botao-secundario flex-1">
              Cancelar
            </button>
            <button
              type="button"
              disabled={salvando}
              onClick={() =>
                iniciar(async () => {
                  const res = await reiniciarProtocolo();
                  setR(res);
                  if (res.ok) router.push("/hoje");
                })
              }
              className="botao-primario flex-1 bg-none bg-rosa text-fundo"
            >
              {salvando ? <Loader2 size={18} className="animate-spin" aria-hidden /> : null} Sim, reiniciar
            </button>
          </div>
        </div>
      )}
      <Retorno r={r} />
    </section>
  );
}
