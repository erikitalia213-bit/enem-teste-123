import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CTA,
  Coracoes,
  Etiqueta,
  Flash,
  Flutuar,
  Fundo,
  Imagem,
  Legenda,
  Preco,
  PropsVideo,
  TextoGancho,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {LARGURA, cores} from '../compartilhado/tema';
import {textos} from './textos';

// Capa + páginas folheadas, na ordem.
const paginas = [
  IMAGENS.capa,
  IMAGENS.colorir,
  IMAGENS.journal,
  IMAGENS.diarioMusicas,
  IMAGENS.diarioMemorias,
  IMAGENS.calendario,
];

const FIM_GANCHO = 60; // 2s
const POR_PAGINA = 48; // 1,6s por página
const DURACAO_VIRADA = 18;
const FIM_FOLHEAR = FIM_GANCHO + (paginas.length - 1) * POR_PAGINA; // 300 = 10s

const PAG_L = 640;
const PAG_A = 905;
const PAG_TOPO = 470;

/** Frame em que a página `k` aparece totalmente (capa = 0). */
const inicioPagina = (k: number) => (k === 0 ? 0 : FIM_GANCHO + (k - 1) * POR_PAGINA);
/** Frame em que a página `k` começa a virar. */
const inicioVirada = (k: number) => inicioPagina(k + 1) - 14;

const progressoVirada = (frame: number, k: number) => {
  if (k >= paginas.length - 1) return 0;
  const s = inicioVirada(k);
  return interpolate(frame, [s, s + DURACAO_VIRADA], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
};

const Livro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Zoom de entrada da capa no gancho
  const zoom = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const escala = interpolate(zoom, [0, 1], [1.7, 1]) * (1 + Math.max(0, 40 - frame) * 0.001);

  return (
    <div
      style={{
        position: 'absolute',
        top: PAG_TOPO,
        left: (LARGURA - PAG_L) / 2,
        width: PAG_L,
        height: PAG_A,
        perspective: 2600,
        transform: `scale(${escala})`,
        opacity: interpolate(zoom, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
      }}
    >
      <Flutuar amplitude={10} style={{width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d'}}>
        {/* espessura do livro */}
        {[3, 2, 1].map((n) => (
          <div
            key={n}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${n * 7}px, ${n * 6}px)`,
              background: n === 3 ? cores.roxo : '#F4EEFF',
              borderRadius: 18,
              boxShadow: n === 3 ? '0 40px 80px rgba(10,4,26,0.6)' : undefined,
            }}
          />
        ))}
        {paginas.map((src, k) => {
          const p = progressoVirada(frame, k);
          if (p >= 1) return null; // já virou
          if (frame < inicioPagina(k) - 30 && k > 1) return null; // ainda longe
          const pAnterior = k > 0 ? progressoVirada(frame, k - 1) : 1;
          const sombraSob = k > 0 ? Math.sin(pAnterior * Math.PI) * 0.45 : 0;
          return (
            <div
              key={src}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 100 - k,
                transformOrigin: 'left center',
                transform: `rotateY(${-180 * p}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* frente */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  borderRadius: k === 0 ? 18 : '6px 18px 18px 6px',
                  overflow: 'hidden',
                  background: cores.branco,
                  boxShadow: 'inset 14px 0 24px -12px rgba(30,20,51,0.35)',
                }}
              >
                <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <AbsoluteFill
                  style={{
                    background: 'linear-gradient(90deg, rgba(30,20,51,0.55), rgba(30,20,51,0))',
                    opacity: p * 1.4 + sombraSob,
                  }}
                />
              </div>
              {/* verso */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '18px 6px 6px 18px',
                  background: `linear-gradient(90deg, #E9E0FF, #F8F4FF)`,
                }}
              />
            </div>
          );
        })}
      </Flutuar>
    </div>
  );
};

export const Video01Folheie: React.FC<PropsVideo> = ({temTrilha}) => {
  const frame = useCurrentFrame();
  return (
    <Fundo>
      <Trilha ativa={temTrilha} />

      {/* 0–10s: capa + folhear */}
      <Sequence durationInFrames={FIM_FOLHEAR} layout="none">
        <Livro />
        {frame < FIM_GANCHO + 4 ? (
          <TextoGancho texto={textos.gancho} topo={268} tamanho={90} saida={FIM_GANCHO - 6} />
        ) : null}
        <Sequence from={FIM_GANCHO} layout="none">
          <Etiqueta texto={textos.etiqueta} topo={300} />
        </Sequence>
        {textos.legendas.map((leg, i) => (
          <Sequence key={leg} from={inicioPagina(i + 1) - 6} durationInFrames={POR_PAGINA} layout="none">
            <Legenda texto={leg} topo={1418} />
          </Sequence>
        ))}
      </Sequence>

      {/* 10–15s: kit completo + preço + CTA */}
      <Sequence from={FIM_FOLHEAR} layout="none">
        <Coracoes />
        <Etiqueta texto={textos.tituloFinal} topo={280} />
        <div style={{position: 'absolute', top: 410, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <FinalKit />
        </div>
        <div style={{position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Preco texto={textos.preco} atraso={10} />
        </div>
        <div style={{position: 'absolute', top: 1385, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto={textos.cta} atraso={22} tamanho={46} />
        </div>
      </Sequence>
      <Flash em={FIM_GANCHO} />
      <Flash em={FIM_FOLHEAR} duracao={10} />
    </Fundo>
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
