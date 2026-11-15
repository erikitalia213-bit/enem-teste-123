import React from 'react';
import {AbsoluteFill, Html5Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Coracoes, Entrada, Flash, Flutuar, Fundo, Imagem, Preco, PropsVideo, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas} from '../compartilhado/legendas';
import {FPS, cores, estiloTexto, fonte} from '../compartilhado/tema';
import {Fala, duracaoFala, frameDaPalavra, trechosLegenda} from '../compartilhado/tempoFala';
import {Clipe, Paginas} from '../video08-impresso-narrado/VideoImpressoNarrado';

/*
 * VSL de demonstração para a landing page: a voz vai listando o que vem no
 * kit, cada item com uma cena (vídeos autorizados + páginas reais do kit),
 * legenda grande em caixa branca e, no fim, o botão "QUERO MEU KIT".
 */

const T = 'clipes/tiktok/';

export const FALA_VSL: Fala = {
  duracaoAudio: 39.97,
  velocidade: 1.12,
  texto:
    'ARMY, imagina ter um Natal inteirinho do BTS pra imprimir em casa? Olha só o que vem nesse kit. São 80 desenhos pra colorir… um journal criativo pra guardar suas memórias de dezembro… 1.500 photocards pra imprimir, recortar e colecionar… e 7 calendários 3D de 2027 pra montar e deixar no seu cantinho. E ainda vem 4 bônus: diário criativo extra, wallpapers de Natal, cartinhas e um desafio ARMY de 7 dias. É tudo digital: você baixa e imprime hoje mesmo, sem frete. Tudo por R$ 19,90. Clica no botão Quero meu kit aqui embaixo e garante o seu!',
  silencios: [
    [0.475, 0.735], [1.765, 1.904], [2.032, 2.188], [4.364, 4.853], [5.792, 5.915], [6.182, 6.673],
    [6.979, 7.154], [8.367, 8.992], [11.854, 12.401], [15.571, 15.712], [16.348, 16.874], [21.619, 22.113],
    [22.611, 22.775], [23.575, 23.98], [25.335, 25.628], [26.868, 27.127], [27.79, 27.92], [29.851, 29.976],
    [29.98, 30.437], [30.51, 30.7], [31.402, 31.763], [32.932, 33.066], [34.582, 35.02], [36.552, 36.982],
    [39.759, 39.967],
  ],
};

export const duracaoVSL = () => duracaoFala(FALA_VSL, 45);

const BONUS = [
  {emoji: '📔', titulo: 'Diário Criativo extra', sub: '10 páginas'},
  {emoji: '📱', titulo: '12 wallpapers de Natal', sub: 'pro seu celular'},
  {emoji: '💌', titulo: 'Cartinhas para o BTS', sub: '12 modelos'},
  {emoji: '🎄', titulo: 'Desafio ARMY', sub: '7 dias de atividades'},
];

