import React from 'react';
import {AbsoluteFill, Html5Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CTA, Coracoes, Entrada, Flash, Flutuar, Fundo, Imagem, Legenda, Preco, PropsVideo, TextoGancho, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas} from '../compartilhado/legendas';
import {FPS, estiloTexto} from '../compartilhado/tema';
import {duracaoFala, frameDaPalavra, trechosLegenda} from '../compartilhado/tempoFala';
import {Cena, RoteiroImpresso} from './roteiros';

export const duracaoImpresso = (r: RoteiroImpresso) => duracaoFala(r, 18);

const Sombras: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'rgba(255,170,90,0.06)', mixBlendMode: 'overlay'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,8,30,0.45) 100%)'}} />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(30,20,51,0.55) 0%, rgba(30,20,51,0) 26%, rgba(30,20,51,0) 70%, rgba(30,20,51,0.6) 100%)',
      }}
    />
  </>
);

const Clipe: React.FC<{cena: Extract<Cena, {tipo: 'clipe'}>; dur: number}> = ({cena, dur}) => {
  const frame = useCurrentFrame();
  const z = (cena.zoom ?? 1.04) + interpolate(frame, [0, dur], [0, 0.06]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(cena.arquivo)}
        trimBefore={Math.round(cena.de * FPS)}
        playbackRate={cena.velocidade ?? 1}
        volume={0.2}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${z})`,
          transformOrigin: `50% ${cena.focoY ?? '50%'}`,
          filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
        }}
      />
      <Sombras />
    </AbsoluteFill>
  );
};

/** Folhas de photocards do kit em cima da mesa (fundo do clipe desfocado). */
const Folhas: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const s2 = spring({frame: frame - 6, fps, config: {damping: 14, stiffness: 120}});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile('clipes/impresso/g1.mp4')}
        trimBefore={Math.round(0.2 * FPS)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)', filter: 'blur(14px) brightness(0.8) saturate(1.1)'}}
      />
      <div style={{position: 'absolute', left: 90, top: 520, transform: `translateY(${(1 - s1) * 900}px) rotate(${-8 + (1 - s1) * -20}deg)`}}>
        <Flutuar amplitude={8}>
          <Imagem src={IMAGENS.cartoes} largura={520} altura={735} borda={14} raio={6} />
        </Flutuar>
      </div>
      <div style={{position: 'absolute', left: 470, top: 600, transform: `translateY(${(1 - s2) * 900}px) rotate(${7 + (1 - s2) * 20}deg)`}}>
        <Flutuar amplitude={8} fase={1.5}>
          <Imagem src={IMAGENS.tags} largura={520} altura={735} borda={14} raio={6} />
        </Flutuar>
      </div>
      <Sombras />
    </AbsoluteFill>
  );
};

const Final: React.FC<{tDigital: number; tCTA: number}> = ({tDigital, tCTA}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  return (
    <Fundo>
      <Coracoes />
      <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada>
          <div style={estiloTexto(80)}>Kit de Natal ARMY ✦</div>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s}}>
        <Flutuar amplitude={10}>
          <Imagem src={IMAGENS.kitCompleto} largura={940} altura={705} />
        </Flutuar>
      </div>
      <div style={{position: 'absolute', top: 1125, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Preco texto="Só R$ 19,90" tamanho={130} atraso={4} />
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
    </Fundo>
  );
};

export const VideoImpressoNarrado: React.FC<PropsVideo & {roteiro: RoteiroImpresso}> = ({roteiro: r, temTrilha}) => {
  const {durationInFrames} = useVideoConfig();
  const inicios = r.cenas.map((c, i) => (i === 0 || !('palavra' in c) || !c.palavra ? 0 : Math.max(0, frameDaPalavra(r, c.palavra, c.ocorrencia) - 4)));
  const fimDe = (i: number) => (i + 1 < inicios.length ? inicios[i + 1] : durationInFrames);
  const iFinal = r.cenas.findIndex((c) => c.tipo === 'final');

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Trilha ativa={temTrilha} volume={0.15} />
      <Html5Audio src={staticFile(r.audio)} playbackRate={r.velocidade} />

      {r.cenas.map((c, i) => {
        const ini = inicios[i];
        const dur = fimDe(i) - ini;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={ini} durationInFrames={dur}>
            {c.tipo === 'clipe' ? <Clipe cena={c} dur={dur} /> : null}
            {c.tipo === 'folhas' ? <Folhas /> : null}
            {c.tipo === 'final' ? (
              <Final tDigital={frameDaPalavra(r, r.palavraDigital) - ini} tCTA={frameDaPalavra(r, r.palavraCTA) - ini} />
            ) : null}
            {'rotulo' in c && c.rotulo ? <Legenda texto={c.rotulo} topo={300} /> : null}
          </Sequence>
        );
      })}

      {/* gancho grande */}
      <Sequence durationInFrames={inicios[1] + 4} layout="none">
        <TextoGancho texto={r.gancho} topo={290} tamanho={88} saida={inicios[1] - 6} />
      </Sequence>

      {inicios.slice(1).map((f, i) => (
        <Flash key={i} em={f} duracao={i + 1 === iFinal ? 10 : 5} />
      ))}

      <Legendas trechos={trechosLegenda(r)} velocidade={r.velocidade} ativa />
    </AbsoluteFill>
  );
};
