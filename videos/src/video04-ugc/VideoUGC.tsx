import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
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
  TrechoNarracao,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas} from '../compartilhado/legendas';
import {FPS, cores, estiloTexto} from '../compartilhado/tema';
import {Anuncio, SEGUNDOS_FINAL} from './anuncios';

export const duracaoAnuncio = (a: Anuncio) =>
  Math.round(a.clipes.reduce((s, c) => s + c.duracao, 0) * FPS + SEGUNDOS_FINAL * FPS);

/** Frame em que cada clipe começa. */
const inicios = (a: Anuncio) => {
  const r: number[] = [];
  let f = 0;
  for (const c of a.clipes) {
    r.push(f);
    f += Math.round(c.duracao * FPS);
  }
  return {inicios: r, fimClipes: f};
};

/** Converte as frases dos clipes em trechos para o componente de legendas. */
const trechosLegenda = (a: Anuncio): TrechoNarracao[] => {
  const {inicios: ini} = inicios(a);
  return a.clipes.flatMap((c, i) =>
    c.frases.map((fr) => ({
      de: fr.de,
      ate: fr.ate,
      emFrame: ini[i] + Math.round(fr.de * FPS),
      legenda: fr.legenda,
    })),
  );
};

const Clipe: React.FC<{arquivo: string; inicio?: number}> = ({arquivo, inicio = 0}) => {
  const frame = useCurrentFrame();
  // leve zoom contínuo para dar energia
  const zoom = 1.02 + frame * 0.0006;
  return (
    <AbsoluteFill style={{backgroundColor: cores.fundo, overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(arquivo)}
        trimBefore={Math.round(inicio * FPS)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
      />
    </AbsoluteFill>
  );
};

/** Selo pequeno no topo durante os clipes (não cobre o rosto). */
const SeloTopo: React.FC<{texto: string}> = ({texto}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o}}>
      <Entrada>
        <div
          style={{
            ...estiloTexto(44),
            padding: '10px 28px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(123,92,214,0.92), rgba(182,156,255,0.92))',
            border: `3px solid ${cores.branco}`,
            boxShadow: '0 10px 28px rgba(10,4,26,0.45)',
          }}
        >
          {texto}
        </div>
      </Entrada>
    </div>
  );
};

const CardFinal: React.FC<{final: Anuncio['final']}> = ({final}) => (
  <Fundo>
    <Coracoes />
    <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Entrada>
        <div style={estiloTexto(84)}>{final.titulo}</div>
      </Entrada>
    </div>
    <div style={{position: 'absolute', top: 410, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Entrada atraso={3} de={0.7}>
        <Flutuar amplitude={10}>
          <Imagem src={IMAGENS.kitCompleto} largura={920} altura={690} />
        </Flutuar>
      </Entrada>
    </div>
    <div style={{position: 'absolute', top: 1115, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Preco texto={final.preco} tamanho={150} atraso={10} />
    </div>
    <div style={{position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Entrada atraso={16}>
        <div style={estiloTexto(48)}>{final.detalhe}</div>
      </Entrada>
    </div>
    <div style={{position: 'absolute', top: 1385, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <CTA texto={final.cta} atraso={22} tamanho={58} />
    </div>
  </Fundo>
);

export const VideoUGC: React.FC<PropsVideo & {anuncio: Anuncio}> = ({anuncio, temTrilha}) => {
  const {inicios: ini, fimClipes} = inicios(anuncio);
  return (
    <AbsoluteFill style={{backgroundColor: cores.fundo}}>
      <Trilha ativa={temTrilha} volume={0.15} />
      {anuncio.clipes.map((c, i) => (
        <Sequence key={c.arquivo} from={ini[i]} durationInFrames={Math.round(c.duracao * FPS)}>
          <Clipe arquivo={c.arquivo} inicio={c.inicio} />
          {i > 0 ? <SeloTopo texto="Kit de Natal ARMY 💜" /> : null}
        </Sequence>
      ))}
      <Sequence from={fimClipes}>
        <CardFinal final={anuncio.final} />
      </Sequence>
      {ini.slice(1).map((f) => (
        <Flash key={f} em={f} duracao={6} />
      ))}
      <Flash em={fimClipes} duracao={10} />
      <Legendas trechos={trechosLegenda(anuncio)} velocidade={1} ativa />
    </AbsoluteFill>
  );
};
