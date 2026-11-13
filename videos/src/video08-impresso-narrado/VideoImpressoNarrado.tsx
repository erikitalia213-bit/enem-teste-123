import React from 'react';
import {AbsoluteFill, Html5Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CTA, Coracoes, Entrada, Flash, Flutuar, Fundo, Imagem, Legenda, Preco, PropsVideo, Selo, TextoGancho, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {Legendas} from '../compartilhado/legendas';
import {FPS, cores, estiloTexto} from '../compartilhado/tema';
import {duracaoFala, frameDaPalavra, trechosLegenda} from '../compartilhado/tempoFala';
import {Cena, RoteiroImpresso} from './roteiros';

export const duracaoImpresso = (r: RoteiroImpresso) => duracaoFala(r, r.folgaFinal ?? 18);

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

const Clipe: React.FC<{cena: Extract<Cena, {tipo: 'clipe'}>; dur: number; punch?: boolean}> = ({cena, dur, punch}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // "punch": entra com zoom forte + tremida nos primeiros frames (prende o olho)
  const sp = punch ? spring({frame, fps, config: {damping: 11, stiffness: 160}}) : 1;
  const z = ((cena.zoom ?? 1.04) + interpolate(frame, [0, dur], [0, 0.06])) * interpolate(sp, [0, 1], [1.4, 1]);
  const treme = punch && frame < 12 ? (12 - frame) * 1.6 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(cena.arquivo)}
        trimBefore={Math.round(cena.de * FPS)}
        playbackRate={cena.velocidade ?? 1}
        volume={cena.volume ?? 0.2}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${Math.sin(frame * 2.3) * treme}px, ${Math.cos(frame * 1.9) * treme}px) scale(${z})`,
          transformOrigin: `50% ${cena.focoY ?? '50%'}`,
          filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
        }}
      />
      <Sombras />
    </AbsoluteFill>
  );
};

/** Páginas reais do kit na frente de um clipe desfocado. */
const Paginas: React.FC<{imagens: string[]; fundo: string; fundoDe: number}> = ({imagens, fundo, fundoDe}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = imagens.length;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(fundo)}
        trimBefore={Math.round(fundoDe * FPS)}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.2)', filter: 'blur(16px) brightness(0.75) saturate(1.15)'}}
      />
      {imagens.map((src, i) => {
        const s = spring({frame: frame - i * 6, fps, config: {damping: 14, stiffness: 120}});
        const l = n === 1 ? 640 : 500;
        const a = Math.round(l * 1.414);
        const x = n === 1 ? (1080 - l) / 2 : i === 0 ? 70 : 510;
        const y = n === 1 ? 480 : i === 0 ? 520 : 600;
        const rot = n === 1 ? -3 : i === 0 ? -8 : 7;
        return (
          <div key={src} style={{position: 'absolute', left: x, top: y, transform: `translateY(${(1 - s) * 900}px) rotate(${rot + (1 - s) * (i ? 20 : -20)}deg)`}}>
            <Flutuar amplitude={8} fase={i * 1.5}>
              <Imagem src={src} largura={l} altura={a} borda={14} raio={6} />
            </Flutuar>
          </div>
        );
      })}
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

/* ---------- gancho forte ---------- */

const HookForte: React.FC<{h: NonNullable<RoteiroImpresso['hookForte']>; dur: number}> = ({h, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sF = spring({frame, fps, config: {damping: 9, stiffness: 220, mass: 0.6}});
  const sL = spring({frame: frame - 7, fps, config: {damping: 12, stiffness: 200}});
  const sD = spring({frame: frame - 13, fps, config: {damping: 7, stiffness: 240, mass: 0.6}});
  const tremeF = frame < 10 ? Math.sin(frame * 2.5) * (10 - frame) * 0.8 : 0;
  const pulso = 1 + 0.06 * Math.max(0, Math.sin((frame - 13) * 0.35));
  const sai = interpolate(frame, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pisca = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.25));
  return (
    <AbsoluteFill style={{opacity: sai}}>
      {/* escurece o topo para o texto ler bem */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,8,34,0.78) 0%, rgba(20,8,34,0.45) 38%, rgba(20,8,34,0) 55%)'}} />
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            ...estiloTexto(62, cores.branco, '#6A1236'),
            padding: '14px 36px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #F0476E, #B0346A)',
            border: `5px solid ${cores.branco}`,
            boxShadow: '0 16px 40px rgba(10,4,26,0.6)',
            transform: `scale(${sF}) rotate(${-3 + tremeF}deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          {h.faixa}
        </div>
        <div style={{...estiloTexto(80), marginTop: 26, transform: `translateY(${(1 - sL) * 40}px)`, opacity: sL}}>{h.linha}</div>
        <div style={{...estiloTexto(170, cores.dourado, cores.roxoProfundo), marginTop: 2, transform: `scale(${interpolate(sD, [0, 1], [0.2, 1]) * pulso}) rotate(-3deg)`}}>
          {h.destaque}
        </div>
      </div>
      {h.selo ? (
        <div
          style={{
            position: 'absolute',
            top: 730,
            left: '50%',
            marginLeft: -190,
            width: 380,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...estiloTexto(40, cores.fundo, '#FFF3C4'),
            textShadow: 'none',
            padding: '8px 18px',
            borderRadius: 12,
            background: cores.dourado,
            border: `3px solid ${cores.branco}`,
            transform: `rotate(-4deg) scale(${interpolate(sD, [0, 1], [0.3, 1])})`,
            opacity: pisca,
          }}
        >
          {h.selo}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- card final forte ---------- */

const Seta: React.FC<{atraso: number; x: number}> = ({atraso, x}) => {
  const frame = useCurrentFrame();
  const y = Math.abs(Math.sin((frame - atraso) * 0.25)) * 26;
  const o = interpolate(frame, [atraso, atraso + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', left: x, top: 1480 + y, fontSize: 64, opacity: o}}>👇</div>;
};

const FinalForte: React.FC<{tDigital: number; tCTA: number}> = ({tDigital, tCTA}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const itens = ['✓ pagamento único', '✓ chega na hora', '✓ sem frete'];
  const tItens = Math.max(8, Math.min(tDigital, 20));
  return (
    <Fundo>
      <Coracoes />
      <div style={{position: 'absolute', top: 270, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Entrada>
          <div
            style={{
              ...estiloTexto(58, cores.branco, '#6A1236'),
              padding: '12px 34px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #F0476E, #B0346A)',
              border: `5px solid ${cores.branco}`,
              transform: 'rotate(-2deg)',
            }}
          >
            🎄 KIT DE NATAL ARMY
          </div>
        </Entrada>
      </div>
      <div style={{position: 'absolute', top: 410, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s}}>
        <Flutuar amplitude={10}>
          <Imagem src={IMAGENS.kitCompleto} largura={860} altura={645} />
        </Flutuar>
      </div>
      <div style={{position: 'absolute', top: 340, left: 800}}>
        <Selo linhas={['acesso', 'imediato']} tamanho={220} atraso={10} />
      </div>
      <div style={{position: 'absolute', top: 1065, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Preco texto="Só R$ 19,90" tamanho={140} atraso={3} />
      </div>
      <div style={{position: 'absolute', top: 1235, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>
        {itens.map((t, i) => (
          <Entrada key={t} atraso={tItens + i * 5}>
            <div style={{...estiloTexto(38), whiteSpace: 'nowrap'}}>{t}</div>
          </Entrada>
        ))}
      </div>
      <Sequence from={Math.min(tCTA, 40)} layout="none">
        <div style={{position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto="TOQUE EM SAIBA MAIS 💜" tamanho={60} />
        </div>
        <Seta atraso={6} x={300} />
        <Seta atraso={10} x={508} />
        <Seta atraso={14} x={716} />
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
            {c.tipo === 'clipe' ? <Clipe cena={c} dur={dur} punch={i === 0 && !!r.hookForte} /> : null}
            {c.tipo === 'folhas' ? <Folhas /> : null}
            {c.tipo === 'paginas' ? <Paginas imagens={c.imagens} fundo={c.fundo} fundoDe={c.fundoDe} /> : null}
            {c.tipo === 'final' && r.finalForte ? (
              <FinalForte tDigital={frameDaPalavra(r, r.palavraDigital) - ini} tCTA={frameDaPalavra(r, r.palavraCTA) - ini} />
            ) : null}
            {c.tipo === 'final' && !r.finalForte ? (
              <Final tDigital={frameDaPalavra(r, r.palavraDigital) - ini} tCTA={frameDaPalavra(r, r.palavraCTA) - ini} />
            ) : null}
            {'rotulo' in c && c.rotulo ? <Legenda texto={c.rotulo} topo={300} /> : null}
          </Sequence>
        );
      })}

      {/* gancho grande */}
      <Sequence durationInFrames={inicios[1] + 4} layout="none">
        {r.hookForte ? (
          <HookForte h={r.hookForte} dur={inicios[1] + 4} />
        ) : (
          <TextoGancho texto={r.gancho} topo={290} tamanho={88} saida={inicios[1] - 6} />
        )}
      </Sequence>

      {inicios.slice(1).map((f, i) => (
        <Flash key={i} em={f} duracao={i + 1 === iFinal ? 10 : 5} />
      ))}

      <Legendas
        trechos={trechosLegenda(r).filter((t) => (!r.finalForte || iFinal < 0 || t.emFrame < inicios[iFinal]) && (!r.hookForte || t.emFrame >= inicios[1] - 6))}
        velocidade={r.velocidade}
        ativa
      />
    </AbsoluteFill>
  );
};
