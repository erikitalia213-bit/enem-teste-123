import React from 'react';
import {Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CTA,
  Coracoes,
  Entrada,
  Flash,
  Flutuar,
  Fundo,
  Imagem,
  Preco,
  PropsVideo,
  TextoGancho,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {LARGURA, cores, estiloTexto, fonte} from '../compartilhado/tema';
import {textos} from './textos';

// Uma imagem por linha do checklist (paisagem = true para imagens horizontais)
const imagensItens: {src: string; paisagem?: boolean}[] = [
  {src: IMAGENS.colorir},
  {src: IMAGENS.diarioMemorias},
  {src: IMAGENS.tags},
  {src: IMAGENS.insideCalendario},
  {src: IMAGENS.kitCompleto, paisagem: true},
];

const FIM_GANCHO = 60;
const POR_ITEM = 60; // 2s por linha
const ATRASO_CHECK = 26;
const FIM_LISTA = FIM_GANCHO + textos.itens.length * POR_ITEM; // 360 = 12s

const inicioItem = (i: number) => FIM_GANCHO + i * POR_ITEM;

const corTextoNota = '#2A1B4A';

const Caixinha: React.FC<{marcadaEm: number}> = ({marcadaEm}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - marcadaEm, fps, config: {damping: 7, stiffness: 220, mass: 0.6}});
  const marcada = frame >= marcadaEm;
  const raio = interpolate(frame - marcadaEm, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'relative', width: 60, height: 60, flexShrink: 0}}>
      {/* brilhinhos do "pop" */}
      {marcada
        ? new Array(6).fill(0).map((_, k) => {
            const a = (k / 6) * Math.PI * 2;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: 22 + Math.cos(a) * 48 * raio,
                  top: 14 + Math.sin(a) * 48 * raio,
                  fontSize: 22,
                  color: k % 2 ? cores.dourado : cores.lavanda,
                  opacity: 1 - raio,
                  fontFamily: fonte,
                }}
              >
                ✦
              </div>
            );
          })
        : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          border: `5px solid ${marcada ? cores.roxo : cores.lavanda}`,
          background: marcada ? `linear-gradient(135deg, ${cores.lavanda}, ${cores.roxo})` : 'transparent',
          transform: marcada ? `scale(${interpolate(s, [0, 1], [0.4, 1])})` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: cores.branco,
          fontSize: 44,
          fontWeight: 700,
          fontFamily: fonte,
          boxSizing: 'border-box',
        }}
      >
        {marcada ? '✓' : ''}
      </div>
    </div>
  );
};

const LinhaChecklist: React.FC<{texto: string; inicio: number}> = ({texto, inicio}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - inicio, fps, config: {damping: 14, stiffness: 160}});
  const marcada = frame >= inicio + ATRASO_CHECK;
  if (frame < inicio) return <div style={{height: 104}} />;
  return (
    <div
      style={{
        height: 104,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        transform: `translateX(${(1 - s) * 60}px)`,
        opacity: s,
      }}
    >
      <Caixinha marcadaEm={inicio + ATRASO_CHECK} />
      <div
        style={{
          fontFamily: fonte,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.12,
          color: marcada ? cores.roxo : corTextoNota,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const Nota: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - FIM_GANCHO, fps, config: {damping: 14, stiffness: 120}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 262,
        left: 60,
        width: LARGURA - 120,
        borderRadius: 40,
        background: '#FFFDF9',
        boxShadow: '0 30px 80px rgba(10,4,26,0.6), 0 0 0 6px rgba(182,156,255,0.5)',
        padding: '30px 44px 26px',
        boxSizing: 'border-box',
        transform: `translateY(${(1 - s) * 120}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        opacity: s,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: fonte, fontWeight: 600, fontSize: 30, color: cores.roxo}}>
        <span>‹ Notas</span>
        <span>✦ ✧</span>
      </div>
      <div style={{fontFamily: fonte, fontWeight: 700, fontSize: 56, color: corTextoNota, marginTop: 8}}>
        {textos.tituloNota}
      </div>
      <div style={{fontFamily: fonte, fontWeight: 500, fontSize: 30, color: '#9A8BB8', marginBottom: 10}}>
        {textos.subtituloNota}
      </div>
      {textos.itens.map((t, i) => (
        <LinhaChecklist key={t} texto={t} inicio={inicioItem(i)} />
      ))}
    </div>
  );
};

/** Polaroids que vão se acumulando embaixo da nota. */
const Polaroids: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const atual = Math.min(imagensItens.length - 1, Math.floor((frame - FIM_GANCHO) / POR_ITEM));
  return (
    <div style={{position: 'absolute', top: 1060, left: 0, right: 0, height: 500}}>
      {imagensItens.map((img, i) => {
        if (i > atual) return null;
        const t = frame - inicioItem(i);
        const s = spring({frame: t, fps, config: {damping: 11, stiffness: 140}});
        const idade = atual - i; // 0 = mais recente
        const l = img.paisagem ? 600 : 345;
        const a = img.paisagem ? 450 : 470;
        const lado = i % 2 === 0 ? -1 : 1;
        const x = LARGURA / 2 - l / 2 + (idade === 0 ? 0 : lado * (150 + idade * 20));
        return (
          <div
            key={img.src}
            style={{
              position: 'absolute',
              left: x,
              top: (500 - a) / 2 + (idade === 0 ? 0 : 20),
              zIndex: i,
              transform: `scale(${interpolate(s, [0, 1], [0.3, idade === 0 ? 1 : 0.8])}) rotate(${
                idade === 0 ? lado * 3 : lado * 10
              }deg)`,
              opacity: interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * (idade > 2 ? 0 : 1),
            }}
          >
            <Flutuar amplitude={idade === 0 ? 10 : 4} fase={i}>
              <Imagem src={img.src} largura={l} altura={a} borda={14} raio={14} />
            </Flutuar>
          </div>
        );
      })}
    </div>
  );
};

const GanchoFundo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 3, fps, config: {damping: 13}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 640,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${interpolate(s, [0, 1], [1.5, 1]) + frame * 0.002})`,
        opacity: s,
      }}
    >
      <Flutuar amplitude={10}>
        <Imagem src={IMAGENS.hero} largura={660} altura={880} />
      </Flutuar>
    </div>
  );
};

export const Video03Checklist: React.FC<PropsVideo> = ({temTrilha}) => (
  <Fundo>
    <Trilha ativa={temTrilha} />

    {/* 0–2s: gancho */}
    <Sequence durationInFrames={FIM_GANCHO + 4} layout="none">
      <GanchoFundo />
      <TextoGancho texto={textos.gancho} topo={290} tamanho={96} saida={FIM_GANCHO - 6} />
    </Sequence>

    {/* 2–12s: checklist */}
    <Sequence durationInFrames={FIM_LISTA} layout="none">
      <Polaroids />
      <Nota />
    </Sequence>

    {/* 12–15s: oferta */}
    <Sequence from={FIM_LISTA} layout="none">
      <Coracoes />
      <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada>
          <div style={estiloTexto(88)}>{textos.tituloFinal}</div>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 430, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada atraso={4} de={0.7}>
          <Flutuar amplitude={10}>
            <Imagem src={IMAGENS.kitCompleto} largura={920} altura={690} />
          </Flutuar>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Preco texto={textos.preco} tamanho={150} atraso={8} />
      </div>
      <div style={{position: 'absolute', top: 1380, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <CTA texto={textos.cta} atraso={18} tamanho={56} />
      </div>
    </Sequence>

    <Flash em={FIM_GANCHO} />
    <Flash em={FIM_LISTA} duracao={10} />
  </Fundo>
);
