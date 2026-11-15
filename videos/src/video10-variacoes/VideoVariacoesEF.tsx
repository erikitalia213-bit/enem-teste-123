import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Entrada, Flash, Flutuar, Fundo, Imagem, Legenda, PropsVideo, TextoGancho, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {EstiloLegenda, Legendas} from '../compartilhado/legendas';
import {cores, estiloTexto} from '../compartilhado/tema';
import {Fala, duracaoFala, frameDaPalavra, palavrasComTempo, trechosLegenda} from '../compartilhado/tempoFala';
import {Livro} from '../video01-folheie/Video01Narrado';
import {Clipe, FinalForte, Paginas} from '../video08-impresso-narrado/VideoImpressoNarrado';

/*
 * Variações E e F do video 01 com mudanças além da narração:
 * gancho visual, ordem das cenas, ritmo, ângulo, formato e estilo de legenda.
 * Enquanto não houver MP3, os tempos são estimados pelo texto (silencios = []).
 * Quando a narração chegar: preencha `audio`, `duracaoAudio` e `silencios`.
 */

export type VariacaoEF = Fala & {
  id: string;
  arquivo: string;
  audio?: string;
  gancho: string;
  estiloLegenda: EstiloLegenda;
  /** Texto do selo da cena "presente". */
  seloPresente?: string;
  /** Mostra legenda também durante o gancho (padrão: não). */
  legendaNoGancho?: boolean;
  /** Cada cena começa quando a voz fala a palavra (a primeira começa em 0). */
  cenas: (CenaEF & {palavra?: string; ocorrencia?: number; rotulo?: string})[];
};

type CenaEF =
  | {tipo: 'clipe'; arquivo: string; de: number; velocidade?: number; zoom?: number; focoY?: string; punch?: boolean}
  | {tipo: 'paginas'; imagens: string[]; fundo: string; fundoDe: number}
  | {tipo: 'livro'; paginas: {palavra?: string; ocorrencia?: number}[]}
  | {tipo: 'presente'}
  | {tipo: 'final'};

const T = 'clipes/tiktok/';
const I = 'clipes/impresso/';

/* ---------------- variação E: presente para a amiga ---------------- */
export const VARIACAO_E: VariacaoEF = {
  id: 'Variacao-E-Presente',
  arquivo: 'natal-army-01-variacao-e-presente',
  duracaoAudio: 26,
  velocidade: 1.15,
  silencios: [],
  texto:
    'Se você é ARMY e ainda não tem isso, seu Natal tá incompleto. É um kit de Natal pra imprimir em casa, com 1.500 photocards, 80 desenhos pra colorir, diários e 7 calendários 3D de 2027. E o melhor: dá pra imprimir um pra você e outro pra presentear sua amiga ARMY. É digital, então chega na hora, sem frete. Tudo por R$ 19,90. Toca em Saiba mais e garante o seu!',
  gancho: 'Se você é ARMY e ainda não tem isso, seu Natal tá incompleto 💜',
  estiloLegenda: 'roxo',
  cenas: [
    // 1) Gancho visual novo: photocards na mão, com zoom de impacto
    {tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 1.0, velocidade: 1.2, punch: true},
    // 2) Livro folheando, com os photocards primeiro
    {
      tipo: 'livro',
      palavra: 'kit',
      paginas: [{}, {palavra: 'imprimir'}, {palavra: '1500'}, {palavra: '80'}, {palavra: 'diários'}, {palavra: 'calendários'}],
    },
    // 3) Ângulo presente
    {tipo: 'presente', palavra: 'melhor'},
    {tipo: 'clipe', palavra: 'digital', arquivo: T + 'photocards-camisa.mp4', de: 6, rotulo: 'Digital: chega na hora ⚡'},
    {tipo: 'final', palavra: 'tudo'},
  ],
};

