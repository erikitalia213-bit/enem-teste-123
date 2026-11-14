import React from 'react';
import {Sequence} from 'remotion';
import {CTA, Entrada, Flutuar, Fundo, Imagem, Preco, PropsVideo, TextoGancho, Trilha} from '../compartilhado/componentes';
import {IMAGENS} from '../compartilhado/imagens';
import {LARGURA, estiloTexto} from '../compartilhado/tema';
import {frameDaPalavra} from '../compartilhado/tempoFala';
import {Carta} from './VideoFundo';
import {FundoVariacao} from './variacoes';

export const duracaoFundo = (v: FundoVariacao) => Math.round(v.duracaoAudio * 30);

/** Fundo sem áudio: os itens entram quando a narração fala de cada um. */
export const VideoFundoVariacao: React.FC<PropsVideo & {variacao: FundoVariacao}> = ({variacao: v, temTrilha}) => {
  const t = (palavra: string, oc?: number) => Math.max(0, frameDaPalavra(v, palavra, oc) - 3);
  const tItens = v.itens.map((it) => t(it.palavra, it.ocorrencia));
  const tDigital = t(v.palavraDigital);
  const tPreco = t(v.palavraPreco);
  const tCTA = t(v.palavraCTA);
  return (
    <Fundo>
      <Trilha ativa={temTrilha} volume={0.15} />
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
      <Sequence durationInFrames={tItens[0] + 4} layout="none">
        <TextoGancho texto={v.gancho} topo={420} tamanho={120} saida={tItens[0] - 6} />
      </Sequence>
      {v.itens.map((it, i) => {
        const fim = i < v.itens.length - 1 ? tItens[i + 1] : tDigital;
        if (fim - tItens[i] <= 0) return null;
        return (
          <Sequence key={it.rotulo} from={tItens[i]} durationInFrames={fim - tItens[i]} layout="none">
            <Carta src={it.src} rotulo={it.rotulo} dur={fim - tItens[i]} />
          </Sequence>
        );
      })}
      <Sequence from={tDigital} layout="none">
        <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Entrada>
            <Flutuar amplitude={8}>
              <Imagem src={IMAGENS.kitCompleto} largura={760} altura={570} />
            </Flutuar>
          </Entrada>
        </div>
        <div style={{position: 'absolute', top: 900, left: 60, right: 60, display: 'flex', justifyContent: 'center'}}>
          <Entrada atraso={6}>
            <div style={estiloTexto(50)}>{v.textoDigital}</div>
          </Entrada>
        </div>
      </Sequence>
      <Sequence from={tPreco} layout="none">
        <div style={{position: 'absolute', top: 980, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Preco texto="R$ 19,90" tamanho={140} />
        </div>
      </Sequence>
      <Sequence from={tCTA} layout="none">
        <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <CTA texto="Toque em Saiba mais 💜" tamanho={56} />
        </div>
      </Sequence>
    </Fundo>
  );
};
