import React from 'react';
import {Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CTA,
  Contador,
  Coracoes,
  Entrada,
  Flash,
  Flutuar,
  Fundo,
  Imagem,
  Preco,
  PropsVideo,
  Selo,
  TextoGancho,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {LARGURA, cores, estiloTexto} from '../compartilhado/tema';
import {textos} from './textos';

// Uma imagem por item de `textos.itens`
const imagensItens = [IMAGENS.colorir, IMAGENS.cartoes, IMAGENS.calendario, IMAGENS.diarioCapa];

const FIM_GANCHO = 60;
const POR_ITEM = 66; // 2,2s
const FIM_EMPILHAR = FIM_GANCHO + imagensItens.length * POR_ITEM + 6; // 330 = 11s

// Imagem grande (entrada) e posição final no mosaico 2x2
const GRANDE = {l: 600, a: 848, x: (LARGURA - 600) / 2, y: 600};
const TILE = {l: 440, a: 405};
const tiles = [
  {x: 80, y: 610, r: -4},
  {x: 560, y: 610, r: 3},
  {x: 80, y: 1040, r: 2},
  {x: 560, y: 1040, r: -3},
];

const inicioItem = (i: number) => FIM_GANCHO + i * POR_ITEM;

const Mosaico: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // No final, o mosaico vira fundo desfocado
  const recuo = interpolate(frame, [FIM_EMPILHAR, FIM_EMPILHAR + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - recuo, filter: `blur(${recuo * 10}px)`}}>
      {imagensItens.map((src, i) => {
        const t = frame - inicioItem(i);
        if (t < 0) return null;
        const entra = spring({frame: t, fps, config: {damping: 12, stiffness: 130}});
        const vai = interpolate(t, [44, 62], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.cubic),
        });
        const tile = tiles[i];
        const l = interpolate(vai, [0, 1], [GRANDE.l, TILE.l]);
        const a = interpolate(vai, [0, 1], [GRANDE.a, TILE.a]);
        const x = interpolate(vai, [0, 1], [GRANDE.x, tile.x]);
        const y = interpolate(vai, [0, 1], [GRANDE.y, tile.y]);
        return (
          <div
            key={src}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              zIndex: 10 + i,
              transform: `scale(${interpolate(entra, [0, 1], [0.5, 1])}) rotate(${tile.r * vai}deg)`,
              opacity: interpolate(entra, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
            }}
          >
            <Flutuar amplitude={vai * 8} fase={i * 1.7}>
              <Imagem src={src} largura={l} altura={a} />
            </Flutuar>
          </div>
        );
      })}
    </div>
  );
};

const CabecalhoItem: React.FC<{i: number}> = ({i}) => {
  const item = textos.itens[i];
  return (
    <div style={{position: 'absolute', top: 262, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Entrada de={0.3}>
        <Contador
          ate={item.numero}
          prefixo={item.prefixo}
          inicio={2}
          duracao={item.numero > 100 ? 30 : 20}
          style={{...estiloTexto(170, cores.dourado, cores.roxoProfundo), display: 'block'}}
        />
      </Entrada>
      <Entrada atraso={6}>
        <div style={{...estiloTexto(64), marginTop: -6}}>{item.rotulo}</div>
      </Entrada>
    </div>
  );
};

const GanchoFundo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 13}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 720,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${interpolate(s, [0, 1], [1.4, 1]) + frame * 0.002}) rotate(-3deg)`,
        opacity: s,
      }}
    >
      <Flutuar amplitude={10}>
        <Imagem src={IMAGENS.kitCompleto} largura={960} altura={720} />
      </Flutuar>
    </div>
  );
};

export const Video02Oferta: React.FC<PropsVideo> = ({temTrilha}) => {
  return (
    <Fundo>
      <Trilha ativa={temTrilha} />

      {/* 0–2s: gancho */}
      <Sequence durationInFrames={FIM_GANCHO + 4} layout="none">
        <GanchoFundo />
        <TextoGancho texto={textos.gancho} topo={300} tamanho={100} saida={FIM_GANCHO - 6} />
      </Sequence>

      {/* 2–11s: empilhamento de valor */}
      <Mosaico />
      {textos.itens.map((item, i) => (
        <Sequence
          key={item.rotulo}
          from={inicioItem(i)}
          durationInFrames={i === textos.itens.length - 1 ? FIM_EMPILHAR - inicioItem(i) : POR_ITEM}
          layout="none"
        >
          <CabecalhoItem i={i} />
        </Sequence>
      ))}

      {/* 11–15s: oferta */}
      <Sequence from={FIM_EMPILHAR} layout="none">
        <Coracoes />
        <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada>
            <div style={estiloTexto(84)}>{textos.tituloFinal}</div>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada atraso={4} de={0.7}>
            <Flutuar amplitude={10}>
              <Imagem src={IMAGENS.kitCompleto} largura={900} altura={675} />
            </Flutuar>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 330, left: 790}}>
          <Selo linhas={textos.selo} tamanho={240} atraso={26} />
        </div>
        <div style={{position: 'absolute', top: 1115, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Preco texto={textos.preco} tamanho={140} atraso={10} />
        </div>
        <div style={{position: 'absolute', top: 1280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada atraso={16}>
            <div style={estiloTexto(54)}>{textos.detalhe}</div>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 1385, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto={textos.cta} atraso={22} tamanho={56} />
        </div>
      </Sequence>

      <Flash em={FIM_GANCHO} />
      <Flash em={FIM_EMPILHAR} duracao={10} />
    </Fundo>
  );
};