/* ---------------- variação F: pais (presente para a filha) ---------------- */
export const VARIACAO_F: VariacaoEF = {
  id: 'Variacao-F-Pais',
  arquivo: 'natal-army-01-variacao-f-pais',
  duracaoAudio: 28,
  velocidade: 1.12,
  silencios: [],
  texto:
    'Se sua filha é ARMY, esse é o presente de Natal que ela vai amar. Um kit pra imprimir em casa, com 1.500 photocards, 80 desenhos pra colorir, diários e 7 calendários 3D de 2027. Ela vai passar o Natal criando, colorindo e colecionando, longe do celular. É digital: você compra hoje e já imprime, sem frete. Tudo por R$ 19,90. Toca em Saiba mais e garanta o presente dela!',
  gancho: 'Se sua filha é ARMY, esse é o presente de Natal que ela vai amar 🎁',
  estiloLegenda: 'branco',
  cenas: [
    // 1) Gancho visual novo: o kit como presente (sem a capa dos membros)
    {tipo: 'presente'},
    {tipo: 'clipe', palavra: '1500', arquivo: T + 'photocards-camisa.mp4', de: 6, rotulo: '1.500 photocards'},
    {tipo: 'paginas', palavra: '80', imagens: [IMAGENS.colorir], fundo: T + 'livro-colorir.mp4', fundoDe: 12, rotulo: '80 desenhos pra colorir'},
    {tipo: 'paginas', palavra: 'diários', imagens: [IMAGENS.journal, IMAGENS.diarioMusicas], fundo: T + 'diario-diy.mp4', fundoDe: 30, rotulo: 'Diários'},
    {tipo: 'paginas', palavra: 'calendários', imagens: [IMAGENS.calendario], fundo: T + 'caixa-photocards.mp4', fundoDe: 18, rotulo: '7 calendários 3D 2027'},
    // 2) "Longe do celular": mãos colorindo e montando o calendário
    {tipo: 'clipe', palavra: 'ela', ocorrencia: 2, arquivo: I + 'g2.mp4', de: 2.0, rotulo: 'Natal longe do celular 📵✨'},
    {tipo: 'clipe', palavra: 'colecionando', arquivo: I + 'calendario.mp4', de: 0.8, rotulo: 'criando e colecionando 💜'},
    {tipo: 'clipe', palavra: 'digital', arquivo: T + 'caixa-photocards.mp4', de: 16, rotulo: 'Compra hoje, imprime hoje ⚡'},
    {tipo: 'final', palavra: 'tudo'},
  ],
};

/* ---------- variações visuais do video 01 com a MESMA narração (vencedora) ---------- */
const FALA_VIDEO01: Fala = {
  duracaoAudio: 31.45,
  velocidade: 1.12,
  texto:
    'Se você é ARMY e ainda não tem isso, seu Natal tá incompleto. Todo Natal é igual: merch cara, frete que atrasa, e o presente fica pra depois. Mas eu descobri um jeito diferente… um kit de Natal ARMY pra imprimir em casa, hoje mesmo. São 1.500 photocards, 80 desenhos pra colorir, diários e 7 calendários 3D de 2027. Tudo por R$ 19,90. É digital, então não depende de frete nenhum. Toca em Saiba mais e garante o seu antes do Natal!',
  silencios: [
    [0, 0.13], [2.493, 2.748], [3.912, 4.036], [4.129, 4.535], [5.528, 5.895], [6.239, 6.366],
    [9.561, 10.028], [11.672, 12.08], [14.486, 14.717], [15.374, 15.839], [17.49, 17.65],
    [17.764, 17.904], [19.179, 19.491], [23.081, 23.528], [25.124, 25.502], [28.113, 28.557],
    [30.254, 30.387], [31.222, 31.414],
  ],
};

