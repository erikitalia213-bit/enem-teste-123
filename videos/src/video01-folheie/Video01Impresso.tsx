import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CTA,
  Coracoes,
  Etiqueta,
  Flash,
  Flutuar,
  Fundo,
  Imagem,
  Legenda,
  Narracao,
  Preco,
  PropsVideo,
  TextoGancho,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas} from '../compartilhado/legendas';
import {FPS} from '../compartilhado/tema';
import {ARQUIVO_NARRACAO, VELOCIDADE, tempos, trechos} from './narracao';
import {textos} from './textos';

/*
 * Criativo 1 em versão "kit impresso": mesma narração, legendas e card final
 * do Video01, mas com clipes reais de mãos mexendo no kit impresso
 * (gerados no Gemini/Flow). Só os trechos bons de cada clipe são usados.
 */

type Corte = {
  arquivo: string;
  de: number; // segundo do clipe original onde o corte começa
  velocidade?: number;
  zoom?: number; // zoom extra (ex.: esconder texto deformado)
  focoY?: string; // ponto do zoom (ex.: '65%')
};

const P = tempos.inicioPaginas; // [0, 60, 103, 158, 191, 241]
// Um corte por momento da narração
const cortes: {inicio: number; fim: number; corte: Corte}[] = [
  {inicio: 0, fim: P[1], corte: {arquivo: 'clipes/impresso/g1.mp4', de: 1.6, velocidade: 1.2}},
  {inicio: P[1], fim: P[2], corte: {arquivo: 'clipes/impresso/g2.mp4', de: 2.0}},
  {inicio: P[2], fim: P[3], corte: {arquivo: 'clipes/impresso/journal.mp4', de: 2.2, zoom: 1.45, focoY: '88%'}},
  {inicio: P[3], fim: P[5], corte: {arquivo: 'clipes/impresso/musicas.mp4', de: 1.0}},
  {inicio: P[5], fim: tempos.inicioFinal, corte: {arquivo: 'clipes/impresso/calendario.mp4', de: 0.8}},
];

const Clipe: React.FC<{corte: Corte; dur: number}> = ({corte, dur}) => {
  const frame = useCurrentFrame();
  // zoom suave contínuo (Ken Burns) + zoom extra do corte
  const z = (corte.zoom ?? 1.04) + interpolate(frame, [0, dur], [0, 0.06]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(corte.arquivo)}
        trimBefore={Math.round(corte.de * FPS)}
        playbackRate={corte.velocidade ?? 1}
        volume={0.25}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${z})`,
          transformOrigin: `50% ${corte.focoY ?? '50%'}`,
          // cor mais quente e com mais contraste
          filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
        }}
      />
      {/* tom quente leve + vinheta */}
      <AbsoluteFill style={{background: 'rgba(255,170,90,0.06)', mixBlendMode: 'overlay'}} />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,8,30,0.45) 100%)'}}
      />
      {/* sombra no topo e embaixo para os textos lerem bem */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(30,20,51,0.55) 0%, rgba(30,20,51,0) 26%, rgba(30,20,51,0) 70%, rgba(30,20,51,0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const FinalKit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  return (
    <div style={{transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s}}>
      <Flutuar amplitude={12}>
        <Imagem src={IMAGENS.kitCompleto} largura={980} altura={735} />
      </Flutuar>
    </div>
  );
};

export const Video01Impresso: React.FC<PropsVideo> = ({temTrilha, temNarracao = false}) => {
  const FIM = tempos.inicioFinal;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Trilha ativa={temTrilha} volume={temNarracao ? 0.18 : 0.8} />
      <Narracao arquivo={ARQUIVO_NARRACAO} ativa={temNarracao} trechos={trechos} velocidade={VELOCIDADE} />

      {cortes.map((c) => (
        <Sequence key={c.corte.arquivo} from={c.inicio} durationInFrames={c.fim - c.inicio}>
          <Clipe corte={c.corte} dur={c.fim - c.inicio} />
        </Sequence>
      ))}

      {/* gancho */}
      <Sequence durationInFrames={P[1] + 4} layout="none">
        <TextoGancho texto={textos.gancho} topo={290} tamanho={96} saida={P[1] - 6} />
      </Sequence>

      {/* etiquetas das páginas no topo */}
      {textos.legendas.map((leg, i) => {
        const ini = P[i + 1];
        const fim = i + 2 < P.length ? P[i + 2] : FIM;
        return (
          <Sequence key={leg} from={ini} durationInFrames={fim - ini} layout="none">
            <Legenda texto={leg} topo={300} />
          </Sequence>
        );
      })}

      {/* card final */}
      <Sequence from={FIM}>
        <Fundo>
          <Coracoes />
          <Etiqueta texto={textos.tituloFinal} topo={280} />
          <div style={{position: 'absolute', top: 380, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <FinalKit />
          </div>
          <div style={{position: 'absolute', top: 1125, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Preco texto={textos.preco} atraso={tempos.atrasoPreco} />
          </div>
          <div style={{position: 'absolute', top: 1285, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <CTA texto={textos.cta} atraso={tempos.atrasoCTA} tamanho={46} />
          </div>
        </Fundo>
      </Sequence>

      {cortes.slice(1).map((c) => (
        <Flash key={c.inicio} em={c.inicio} duracao={5} />
      ))}
      <Flash em={FIM} duracao={10} />

      <Legendas trechos={trechos} velocidade={VELOCIDADE} ativa={temNarracao} />
    </AbsoluteFill>
  );
};
