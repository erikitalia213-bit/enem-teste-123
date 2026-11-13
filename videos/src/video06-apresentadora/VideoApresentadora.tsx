import React from 'react';
import {useAudioData, visualizeAudio} from '@remotion/media-utils';
import {AbsoluteFill, Html5Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CTA, Flutuar, Fundo, Imagem, Preco, PropsVideo, TextoGancho, TrechoNarracao, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas, limpar, peso} from '../compartilhado/legendas';
import {FPS, cores, estiloTexto} from '../compartilhado/tema';
import {CTA_TEXTO, PRECO, Roteiro} from './roteiros';

/* ---------------- tempo das palavras ---------------- */

type PalavraTempo = {texto: string; ini: number; fim: number}; // segundos no MP3

const intervalosFala = (r: Roteiro): [number, number][] => {
  const res: [number, number][] = [];
  let cursor = 0;
  for (const [a, b] of r.silencios) {
    if (a > cursor + 0.05) res.push([cursor, a]);
    cursor = b;
  }
  if (r.duracaoAudio > cursor + 0.05) res.push([cursor, r.duracaoAudio]);
  return res;
};

/** Espalha as palavras do texto pelos trechos com voz, pelo tamanho de cada palavra. */
const palavrasComTempo = (r: Roteiro): PalavraTempo[] => {
  const falas = intervalosFala(r);
  const total = falas.reduce((s, [a, b]) => s + (b - a), 0);
  const palavras = r.texto.replace(/R\$ /g, 'R$ ').split(' ').filter(Boolean);
  const pesoTotal = palavras.reduce((s, p) => s + peso(p), 0);
  const paraReal = (t: number) => {
    let resto = t;
    for (const [a, b] of falas) {
      if (resto <= b - a) return a + resto;
      resto -= b - a;
    }
    return r.duracaoAudio;
  };
  let acc = 0;
  return palavras.map((p) => {
    const ini = paraReal((acc / pesoTotal) * total);
    acc += peso(p);
    const fim = paraReal((acc / pesoTotal) * total - 0.001);
    return {texto: p, ini, fim};
  });
};