/** G: abre com photocards na mão; dores com cenas reais; depois o livro folheando. */
export const VARIACAO_G: VariacaoEF = {
  ...FALA_VIDEO01,
  id: 'Video01-Var-G-Photocards',
  arquivo: 'natal-army-01-var-g-abre-photocards',
  audio: 'narracao/impresso-v2-gancho-incompleto.mp3',
  gancho: 'Se você é ARMY e não tem isso, seu Natal tá incompleto 💜',
  estiloLegenda: 'roxo',
  cenas: [
    {tipo: 'clipe', arquivo: T + 'photocards-camisa.mp4', de: 1.0, velocidade: 1.15, punch: true},
    {tipo: 'clipe', palavra: 'todo', arquivo: T + 'caixa-photocards.mp4', de: 0, rotulo: 'Merch cara 💸'},
    {tipo: 'clipe', palavra: 'frete', arquivo: T + 'caixa-photocards.mp4', de: 16, rotulo: 'Frete que atrasa 📦'},
    {
      tipo: 'livro',
      palavra: 'descobri',
      paginas: [{}, {palavra: 'imprimir'}, {palavra: '1500'}, {palavra: '80'}, {palavra: 'diários'}, {palavra: 'calendários'}],
    },
    {tipo: 'final', palavra: 'tudo'},
  ],
};

/** H: abre com o kit completo; itens com cenas reais; legenda branca (estilo demonstração). */
export const VARIACAO_H: VariacaoEF = {
  ...FALA_VIDEO01,
  id: 'Video01-Var-H-Demonstracao',
  arquivo: 'natal-army-01-var-h-demonstracao',
  audio: 'narracao/impresso-v2-gancho-incompleto.mp3',
  gancho: 'Se você é ARMY e não tem isso, seu Natal tá incompleto 🎄',
  estiloLegenda: 'branco',
  seloPresente: '🎄 Kit de Natal ARMY',
  cenas: [
    {tipo: 'presente'},
    {tipo: 'clipe', palavra: 'todo', arquivo: T + 'diario-diy.mp4', de: 8, zoom: 1.16, rotulo: 'Todo Natal é igual…'},
    {tipo: 'clipe', palavra: 'descobri', arquivo: I + 'g1.mp4', de: 1.6, velocidade: 1.2, rotulo: 'Kit pra imprimir em casa ✦'},
    {tipo: 'clipe', palavra: '1500', arquivo: T + 'photocards-camisa.mp4', de: 6, rotulo: '1.500 photocards'},
    {tipo: 'clipe', palavra: '80', arquivo: I + 'g2.mp4', de: 2.0, rotulo: '80 desenhos pra colorir'},
    {tipo: 'paginas', palavra: 'diários', imagens: [IMAGENS.journal, IMAGENS.diarioMusicas], fundo: T + 'diario-diy.mp4', fundoDe: 30, rotulo: 'Diários'},
    {tipo: 'clipe', palavra: 'calendários', arquivo: I + 'calendario.mp4', de: 0.8, rotulo: '7 calendários 3D 2027'},
    {tipo: 'final', palavra: 'tudo'},
  ],
};

export const VARIACOES_EF = [VARIACAO_E, VARIACAO_F, VARIACAO_G, VARIACAO_H];
export const duracaoEF = (v: VariacaoEF) => duracaoFala(v, 45);

/* ---------------- cenas ---------------- */

