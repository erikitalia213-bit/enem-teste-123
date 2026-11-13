import React from 'react';
import {Composition} from 'remotion';
import {PropsVideo, verificarTrilha} from './compartilhado/componentes';
import {ALTURA, DURACAO, FPS, LARGURA} from './compartilhado/tema';
import {Video01Folheie} from './video01-folheie/Video01';
import {ARQUIVO_NARRACAO as ARQUIVO_NARRACAO_01, tempos as tempos01} from './video01-folheie/narracao';
import {Video02Oferta} from './video02-oferta/Video02';
import {ARQUIVO_NARRACAO as ARQUIVO_NARRACAO_02, tempos as tempos02} from './video02-oferta/narracao';
import {Video03Checklist} from './video03-checklist/Video03';
import {ANUNCIOS} from './video04-ugc/anuncios';
import {ROTEIROS} from './video06-apresentadora/roteiros';
import {ROTEIRO_TIKTOK, ROTEIRO_TIKTOK_NATAL, ROTEIROS_IMPRESSO} from './video08-impresso-narrado/roteiros';
import {VideoImpressoNarrado, duracaoImpresso} from './video08-impresso-narrado/VideoImpressoNarrado';
import {Video01Narrado, duracaoFolheie} from './video01-folheie/Video01Narrado';
import {textos as textosFundo} from './video07-fundo/textos';
import {VideoFundo} from './video07-fundo/VideoFundo';
import {VideoApresentadora, duracaoRoteiro} from './video06-apresentadora/VideoApresentadora';
import {VideoUGC, duracaoAnuncio} from './video04-ugc/VideoUGC';
import {ARQUIVO_NARRACAO as ARQUIVO_NARRACAO_03, tempos as tempos03} from './video03-checklist/narracao';

const base = {
  durationInFrames: DURACAO,
  fps: FPS,
  width: LARGURA,
  height: ALTURA,
  defaultProps: {temTrilha: false} as PropsVideo,
  calculateMetadata: verificarTrilha,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NatalArmy01-Folheie"
      component={Video01Folheie}
      {...base}
      durationInFrames={tempos01.duracao}
      defaultProps={{temTrilha: false, narracao: ARQUIVO_NARRACAO_01}}
    />
    <Composition
      id="NatalArmy02-Oferta"
      component={Video02Oferta}
      {...base}
      durationInFrames={tempos02.duracao}
      defaultProps={{temTrilha: false, narracao: ARQUIVO_NARRACAO_02}}
    />
    <Composition
      id="NatalArmy03-Checklist"
      component={Video03Checklist}
      {...base}
      durationInFrames={tempos03.duracao}
      defaultProps={{temTrilha: false, narracao: ARQUIVO_NARRACAO_03}}
    />
    {ANUNCIOS.map((a) => (
      <Composition
        key={a.id}
        id={a.id}
        component={VideoUGC}
        {...base}
        durationInFrames={duracaoAnuncio(a)}
        defaultProps={{temTrilha: false, anuncio: a}}
      />
    ))}
    <Composition id="Fundo-Personagem" component={VideoFundo} {...base} durationInFrames={Math.round(textosFundo.duracao * FPS)} />
    {ROTEIROS.map((r) => (
      <Composition
        key={r.id}
        id={r.id}
        component={VideoApresentadora}
        {...base}
        durationInFrames={duracaoRoteiro(r)}
        defaultProps={{temTrilha: false, roteiro: r}}
      />
    ))}
    <Composition
      id="Folheie-Nova"
      component={Video01Narrado}
      {...base}
      durationInFrames={duracaoFolheie(ROTEIROS_IMPRESSO[1])}
      defaultProps={{temTrilha: false, roteiro: ROTEIROS_IMPRESSO[1]}}
    />
    <Composition
      id={ROTEIRO_TIKTOK.id}
      component={VideoImpressoNarrado}
      {...base}
      durationInFrames={duracaoImpresso(ROTEIRO_TIKTOK)}
      defaultProps={{temTrilha: false, roteiro: ROTEIRO_TIKTOK}}
    />
    <Composition
      id={ROTEIRO_TIKTOK_NATAL.id}
      component={VideoImpressoNarrado}
      {...base}
      durationInFrames={duracaoImpresso(ROTEIRO_TIKTOK_NATAL)}
      defaultProps={{temTrilha: false, roteiro: ROTEIRO_TIKTOK_NATAL}}
    />
  </>
);
