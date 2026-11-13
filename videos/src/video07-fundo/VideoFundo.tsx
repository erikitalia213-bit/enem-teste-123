import React from 'react';
import {Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CTA, Entrada, Flutuar, Fundo, Imagem, Preco, PropsVideo, TextoGancho, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {FPS, LARGURA, cores, estiloTexto} from '../compartilhado/tema';
import {textos} from './textos';

// Uma imagem por item de textos.itens
const imagens = [IMAGENS.kitCompleto, IMAGENS.colorir, IMAGENS.cartoes, IMAGENS.diarioCapa, IMAGENS.calendario];
const f = (s: number) => Math.round(s * FPS);

/** Carta do item no topo (some quando o próximo entra). */
const Carta: React.FC<{src: string; rotulo: string; dur: number}> = ({src, rotulo, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 140}});
  const sai = interpolate(frame, [dur - 8, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        top: 300,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}) * (1 - sai),
        transform: `scale(${interpolate(s, [0, 1], [0.4, 1]) * (1 - sai * 0.2)}) translateX(${sai * -300}px) rotate(${-3 + sai * -10}deg)`,
      }}
    >
      <Flutuar amplitude={10}>
        {src === IMAGENS.kitCompleto ? (
          <Imagem src={src} largura={720} altura={540} />
        ) : (
          <Imagem src={src} largura={380} altura={537} />
        )}
      </Flutuar>
      <div
        style={{
          ...estiloTexto(50),
          marginTop: 20,
          padding: '10px 30px',
          borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(123,92,214,0.95), rgba(182,156,255,0.95))',
          border: `4px solid ${cores.branco}`,
          whiteSpace: 'nowrap',
        }}
      >
        {rotulo}
      </div>
    </div>
  );
};

export const VideoFundo: React.FC<PropsVideo> = ({temTrilha}) => {
  const fimItens = f(textos.digital.seg);
  return (
    <Fundo>
      <Trilha ativa={temTrilha} volume={0.15} />

      {/* luz suave onde a personagem vai ficar */}
      <div
        style={{
          position: 'absolute',
          left: LARGURA / 2 - 520,
          top: 980,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(182,156,255,0.4) 0%, rgba(182,156,255,0) 65%)',
        }}
      />

      <Sequence durationInFrames={f(textos.itens[0].seg) + 4} layout="none">
        <TextoGancho texto={textos.gancho} topo={420} tamanho={120} saida={f(textos.itens[0].seg) - 6} />
      </Sequence>

      {textos.itens.map((it, i) => {
        const ini = f(it.seg);
        const fim = i < textos.itens.length - 1 ? f(textos.itens[i + 1].seg) : fimItens;
        return (
          <Sequence key={it.rotulo} from={ini} durationInFrames={fim - ini} layout="none">
            <Carta src={imagens[i]} rotulo={it.rotulo} dur={fim - ini} />
          </Sequence>
        );
      })}

      {/* digital + preço + CTA */}
      <Sequence from={fimItens} layout="none">
        <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada>
            <Flutuar amplitude={8}>
              <Imagem src={IMAGENS.kitCompleto} largura={760} altura={570} />
            </Flutuar>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 900, left: 60, right: 60, display: 'flex', justifyContent: 'center'}}>
          <Entrada atraso={6}>
            <div style={estiloTexto(50)}>{textos.digital.texto}</div>
          </Entrada>
        </div>
      </Sequence>
      <Sequence from={f(textos.preco.seg)} layout="none">
        <div style={{position: 'absolute', top: 980, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Preco texto={textos.preco.texto} tamanho={140} />
        </div>
      </Sequence>
      <Sequence from={f(textos.cta.seg)} layout="none">
        <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto={textos.cta.texto} tamanho={56} />
        </div>
      </Sequence>
    </Fundo>
  );
};
