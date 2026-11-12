import React from 'react';
import {Composition} from 'remotion';
import {PropsVideo, verificarTrilha} from './compartilhado/componentes';
import {ALTURA, DURACAO, FPS, LARGURA} from './compartilhado/tema';
import {Video01Folheie} from './video01-folheie/Video01';
import {Video02Oferta} from './video02-oferta/Video02';
import {Video03Checklist} from './video03-checklist/Video03';

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
    <Composition id="NatalArmy01-Folheie" component={Video01Folheie} {...base} />
    <Composition id="NatalArmy02-Oferta" component={Video02Oferta} {...base} />
    <Composition id="NatalArmy03-Checklist" component={Video03Checklist} {...base} />
  </>
);