/** Agrupa as palavras por trecho de fala, no formato do componente de legendas. */
const trechosLegenda = (r: Roteiro): TrechoNarracao[] => {
  const falas = intervalosFala(r);
  const ps = palavrasComTempo(r);
  return falas
    .map(([a, b]) => {
      const dentro = ps.filter((p) => p.ini >= a - 0.01 && p.ini < b);
      if (!dentro.length) return null;
      const de = dentro[0].ini;
      const ate = dentro[dentro.length - 1].fim;
      return {de, ate, emFrame: Math.round((de * FPS) / r.velocidade), legenda: dentro.map((p) => p.texto).join(' ')};
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);
};

/** Frame do vídeo em que a voz fala a palavra (começo da palavra). */
const frameDaPalavra = (r: Roteiro, palavra: string) => {
  const p = palavrasComTempo(r).find((w) => limpar(w.texto).toLowerCase().startsWith(palavra.toLowerCase()));
  return p ? Math.round((p.ini * FPS) / r.velocidade) : 99999;
};

export const duracaoRoteiro = (r: Roteiro) => Math.ceil((r.duracaoAudio / r.velocidade) * FPS + 24);

/* ---------------- personagem ---------------- */

// Recorte da personagem: cabeça até o quadril
const RECORTE = {x: 230, l: 590, alturaFonte: 1100};
const CAIXA = {l: 690, a: 1290, x: -20, y: 470};

const Personagem: React.FC<{audio: string; velocidade: number}> = ({audio, velocidade}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dados = useAudioData(staticFile(audio));
  let vol = 0;
  if (dados) {
    const v = visualizeAudio({fps, frame: Math.round(frame * velocidade), audioData: dados, numberOfSamples: 16});
    vol = Math.min(1, (v.slice(0, 6).reduce((s, x) => s + x, 0) / 6) * 4);
  }
  const entra = spring({frame, fps, config: {damping: 14, stiffness: 110}});
  const escalaImg = CAIXA.l / RECORTE.l;
  const y = Math.sin(frame * 0.07) * 6 - vol * 16 + (1 - entra) * 500;
  const rot = Math.sin(frame * 0.05) * 1 + vol * 1.6;
  return (
    <div
      style={{
        position: 'absolute',
        left: CAIXA.x,
        top: CAIXA.y,
        width: CAIXA.l,
        height: CAIXA.a,
        overflow: 'hidden',
        transformOrigin: '50% 100%',
        transform: `translateY(${y}px) rotate(${rot}deg) scale(${1 + vol * 0.025})`,
        WebkitMaskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, #000 82%, transparent 100%)',
      }}
    >
      <Img
        src={staticFile('personagem/apresentadora.png')}
        style={{
          position: 'absolute',
          left: -RECORTE.x * escalaImg,
          top: 0,
          width: 1024 * escalaImg,
          height: 1536 * escalaImg,
          filter: 'drop-shadow(0 20px 40px rgba(10,4,26,0.55))',
        }}
      />
    </div>
  );
};

/* ---------------- cartas do kit ---------------- */

const COLUNA = {x: 610, l: 450};

const CartaItem: React.FC<{imagem: string; rotulo: string; idade: number; paisagem: boolean}> = ({imagem, rotulo, idade, paisagem}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 11, stiffness: 150}});
  const l = paisagem ? 420 : 360;
  const a = paisagem ? 315 : 500;
  const atual = idade === 0;
  const desloc = atual ? 0 : 30 + idade * 18;
  return (
    <div
      style={{
        position: 'absolute',
        left: COLUNA.x + (COLUNA.l - l) / 2 + (atual ? 0 : (idade % 2 ? 1 : -1) * desloc * 0.6),
        top: 470 + (paisagem ? 90 : 0) - (atual ? 0 : 20),
        zIndex: 10 - idade,
        opacity: interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * (idade > 2 ? 0 : 1),
        transform: `scale(${interpolate(s, [0, 1], [0.3, atual ? 1 : 0.82])}) rotate(${atual ? 3 : (idade % 2 ? 9 : -9)}deg)`,
      }}
    >
      <Flutuar amplitude={atual ? 10 : 4} fase={idade}>
        <Imagem src={imagem} largura={l} altura={a} borda={10} raio={18} />
      </Flutuar>
      {atual ? (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 18, width: l, marginLeft: (l - 440) / 2 > 0 ? 0 : (l - 440) / 2}}>
          <div
            style={{
              ...estiloTexto(38),
              maxWidth: 440,
              padding: '8px 24px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(123,92,214,0.95), rgba(182,156,255,0.95))',
              border: `3px solid ${cores.branco}`,
              textAlign: 'center',
              transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
            }}
          >
            {rotulo}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ---------------- vídeo ---------------- */

export const VideoApresentadora: React.FC<PropsVideo & {roteiro: Roteiro}> = ({roteiro: r, temTrilha}) => {
  const frame = useCurrentFrame();
  const tItens = r.itens.map((it) => frameDaPalavra(r, it.palavra) - 3);
  const fimGancho = Math.min(tItens[0] ?? 75, 80);
  const tPreco = frameDaPalavra(r, r.palavraPreco);
  const tCTA = frameDaPalavra(r, r.palavraCTA);
  const atual = tItens.filter((t) => frame >= t).length - 1;

  return (
    <Fundo>
      <Trilha ativa={temTrilha} volume={0.15} />
      <Html5Audio src={staticFile(r.audio)} playbackRate={r.velocidade} />

      {/* luz atrás da personagem */}
      <div
        style={{
          position: 'absolute',
          left: -200,
          top: 500,
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(182,156,255,0.45) 0%, rgba(182,156,255,0) 65%)',
        }}
      />
      <Personagem audio={r.audio} velocidade={r.velocidade} />

      {/* gancho */}
      <Sequence durationInFrames={fimGancho + 4} layout="none">
        <TextoGancho texto={r.gancho} topo={280} tamanho={92} saida={fimGancho - 6} />
      </Sequence>

      {/* itens do kit entrando ao lado dela */}
      {r.itens.map((it, i) =>
        frame >= tItens[i] ? (
          <Sequence key={it.rotulo} from={tItens[i]} layout="none">
            <CartaItem imagem={it.imagem} rotulo={it.rotulo} idade={atual - i} paisagem={it.imagem === IMAGENS.kitCompleto} />
          </Sequence>
        ) : null,
      )}

      {/* preço e CTA quando ela fala */}
      <Sequence from={tPreco} layout="none">
        <div style={{position: 'absolute', top: 1120, left: COLUNA.x - 20, width: COLUNA.l + 40, display: 'flex', justifyContent: 'center'}}>
          <Preco texto={PRECO} tamanho={104} />
        </div>
      </Sequence>
      <Sequence from={tCTA} layout="none">
        <div style={{position: 'absolute', top: 1270, left: COLUNA.x - 10, width: COLUNA.l + 20, display: 'flex', justifyContent: 'center'}}>
          <CTA texto={CTA_TEXTO} tamanho={34} />
        </div>
      </Sequence>

      <Legendas trechos={trechosLegenda(r)} velocidade={r.velocidade} ativa />
      <AbsoluteFill style={{pointerEvents: 'none'}} />
    </Fundo>
  );
};
