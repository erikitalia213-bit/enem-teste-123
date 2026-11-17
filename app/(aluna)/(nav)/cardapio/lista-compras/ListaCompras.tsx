"use client";

import { Check, Copy, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { chaveStorageLista, type SecaoLista } from "@/lib/listaCompras";

function lerMarcados(semana: number): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(chaveStorageLista(semana)) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function ListaCompras({ listas, semanaInicial }: { listas: Record<number, SecaoLista[]>; semanaInicial: number }) {
  const [semana, setSemana] = useState(semanaInicial);
  const [marcados, setMarcados] = useState<Set<string>>(new Set());
  const [aviso, setAviso] = useState<string | null>(null);
  const [podeCompartilhar, setPodeCompartilhar] = useState(false);
  const secoes = listas[semana] ?? [];
  const total = secoes.reduce((t, s) => t + s.itens.length, 0);
  const feitos = secoes.reduce((t, s) => t + s.itens.filter((i) => marcados.has(i.chave)).length, 0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage só existe no navegador
    setMarcados(lerMarcados(semana));
  }, [semana]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- recurso só detectável no navegador
    setPodeCompartilhar(typeof navigator.share === "function");
  }, []);

  const salvar = (novo: Set<string>) => {
    setMarcados(novo);
    try {
      localStorage.setItem(chaveStorageLista(semana), JSON.stringify([...novo]));
    } catch {
      // armazenamento indisponível: a marcação vale só nesta tela
    }
  };

  const alternar = (chave: string) => {
    const novo = new Set(marcados);
    if (novo.has(chave)) novo.delete(chave);
    else novo.add(chave);
    salvar(novo);
  };

  const texto = () =>
    [`🛒 Lista de compras · Semana ${semana} · Protocolo 42 Dias`, ""]
      .concat(secoes.flatMap((s) => [`*${s.secao}*`, ...s.itens.filter((i) => !marcados.has(i.chave)).map((i) => `- ${i.nome}: ${i.quantidade}`), ""]))
      .join("\n");

  const compartilhar = async () => {
    const t = texto();
    try {
      if (navigator.share) {
        await navigator.share({ title: `Lista de compras · Semana ${semana}`, text: t });
        return;
      }
      await navigator.clipboard.writeText(t);
      setAviso("Lista copiada! Cole no WhatsApp ou nas notas.");
    } catch {
      setAviso("Não foi possível compartilhar agora.");
    }
    setTimeout(() => setAviso(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 px-5">
      <div role="radiogroup" aria-label="Semana do protocolo" className="grid grid-cols-6 gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === semana}
            aria-label={`Semana ${s}`}
            onClick={() => setSemana(s)}
            className={`min-h-11 rounded-xl border-[1.5px] text-sm font-bold ${s === semana ? "border-limao bg-limao text-fundo" : "border-borda text-suave"}`}
          >
            S{s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <p className="flex-1 text-sm text-suave" aria-live="polite">
          {feitos} de {total} itens no carrinho
        </p>
        <button type="button" onClick={() => salvar(new Set())} className="botao-secundario min-h-11 px-3 text-sm" aria-label="Desmarcar todos os itens">
          <RotateCcw size={16} aria-hidden /> Limpar
        </button>
        <button type="button" onClick={compartilhar} className="botao-secundario min-h-11 px-3 text-sm" aria-label="Compartilhar ou copiar a lista">
          {podeCompartilhar ? <Share2 size={16} aria-hidden /> : <Copy size={16} aria-hidden />} {podeCompartilhar ? "Enviar" : "Copiar"}
        </button>
      </div>
      {aviso && (
        <p role="status" className="rounded-app border border-limao/40 bg-limao/10 p-2.5 text-sm">
          {aviso}
        </p>
      )}

      {secoes.map((s) => (
        <section key={s.secao} aria-labelledby={`secao-${s.secao}`}>
          <h2 id={`secao-${s.secao}`} className="rotulo mb-2 text-limao">
            {s.secao}
          </h2>
          <ul className="cartao divide-y divide-borda overflow-hidden">
            {s.itens.map((i) => {
              const ok = marcados.has(i.chave);
              return (
                <li key={i.chave}>
                  <button type="button" role="checkbox" aria-checked={ok} onClick={() => alternar(i.chave)} className="flex min-h-[56px] w-full items-center gap-3 px-3.5 py-2.5 text-left">
                    <span className={`grid size-6 shrink-0 place-items-center rounded-md border-2 ${ok ? "border-limao bg-limao text-fundo" : "border-borda"}`}>
                      {ok && <Check size={15} strokeWidth={3} aria-hidden />}
                    </span>
                    <span className="flex-1">
                      <span className={`block text-[15px] font-medium ${ok ? "text-suave line-through" : ""}`}>{i.nome}</span>
                      {i.dica && !ok && <span className="block text-[11px] text-suave">{i.dica}</span>}
                    </span>
                    <span className={`shrink-0 text-right text-sm font-semibold ${ok ? "text-suave" : "text-texto"}`}>{i.quantidade}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
