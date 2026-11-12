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
  Narracao,
  Preco,
  PropsVideo,
  Selo,
  TextoGancho,
  Trilha,
} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {LARGURA, cores, estiloTexto} from '../compartilhado/tema';
import {ARQUIVO_NARRACAO, VELOCIDADE, tempos, trechos} from './narracao';
import {textos} from './textos';

// Uma imagem por item de `textos.itens`
const imagensItens = [IMAGENS.colorir, IMAGENS.cartoes, IMAGENS.calendario, IMAGENS.diarioCapa];

// Os tempos vêm de narracao.ts (casados com a fala)
const SEGUNDO_GANCHO = tempos.segundoGancho;
const FIM_GANCHO = tempos.inicioItens[0];
const FIM_EMPILHAR = tempos.inicioFinal;

// Imagem grande (entrada) e posição final no mosaico 2x2
const GRANDE = {l: 600, a: 848, x: (LARGURA - 600) / 2, y: 600};
const TILE = {l: 440, a: 405};
const tiles = [
  {x: 80, y: 610, r: -4},
  {x: 560, y: 610, r: 3},
  {x: 80, y: 1040, r: 2},
  {x: 560, y: 1040, r: -3},
];

const inicioItem = (i: number) => tempos.inicioItens[i];

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

const GanchoFundo: React.FC<{src: string; largura: number; altura: number; topo: number; giro: number}> = ({
  src,
  largura,
  altura,
  topo,
  giro,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 2, fps, config: {damping: 13}});
  return (
    <div
      style={{
        position: 'absolute',
        top: topo,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${interpolate(s, [0, 1], [1.4, 1]) + frame * 0.002}) rotate(${giro}deg)`,
        opacity: s,
      }}
    >
      <Flutuar amplitude={10}>
        <Imagem src={src} largura={largura} altura={altura} />
      </Flutuar>
    </div>
  );
};

export const Video02Oferta: React.FC<PropsVideo> = ({temTrilha, temNarracao = false}) => {
  return (
    <Fundo>
      <Trilha ativa={temTrilha} volume={temNarracao ? 0.22 : 0.8} />
      <Narracao arquivo={ARQUIVO_NARRACAO} ativa={temNarracao} trechos={trechos} velocidade={VELOCIDADE} />

      {/* Gancho, cena 1: "Sua filha ama BTS?" */}
      <Sequence durationInFrames={SEGUNDO_GANCHO} layout="none">
        <GanchoFundo src={IMAGENS.hero} largura={640} altura={853} topo={620} giro={2} />
        <TextoGancho texto={textos.gancho} topo={300} tamanho={110} />
      </Sequence>

      {/* Gancho, cena 2: "Esse presente custa menos que um lanche" */}
      <Sequence from={SEGUNDO_GANCHO} durationInFrames={FIM_GANCHO - SEGUNDO_GANCHO + 4} layout="none">
        <GanchoFundo src={IMAGENS.kitCompleto} largura={960} altura={720} topo={760} giro={-3} />
        <TextoGancho texto={textos.gancho2} topo={280} tamanho={100} largura={860} saida={FIM_GANCHO - SEGUNDO_GANCHO - 6} />
      </Sequence>

      {/* 2–11s: empilhamento de valor */}
      <Mosaico />
      {textos.itens.map((item, i) => (
        <Sequence
          key={item.rotulo}
          from={inicioItem(i)}
          durationInFrames={(i === textos.itens.length - 1 ? FIM_EMPILHAR : inicioItem(i + 1)) - inicioItem(i)}
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
          <Preco texto={textos.preco} tamanho={140} atraso={tempos.atrasoPreco} />
        </div>
        <div style={{position: 'absolute', top: 1280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada atraso={tempos.atrasoDetalhe}>
            <div style={estiloTexto(54)}>{textos.detalhe}</div>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 1385, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto={textos.cta} atraso={tempos.atrasoCTA} tamanho={56} />
        </div>
      </Sequence>

      <Flash em={SEGUNDO_GANCHO} />
      <Flash em={FIM_GANCHO} />
      <Flash em={FIM_EMPILHAR} duracao={10} />
    </Fundo>
  );
};
