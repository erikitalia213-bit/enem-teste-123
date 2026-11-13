import React from 'react';
import {AbsoluteFill, Easing, Html5Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CTA,
  Coracoes,
  Entrada,
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
import {Legendas} from '../compartilhado/legendas';
import {LARGURA, cores, estiloTexto} from '../compartilhado/tema';
import {Fala, duracaoFala, frameDaPalavra, trechosLegenda} from '../compartilhado/tempoFala';

/*
 * Vídeo 1 "Folheie o kit" (o livro com páginas virando) com a narração nova
 * de resposta direta. Cada página vira quando a voz fala dela.
 */

export type RoteiroFolheie = Fala & {
  id: string;
  arquivo: string;
  audio: string;
  gancho: string;
};

// Páginas do livro: [imagem, palavra que faz a página aparecer, etiqueta no topo]
const PAGINAS: {src: string; palavra?: string; rotulo?: string}[] = [
  {src: IMAGENS.capa},
  {src: IMAGENS.hero, palavra: 'descobri', rotulo: 'Kit pra imprimir em casa ✦'},
  {src: IMAGENS.cartoes, palavra: 'são', rotulo: '1.500 photocards'},
  {src: IMAGENS.colorir, palavra: '80', rotulo: '80 desenhos pra colorir'},
  {src: IMAGENS.journal, palavra: 'diários', rotulo: 'Diários de bônus'},
  {src: IMAGENS.calendario, palavra: 'calendários', rotulo: '7 calendários 3D 2027'},
];

// Selos da "dor" que pulam em cima do livro
const DORES = [
  {palavra: 'merch', texto: 'Merch cara 💸', x: 70, y: 620, rot: -8},
  {palavra: 'frete', texto: 'Frete que atrasa 📦', x: 430, y: 880, rot: 6},
  {palavra: 'presente', texto: 'Presente pra depois ⏳', x: 120, y: 1150, rot: -4},
];

const PAG_L = 640;
const PAG_A = 905;
const PAG_TOPO = 470;
const DURACAO_VIRADA = 18;

export const duracaoFolheie = (r: RoteiroFolheie) => duracaoFala(r, 18);

const Livro: React.FC<{inicios: number[]}> = ({inicios}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const escala = interpolate(zoom, [0, 1], [1.7, 1]) * (1 + Math.max(0, 40 - frame) * 0.001);

  const progresso = (k: number) => {
    if (k >= PAGINAS.length - 1) return 0;
    const s = inicios[k + 1] - 14;
    return interpolate(frame, [s, s + DURACAO_VIRADA], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    });
  };

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
        {PAGINAS.map((pg, k) => {
          const p = progresso(k);
          if (p >= 1) return null;
          if (k > 1 && frame < inicios[k] - 40) return null;
          const pAnterior = k > 0 ? progresso(k - 1) : 1;
          const sombraSob = k > 0 ? Math.sin(pAnterior * Math.PI) * 0.45 : 0;
          return (
            <div
              key={pg.src}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 100 - k,
                transformOrigin: 'left center',
                transform: `rotateY(${-180 * p}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
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
                <Img src={staticFile(pg.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <AbsoluteFill
                  style={{background: 'linear-gradient(90deg, rgba(30,20,51,0.55), rgba(30,20,51,0))', opacity: p * 1.4 + sombraSob}}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '18px 6px 6px 18px',
                  background: 'linear-gradient(90deg, #E9E0FF, #F8F4FF)',
                }}
              />
            </div>
          );
        })}
      </Flutuar>
    </div>
  );
};

/** Selo de "dor" que pula com um tremidinho. */
const SeloDor: React.FC<{texto: string; x: number; y: number; rot: number}> = ({texto, x, y, rot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 8, stiffness: 220, mass: 0.6}});
  const treme = frame < 12 ? Math.sin(frame * 2.2) * (12 - frame) * 0.6 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s}) rotate(${rot + treme}deg)`, zIndex: 200}}>
      <div
        style={{
          ...estiloTexto(54, cores.branco, '#5A1E4A'),
          padding: '14px 30px',
          borderRadius: 22,
          background: 'linear-gradient(135deg, #E0567A, #B0346A)',
          border: `4px solid ${cores.branco}`,
          boxShadow: '0 16px 36px rgba(10,4,26,0.55)',
          whiteSpace: 'nowrap',
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Video01Narrado: React.FC<PropsVideo & {roteiro: RoteiroFolheie}> = ({roteiro: r, temTrilha}) => {
  const {durationInFrames} = useVideoConfig();
  const inicios = PAGINAS.map((p, k) => (k === 0 ? 0 : frameDaPalavra(r, p.palavra ?? '') - 4));
  const tTodo = frameDaPalavra(r, 'todo') - 4;
  const tFinal = frameDaPalavra(r, 'tudo') - 4;
  const tDigital = frameDaPalavra(r, 'digital') - tFinal;
  const tCTA = frameDaPalavra(r, 'toca') - tFinal;
  const tDescobri = inicios[1];

  return (
    <Fundo>
      <Trilha ativa={temTrilha} volume={0.15} />
      <Html5Audio src={staticFile(r.audio)} playbackRate={r.velocidade} />

      {/* livro folheando até o card final */}
      <Sequence durationInFrames={tFinal} layout="none">
        <Livro inicios={inicios} />

        {/* gancho */}
        <Sequence durationInFrames={tTodo + 4} layout="none">
          <TextoGancho texto={r.gancho} topo={270} tamanho={84} saida={tTodo - 6} />
        </Sequence>

        {/* dores */}
        <Sequence from={tTodo} durationInFrames={tDescobri - tTodo} layout="none">
          <Etiqueta texto="Todo Natal é igual…" topo={300} />
        </Sequence>
        {DORES.map((d) => {
          const ini = frameDaPalavra(r, d.palavra) - 3;
          return (
            <Sequence key={d.palavra} from={ini} durationInFrames={Math.max(1, tDescobri - ini)} layout="none">
              <SeloDor texto={d.texto} x={d.x} y={d.y} rot={d.rot} />
            </Sequence>
          );
        })}

        {/* etiquetas das páginas */}
        {PAGINAS.map((p, k) =>
          k === 0 || !p.rotulo ? null : (
            <Sequence
              key={p.src}
              from={inicios[k] - 6}
              durationInFrames={(k + 1 < PAGINAS.length ? inicios[k + 1] : tFinal) - inicios[k]}
              layout="none"
            >
              <Legenda texto={p.rotulo} topo={300} />
            </Sequence>
          ),
        )}
      </Sequence>

      {/* card final */}
      <Sequence from={tFinal} durationInFrames={durationInFrames - tFinal} layout="none">
        <Coracoes />
        <Etiqueta texto="O kit completo ✦" topo={280} />
        <div style={{position: 'absolute', top: 380, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada de={0.6}>
            <Flutuar amplitude={12}>
              <Imagem src={IMAGENS.kitCompleto} largura={980} altura={735} />
            </Flutuar>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 1125, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Preco texto="Só R$ 19,90" atraso={4} />
        </div>
        <Sequence from={tDigital} layout="none">
          <div style={{position: 'absolute', top: 1280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <Entrada>
              <div style={estiloTexto(48)}>digital · sem frete · acesso imediato</div>
            </Entrada>
          </div>
        </Sequence>
        <Sequence from={tCTA} layout="none">
          <div style={{position: 'absolute', top: 1360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <CTA texto="Toque em Saiba mais 💜" tamanho={52} />
          </div>
        </Sequence>
      </Sequence>

      {inicios.slice(1).map((f) => (
        <Flash key={f} em={f - 8} duracao={4} />
      ))}
      <Flash em={tFinal} duracao={10} />

      <Legendas trechos={trechosLegenda(r)} velocidade={r.velocidade} ativa />
    </Fundo>
  );
};
