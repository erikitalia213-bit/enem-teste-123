import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TrechoNarracao, framesDoTrecho} from './componentes';
import {ALTURA, LIMITE_INFERIOR, cores, contorno, fonte} from './tema';

/*
 * Legendas animadas no estilo Reels: blocos curtos de palavras, com a palavra
 * falada no momento em dourado. O texto vem do campo `legenda` de cada trecho
 * da narração (deixe vazio para não legendar aquele trecho, ex.: o gancho que
 * já aparece escrito na tela).
 *
 * O tempo de cada palavra é estimado pelo tamanho dela dentro da frase.
 */

// Quanto "dura" falar números e símbolos (em letras faladas)
const PESOS_ESPECIAIS: Record<string, number> = {
  '3D': 6,
  '2026': 20,
  '2027': 20,
  '1.500': 15,
  '80': 7,
  '7': 4,
  '3': 4,
};

const limpar = (p: string) => p.replace(/[.,!?:;…"“”]/g, '');

const peso = (palavra: string) => {
  const p = limpar(palavra);
  if (p.startsWith('R$')) return 17; // "dezenove e noventa"
  if (PESOS_ESPECIAIS[p] !== undefined) return PESOS_ESPECIAIS[p] + 1.5;
  return p.length + 1.5;
};

type Palavra = {texto: string; inicio: number; fim: number};
type Bloco = {palavras: Palavra[]; inicio: number; fim: number};

const MAX_LETRAS = 26;

export const montarBlocos = (trechos: TrechoNarracao[], velocidade: number, fps: number): Bloco[] => {
  const blocos: Bloco[] = [];
  for (const t of trechos) {
    if (!t.legenda) continue;
    // "R$ 19,90" fica junto
    const palavras = t.legenda.replace(/R\$ /g, 'R$ ').split(' ').filter(Boolean); // só espaço normal: o \u00A0 mantém "R$ 19,90" junto
    const total = palavras.reduce((s, p) => s + peso(p), 0);
    const dur = framesDoTrecho(t, velocidade, fps);
    let cursor = t.emFrame;
    const comTempo: Palavra[] = palavras.map((p) => {
      const d = (peso(p) / total) * dur;
      const w = {texto: p, inicio: cursor, fim: cursor + d};
      cursor += d;
      return w;
    });
    // Agrupa em blocos curtos (quebra em pontuação ou por tamanho)
    let atual: Palavra[] = [];
    const fechar = () => {
      if (atual.length) {
        blocos.push({palavras: atual, inicio: atual[0].inicio, fim: atual[atual.length - 1].fim});
        atual = [];
      }
    };
    for (const w of comTempo) {
      const letras = atual.map((a) => a.texto).join(' ').length;
      if (atual.length && letras + w.texto.length + 1 > MAX_LETRAS) fechar();
      atual.push(w);
      if (/[,.!?:…]$/.test(w.texto) && atual.length >= 2) fechar();
    }
    fechar();
  }
  return blocos;
};

const BlocoLegenda: React.FC<{bloco: Bloco; ate: number}> = ({bloco, ate}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ini = Math.floor(bloco.inicio) - 2;
  if (frame < ini || frame >= ate) return null;
  const s = spring({frame: frame - ini, fps, config: {damping: 13, stiffness: 200, mass: 0.6}});
  const sai = interpolate(frame, [ate - 4, ate], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: ALTURA - LIMITE_INFERIOR + 8,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(interpolate(s, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}), sai),
        transform: `translateY(${(1 - s) * 22}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: '12px 30px 16px',
          borderRadius: 30,
          background: 'linear-gradient(180deg, rgba(43,27,80,0.82), rgba(30,20,51,0.82))',
          border: `3px solid rgba(182,156,255,0.75)`,
          boxShadow: '0 14px 36px rgba(10,4,26,0.55), 0 0 30px rgba(182,156,255,0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: 26,
          fontFamily: fonte,
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.15,
        }}
      >
        {bloco.palavras.map((w, i) => {
          const ativa = frame >= w.inicio && frame < w.fim + 1;
          const falada = frame >= w.inicio;
          const pop = spring({frame: frame - w.inicio, fps, config: {damping: 9, stiffness: 260, mass: 0.5}});
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: ativa ? cores.dourado : cores.branco,
                opacity: falada ? 1 : 0.6,
                transform: ativa ? `scale(${interpolate(pop, [0, 1], [1, 1.12])}) translateY(-3px)` : 'none',
                textShadow: `${contorno(4, ativa ? cores.roxoProfundo : cores.roxo)}, 0 6px 14px rgba(10,4,26,0.6)`,
              }}
            >
              {w.texto}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Coloque por cima de tudo no vídeo. Só aparece se houver narração. */
export const Legendas: React.FC<{trechos: TrechoNarracao[]; velocidade: number; ativa: boolean}> = ({
  trechos,
  velocidade,
  ativa,
}) => {
  const {fps} = useVideoConfig();
  if (!ativa) return null;
  const blocos = montarBlocos(trechos, velocidade, fps);
  return (
    <>
      {blocos.map((b, i) => {
        const proximo = blocos[i + 1];
        // segura o bloco até o próximo (se a pausa for curta)
        const fimNatural = b.fim + 10;
        const ate = proximo && proximo.inicio - 2 - b.fim < 14 ? Math.floor(proximo.inicio) - 2 : Math.ceil(fimNatural);
        return <BlocoLegenda key={i} bloco={b} ate={ate} />;
      })}
    </>
  );
};