/** Kit completo como presente, com selo "Presente de Natal". */
const Presente: React.FC<{texto: string}> = ({texto}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 120}});
  const sSelo = spring({frame: frame - 8, fps, config: {damping: 8, stiffness: 200, mass: 0.6}});
  return (
    <Fundo>
      <div style={{position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: s}}>
        <Flutuar amplitude={10}>
          <Imagem src={IMAGENS.kitCompleto} largura={940} altura={705} />
        </Flutuar>
      </div>
      <div style={{position: 'absolute', top: 1240, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            ...estiloTexto(60, cores.branco, '#6A1236'),
            padding: '14px 40px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #F0476E, #B0346A)',
            border: `5px solid ${cores.branco}`,
            boxShadow: '0 16px 40px rgba(10,4,26,0.55)',
            transform: `scale(${sSelo}) rotate(-3deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          {texto}
        </div>
      </div>
    </Fundo>
  );
};

/** Escurece o topo para o gancho ler bem em cima de vídeo. */
const SombraTopo: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,8,34,0.75) 0%, rgba(20,8,34,0.35) 35%, rgba(20,8,34,0) 50%)', pointerEvents: 'none'}} />
);

/** Sem MP3 ainda: cria pausas falsas nas pontuações, para a legenda sair frase a frase. */
const comPausasEstimadas = (v: VariacaoEF): VariacaoEF => {
  if (v.silencios.length) return v;
  const ps = palavrasComTempo(v);
  const silencios: [number, number][] = ps
    .filter((p) => /[.,!?:…]$/.test(p.texto))
    .map((p) => [p.fim + 0.001, p.fim + 0.02] as [number, number]);
  return {...v, silencios};
};

export const VideoVariacaoEF: React.FC<PropsVideo & {variacao: VariacaoEF}> = ({variacao: original, temTrilha}) => {
  const v = comPausasEstimadas(original);
  const {durationInFrames} = useVideoConfig();
  const t = (p: string, oc?: number) => Math.max(0, frameDaPalavra(v, p, oc) - 4);
  const inicios = v.cenas.map((c, i) => (i === 0 || !c.palavra ? 0 : t(c.palavra, c.ocorrencia)));
  const iFinal = v.cenas.findIndex((c) => c.tipo === 'final');
  const tFinal = inicios[iFinal];
  const fimGancho = inicios[1];

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Trilha ativa={temTrilha} volume={0.15} />
      {v.audio ? <Html5Audio src={staticFile(v.audio)} playbackRate={v.velocidade} /> : null}

      {v.cenas.map((c, i) => {
        const ini = inicios[i];
        const fim = i + 1 < v.cenas.length ? inicios[i + 1] : durationInFrames;
        const dur = fim - ini;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={ini} durationInFrames={dur}>
            {c.tipo === 'clipe' ? (
              <Clipe cena={{tipo: 'clipe', arquivo: c.arquivo, de: c.de, velocidade: c.velocidade, zoom: c.zoom, focoY: c.focoY, volume: 0}} dur={dur} punch={c.punch} />
            ) : null}
            {c.tipo === 'paginas' ? <Paginas imagens={c.imagens} fundo={c.fundo} fundoDe={c.fundoDe} /> : null}
            {c.tipo === 'livro' ? (
              <Fundo>
                <Livro inicios={c.paginas.map((p, k) => (k === 0 || !p.palavra ? 0 : t(p.palavra, p.ocorrencia) - ini))} />
              </Fundo>
            ) : null}
            {c.tipo === 'presente' ? (
              <Presente texto={v.seloPresente ?? (v.id.includes('Pais') ? '🎁 Presente de Natal' : '🎁 1 pra você + 1 pra sua amiga')} />
            ) : null}
            {c.tipo === 'final' ? <FinalForte tDigital={t('digital') - ini} tCTA={t('toca') - ini} /> : null}
            {c.rotulo ? <Legenda texto={c.rotulo} topo={300} /> : null}
          </Sequence>
        );
      })}

      {/* gancho grande no começo */}
      <Sequence durationInFrames={fimGancho + 4} layout="none">
        <SombraTopo />
        <TextoGancho texto={v.gancho} topo={280} tamanho={80} saida={fimGancho - 6} />
      </Sequence>

      {inicios.slice(1).map((f, i) => (
        <Flash key={i} em={f} duracao={i + 1 === iFinal ? 10 : 4} />
      ))}

      <Legendas
        trechos={trechosLegenda(v).filter((x) => (v.legendaNoGancho || x.emFrame >= fimGancho - 6) && x.emFrame < tFinal)}
        velocidade={v.velocidade}
        ativa
        estilo={v.estiloLegenda}
        base={v.estiloLegenda === 'branco' ? 1480 : undefined}
      />
      {/* sinal de rascunho enquanto não há narração */}
      {v.audio ? null : (
        <div style={{position: 'absolute', top: 40, right: 40}}>
          <Entrada>
            <div style={{...estiloTexto(28), opacity: 0.7}}>prévia sem narração</div>
          </Entrada>
        </div>
      )}
    </AbsoluteFill>
  );
};
