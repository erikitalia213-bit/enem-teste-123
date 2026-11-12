import React from 'react';
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  Html5Audio,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TRILHA} from './imagens';
import {ALTURA, LARGURA, LIMITE_INFERIOR, cores, estiloTexto, fonte} from './tema';

/* ------------------------------------------------------------------ */
/* Áudio opcional                                                      */
/* ------------------------------------------------------------------ */

export type PropsVideo = {
  temTrilha: boolean;
  /** Arquivo de narração dentro de public/ (opcional). */
  narracao?: string;
  temNarracao?: boolean;
};

const existe = async (arquivo: string) => {
  try {
    const res = await fetch(staticFile(arquivo), {method: 'HEAD'});
    return res.ok && !(res.headers.get('content-type') ?? '').includes('text/html');
  } catch {
    return false;
  }
};

/** Confere se public/trilha.mp3 e a narração existem antes de montar o vídeo. */
export const verificarTrilha: CalculateMetadataFunction<PropsVideo> = async ({props}) => {
  const temTrilha = await existe(TRILHA);
  const temNarracao = props.narracao ? await existe(props.narracao) : false;
  return {props: {...props, temTrilha, temNarracao}};
};

/** Música de fundo. Com narração, fica mais baixa para a voz aparecer. */
export const Trilha: React.FC<{ativa: boolean; volume?: number}> = ({ativa, volume = 0.8}) => {
  const {durationInFrames: d} = useVideoConfig();
  if (!ativa) return null;
  return (
    <Html5Audio
      src={staticFile(TRILHA)}
      volume={(f) =>
        interpolate(f, [0, 12, d - 20, d], [0, volume, volume, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};

/** Um trecho da narração: de/ate em segundos no arquivo original, emFrame no vídeo. */
export type TrechoNarracao = {de: number; ate: number; emFrame: number; texto?: string};

/** Duração em frames de um trecho já acelerado. */
export const framesDoTrecho = (t: TrechoNarracao, velocidade: number, fps = 30) =>
  Math.ceil(((t.ate - t.de) * fps) / velocidade);

/**
 * Toca cada frase da narração no frame certo. Assim dá para encurtar pausas e
 * acelerar levemente a voz (o tom é preservado) sem editar o MP3.
 */
export const Narracao: React.FC<{
  arquivo: string;
  ativa: boolean;
  trechos: TrechoNarracao[];
  velocidade?: number;
  volume?: number;
}> = ({arquivo, ativa, trechos, velocidade = 1, volume = 1}) => {
  const {fps} = useVideoConfig();
  if (!ativa) return null;
  return (
    <>
      {trechos.map((t) => (
        <Sequence
          key={t.de}
          from={t.emFrame}
          durationInFrames={framesDoTrecho(t, velocidade, fps) + 2}
          layout="none"
          name={t.texto ?? 'narração'}
        >
          <Html5Audio
            src={staticFile(arquivo)}
            trimBefore={Math.round(t.de * fps)}
            durationInFrames={Math.round((t.ate - t.de) * fps)}
            playbackRate={velocidade}
            volume={volume}
          />
        </Sequence>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Fundo: gradiente roxo + bokeh + estrelas + neve                     */
/* ------------------------------------------------------------------ */

const Bokeh: React.FC<{quantidade?: number}> = ({quantidade = 16}) => {
  const frame = useCurrentFrame();
  const paleta = [cores.lavanda, cores.dourado, cores.roxo, '#FFD9F2'];
  return (
    <AbsoluteFill>
      {new Array(quantidade).fill(0).map((_, i) => {
        const x = random(`bx${i}`) * LARGURA;
        const y = random(`by${i}`) * ALTURA;
        const tam = 70 + random(`bs${i}`) * 200;
        const fase = random(`bf${i}`) * Math.PI * 2;
        const brilho = 0.1 + 0.18 * (0.5 + 0.5 * Math.sin(frame * 0.04 + fase));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - tam / 2 + Math.sin(frame * 0.01 + fase) * 30,
              top: y - tam / 2 + Math.cos(frame * 0.012 + fase) * 24,
              width: tam,
              height: tam,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${paleta[i % paleta.length]} 0%, transparent 70%)`,
              opacity: brilho,
              filter: `blur(${6 + random(`bb${i}`) * 14}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Estrelas: React.FC<{quantidade?: number}> = ({quantidade = 26}) => {
  const frame = useCurrentFrame();
  const corEstrela = [cores.branco, cores.dourado, cores.lavanda];
  return (
    <AbsoluteFill>
      {new Array(quantidade).fill(0).map((_, i) => {
        const fase = random(`ef${i}`) * Math.PI * 2;
        const vel = 0.06 + random(`ev${i}`) * 0.1;
        const pisca = Math.pow(0.5 + 0.5 * Math.sin(frame * vel + fase), 3);
        const tam = 20 + random(`es${i}`) * 40;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: random(`ex${i}`) * LARGURA,
              top: random(`ey${i}`) * ALTURA,
              fontSize: tam,
              color: corEstrela[i % 3],
              opacity: 0.15 + 0.85 * pisca,
              transform: `scale(${0.6 + 0.6 * pisca}) rotate(${frame * 0.5 + i * 20}deg)`,
              textShadow: `0 0 ${tam * 0.6}px ${cores.dourado}`,
              fontFamily: fonte,
            }}
          >
            {i % 2 === 0 ? '✦' : '✧'}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Neve: React.FC<{quantidade?: number}> = ({quantidade = 70}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(quantidade).fill(0).map((_, i) => {
        const vel = 1.2 + random(`nv${i}`) * 2.6;
        const tam = 3 + random(`ns${i}`) * 8;
        const y0 = random(`ny${i}`) * (ALTURA + 40);
        const y = ((y0 + frame * vel) % (ALTURA + 40)) - 20;
        const x = random(`nx${i}`) * LARGURA + Math.sin(frame * 0.03 + i) * 22;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: tam,
              height: tam,
              borderRadius: '50%',
              background: i % 5 === 0 ? cores.dourado : cores.branco,
              opacity: 0.35 + random(`no${i}`) * 0.5,
              boxShadow: `0 0 ${tam * 2}px rgba(255,255,255,0.8)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Fundo: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 35%, #3B2768 0%, ${cores.fundo} 58%, #120A22 100%)`,
      overflow: 'hidden',
    }}
  >
    <Bokeh />
    <Estrelas />
    <Neve />
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Movimento                                                           */
/* ------------------------------------------------------------------ */

/** Mola de entrada (0 → 1) a partir de `atraso` frames. */
export const useEntrada = (atraso = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - atraso, fps, config: {damping, stiffness: 140, mass: 0.8}});
};

/** Entrada com escala + fade. */
export const Entrada: React.FC<{
  atraso?: number;
  de?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({atraso = 0, de = 0.55, children, style}) => {
  const p = useEntrada(atraso);
  return (
    <div
      style={{
        transform: `scale(${interpolate(p, [0, 1], [de, 1])})`,
        opacity: interpolate(p, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** "Flutuar" contínuo e suave. */
export const Flutuar: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  fase?: number;
  style?: React.CSSProperties;
}> = ({children, amplitude = 14, fase = 0, style}) => {
  const frame = useCurrentFrame();
  const y = Math.sin(frame * 0.06 + fase) * amplitude;
  const r = Math.sin(frame * 0.045 + fase) * 1.2;
  return <div style={{transform: `translateY(${y}px) rotate(${r}deg)`, ...style}}>{children}</div>;
};

/* ------------------------------------------------------------------ */
/* Imagem com moldura                                                  */
/* ------------------------------------------------------------------ */

export const Imagem: React.FC<{
  src: string;
  largura: number;
  altura: number;
  ajuste?: 'cover' | 'contain';
  borda?: number;
  raio?: number;
  style?: React.CSSProperties;
}> = ({src, largura, altura, ajuste = 'cover', borda = 10, raio = 26, style}) => (
  <div
    style={{
      width: largura,
      height: altura,
      borderRadius: raio,
      overflow: 'hidden',
      border: `${borda}px solid ${cores.branco}`,
      background: cores.branco,
      boxShadow: `0 30px 70px rgba(10,4,26,0.6), 0 0 60px rgba(182,156,255,0.45)`,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: ajuste}} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Textos                                                              */
/* ------------------------------------------------------------------ */

/** Gancho grande: palavras entram uma a uma com "pop". */
export const TextoGancho: React.FC<{
  texto: string;
  topo?: number;
  tamanho?: number;
  largura?: number;
  atraso?: number;
  saida?: number; // frame em que começa a sair (opcional)
}> = ({texto, topo = 290, tamanho = 96, largura = 940, atraso = 0, saida}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palavras = texto.split(' ');
  const sair =
    saida === undefined
      ? 0
      : interpolate(frame, [saida, saida + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  return (
    <div
      style={{
        position: 'absolute',
        top: topo,
        left: (LARGURA - largura) / 2,
        width: largura,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: tamanho * 0.28,
        opacity: 1 - sair,
        transform: `scale(${1 - sair * 0.15})`,
      }}
    >
      {palavras.map((p, i) => {
        const s = spring({
          frame: frame - atraso - i * 3,
          fps,
          config: {damping: 10, stiffness: 180, mass: 0.6},
        });
        return (
          <span
            key={i}
            style={{
              ...estiloTexto(tamanho),
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.3, 1])})`,
              opacity: interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

/** Legenda curta em "pílula" (troca com pop quando o texto muda). */
export const Legenda: React.FC<{
  texto: string;
  atraso?: number;
  topo?: number;
  tamanho?: number;
}> = ({texto, atraso = 0, topo = 1430, tamanho = 58}) => {
  const p = useEntrada(atraso, 11);
  return (
    <div
      style={{
        position: 'absolute',
        top: topo,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          ...estiloTexto(tamanho),
          padding: '16px 38px',
          borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(123,92,214,0.92), rgba(182,156,255,0.92))',
          border: `4px solid ${cores.branco}`,
          boxShadow: '0 16px 40px rgba(10,4,26,0.55)',
          transform: `scale(${interpolate(p, [0, 1], [0.5, 1])})`,
          opacity: interpolate(p, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'}),
          whiteSpace: 'nowrap',
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/** Preço pulsando em dourado. */
export const Preco: React.FC<{texto: string; tamanho?: number; atraso?: number}> = ({
  texto,
  tamanho = 128,
  atraso = 0,
}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(atraso, 9);
  const pulso = 1 + 0.055 * Math.max(0, Math.sin((frame - atraso) * 0.28));
  return (
    <div
      style={{
        ...estiloTexto(tamanho, cores.dourado, cores.roxoProfundo),
        transform: `scale(${interpolate(p, [0, 1], [0.2, 1]) * pulso}) rotate(-2deg)`,
        opacity: interpolate(p, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </div>
  );
};

/** Botão de chamada para ação, dourado, com brilho passando. */
export const CTA: React.FC<{texto: string; atraso?: number; tamanho?: number}> = ({
  texto,
  atraso = 0,
  tamanho = 50,
}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(atraso, 11);
  const pulso = 1 + 0.035 * Math.sin((frame - atraso) * 0.22);
  const brilhoX = interpolate((frame - atraso) % 45, [0, 45], [-40, 140]);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: `${tamanho * 0.5}px ${tamanho * 0.9}px`,
        borderRadius: 999,
        background: `linear-gradient(180deg, #FFE39A 0%, ${cores.dourado} 55%, #E0A93E 100%)`,
        border: `5px solid ${cores.branco}`,
        boxShadow: `0 18px 45px rgba(10,4,26,0.6), 0 0 50px rgba(243,201,105,0.55)`,
        fontFamily: fonte,
        fontWeight: 700,
        fontSize: tamanho,
        color: cores.fundo,
        textAlign: 'center',
        lineHeight: 1.15,
        whiteSpace: 'pre-line', // use \n no texto para quebrar a linha
        transform: `scale(${interpolate(p, [0, 1], [0.4, 1]) * pulso})`,
        opacity: interpolate(p, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
        maxWidth: 940,
      }}
    >
      {texto}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${brilhoX}%`,
          width: '22%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />
    </div>
  );
};

/** Selo circular serrilhado (ex.: "acesso imediato"). */
export const Selo: React.FC<{linhas: string[]; tamanho?: number; atraso?: number}> = ({
  linhas,
  tamanho = 250,
  atraso = 0,
}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(atraso, 8);
  const pontas = 22;
  const poligono = new Array(pontas * 2)
    .fill(0)
    .map((_, i) => {
      const a = (i / (pontas * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? 50 : 45;
      return `${50 + Math.cos(a) * r}% ${50 + Math.sin(a) * r}%`;
    })
    .join(', ');
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        position: 'relative',
        transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-90, -10])}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `polygon(${poligono})`,
          background: `linear-gradient(135deg, #FFE39A, ${cores.dourado}, #E0A93E)`,
          transform: `rotate(${frame * 0.8}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: tamanho * 0.1,
          borderRadius: '50%',
          border: `4px dashed ${cores.roxoProfundo}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonte,
          fontWeight: 700,
          color: cores.fundo,
          fontSize: tamanho * 0.13,
          lineHeight: 1.05,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        <span style={{fontSize: tamanho * 0.12}}>✦</span>
        {linhas.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
};

/** Número subindo de 0 até `ate`, formatado em pt-BR (1.500). */
export const Contador: React.FC<{
  ate: number;
  inicio?: number;
  duracao?: number;
  prefixo?: string;
  style?: React.CSSProperties;
}> = ({ate, inicio = 0, duracao = 24, prefixo = '', style}) => {
  const frame = useCurrentFrame();
  const v = Math.round(
    interpolate(frame, [inicio, inicio + duracao], [0, ate], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }),
  );
  const formatado = String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <span style={style}>
      {prefixo}
      {formatado}
    </span>
  );
};

/** Corações 💜 subindo (para as cenas finais). */
export const Coracoes: React.FC<{quantidade?: number}> = ({quantidade = 14}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {new Array(quantidade).fill(0).map((_, i) => {
        const atraso = random(`ca${i}`) * 60;
        const vida = 70 + random(`cv${i}`) * 40;
        const t = ((frame - atraso + vida * 10) % vida) / vida;
        const visivel = frame >= atraso;
        const x = random(`cx${i}`) * LARGURA + Math.sin(t * 6 + i) * 30;
        const y = LIMITE_INFERIOR + 120 - t * 1300;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize: 40 + random(`cs${i}`) * 40,
              opacity: visivel ? interpolate(t, [0, 0.15, 0.75, 1], [0, 0.9, 0.7, 0]) : 0,
              transform: `scale(${0.7 + t * 0.5})`,
              fontFamily: fonte,
            }}
          >
            💜
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Clarão rápido para marcar cortes. */
export const Flash: React.FC<{em: number; duracao?: number}> = ({em, duracao = 8}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [em, em + 1, em + duracao], [0, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{background: cores.branco, opacity: o, pointerEvents: 'none'}} />;
};

/** Faixa pequena no topo da área segura (ex.: "Meu Natal ARMY ✦"). */
export const Etiqueta: React.FC<{texto: string; topo?: number; atraso?: number}> = ({
  texto,
  topo = 290,
  atraso = 0,
}) => (
  <div style={{position: 'absolute', top: topo, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
    <Entrada atraso={atraso}>
      <div style={{...estiloTexto(62)}}>{texto}</div>
    </Entrada>
  </div>
);