/** Os 4 bônus entrando um a um, sobre um clipe desfocado. */
const Bonus: React.FC<{tempos: number[]}> = ({tempos}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(T + 'diario-diy.mp4')}
        trimBefore={Math.round(40 * FPS)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', filter: 'blur(16px) brightness(0.6) saturate(1.1)'}}
      />
      <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada>
          <div
            style={{
              ...estiloTexto(66, cores.branco, '#6A1236'),
              padding: '12px 34px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #F0476E, #B0346A)',
              border: `5px solid ${cores.branco}`,
            }}
          >
            + 4 BÔNUS DE PRESENTE 🎁
          </div>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 470, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 26}}>
        {BONUS.map((b, i) => {
          const s = spring({frame: frame - tempos[i], fps, config: {damping: 12, stiffness: 170}});
          return (
            <div
              key={b.titulo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '22px 30px',
                borderRadius: 26,
                background: 'rgba(255,255,255,0.96)',
                boxShadow: '0 14px 34px rgba(10,4,26,0.45)',
                transform: `translateX(${(1 - s) * (i % 2 ? 500 : -500)}px)`,
                opacity: s,
              }}
            >
              <div style={{fontSize: 74, fontFamily: fonte}}>{b.emoji}</div>
              <div style={{fontFamily: fonte}}>
                <div style={{fontWeight: 700, fontSize: 48, color: cores.roxoProfundo, lineHeight: 1.1}}>{b.titulo}</div>
                <div style={{fontWeight: 500, fontSize: 34, color: cores.roxo}}>{b.sub}</div>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  fontFamily: fonte,
                  fontWeight: 700,
                  fontSize: 30,
                  color: cores.fundo,
                  background: cores.dourado,
                  padding: '6px 16px',
                  borderRadius: 999,
                }}
              >
                GRÁTIS
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Botão igual ao da landing page. */
const BotaoQueroMeuKit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 10, stiffness: 160}});
  const pulso = 1 + 0.045 * Math.sin(frame * 0.24);
  const brilhoX = interpolate(frame % 45, [0, 45], [-40, 140]);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '30px 70px',
        borderRadius: 999,
        background: 'linear-gradient(180deg, #B05BD6 0%, #7B3FB8 100%)',
        border: `5px solid ${cores.branco}`,
        boxShadow: '0 18px 45px rgba(10,4,26,0.6), 0 0 50px rgba(182,156,255,0.55)',
        fontFamily: fonte,
        fontWeight: 700,
        fontSize: 64,
        letterSpacing: 1,
        color: cores.branco,
        transform: `scale(${interpolate(s, [0, 1], [0.4, 1]) * pulso})`,
        opacity: s,
        whiteSpace: 'nowrap',
      }}
    >
      QUERO MEU KIT ✦
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${brilhoX}%`,
          width: '22%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />
    </div>
  );
};

const Seta: React.FC<{atraso: number; x: number}> = ({atraso, x}) => {
  const frame = useCurrentFrame();
  const y = Math.abs(Math.sin((frame - atraso) * 0.25)) * 26;
  const o = interpolate(frame, [atraso, atraso + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: x, top: 1500 + y, fontSize: 70, opacity: o}}>👇</div>;
};

const Final: React.FC<{tBotao: number}> = ({tBotao}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  return (
    <Fundo>
      <Coracoes />
      <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada>
          <div style={estiloTexto(78)}>Kit de Natal ARMY ✦</div>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s}}>
        <Flutuar amplitude={10}>
          <Imagem src={IMAGENS.kitCompleto} largura={880} altura={660} />
        </Flutuar>
      </div>
      <div style={{position: 'absolute', top: 1090, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Preco texto="Só R$ 19,90" tamanho={130} atraso={2} />
      </div>
      <div style={{position: 'absolute', top: 1245, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada atraso={8}>
          <div style={estiloTexto(40)}>pagamento único · acesso imediato · sem frete</div>
        </Entrada>
      </div>
      <Sequence from={tBotao} layout="none">
        <div style={{position: 'absolute', top: 1335, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <BotaoQueroMeuKit />
        </div>
        <Seta atraso={6} x={300} />
        <Seta atraso={10} x={505} />
        <Seta atraso={14} x={710} />
      </Sequence>
    </Fundo>
  );
};

export const VideoVSL: React.FC<PropsVideo> = ({temTrilha}) => {
  const {durationInFrames} = useVideoConfig();
  const f = FALA_VSL;
  const t = (p: string, oc?: number) => Math.max(0, frameDaPalavra(f, p, oc) - 4);
  const cenas: {ini: number; el: (dur: number) => React.ReactNode}[] = [
    {ini: 0, el: (d) => <Clipe cena={{tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 1.0, velocidade: 1.15, volume: 0}} dur={d} punch />},
    {ini: t('olha'), el: (d) => <Clipe cena={{tipo: 'clipe', arquivo: T + 'caixa-photocards.mp4', de: 0, volume: 0}} dur={d} />},
    {ini: t('são'), el: () => <Paginas imagens={[IMAGENS.colorir]} fundo={T + 'livro-colorir.mp4'} fundoDe={12} />},
    {ini: t('journal'), el: () => <Paginas imagens={[IMAGENS.journal, IMAGENS.diarioMusicas]} fundo={T + 'diario-diy.mp4'} fundoDe={30} />},
    {ini: t('1500'), el: (d) => <Clipe cena={{tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 6, volume: 0}} dur={d} />},
    {ini: t('calendários'), el: () => <Paginas imagens={[IMAGENS.calendario]} fundo={T + 'caixa-photocards.mp4'} fundoDe={18} />},
    {
      ini: t('ainda'),
      el: () => {
        const base = t('ainda');
        return <Bonus tempos={['diário', 'wallpapers', 'cartinhas', 'desafio'].map((p) => t(p) - base)} />;
      },
    },
    {ini: t('digital'), el: (d) => <Clipe cena={{tipo: 'clipe', arquivo: T + 'caixa-photocards.mp4', de: 16, volume: 0}} dur={d} />},
    {ini: t('tudo'), el: () => <Final tBotao={t('clica') - t('tudo')} />},
  ];
  const tFinal = t('tudo');

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Trilha ativa={temTrilha} volume={0.15} />
      <Html5Audio src={staticFile('narracao/vsl.mp3')} playbackRate={f.velocidade} />
      {cenas.map((c, i) => {
        const fim = i + 1 < cenas.length ? cenas[i + 1].ini : durationInFrames;
        const dur = fim - c.ini;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={c.ini} durationInFrames={dur}>
            {c.el(dur)}
          </Sequence>
        );
      })}
      {cenas.slice(1).map((c, i) => (
        <Flash key={i} em={c.ini} duracao={i + 2 === cenas.length ? 10 : 4} />
      ))}
      {/* legenda branca estilo "demonstração", no centro-baixo; some no card final */}
      <Legendas
        trechos={trechosLegenda(f).filter((x) => x.emFrame < tFinal)}
        velocidade={f.velocidade}
        ativa
        estilo="branco"
        base={1480}
      />
    </AbsoluteFill>
  );
};
