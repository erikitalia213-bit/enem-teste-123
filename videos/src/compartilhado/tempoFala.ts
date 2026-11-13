import {TrechoNarracao} from './componentes';
import {limpar, peso} from './legendas';
import {FPS} from './tema';

/*
 * Tempo das palavras a partir do texto + pausas do MP3.
 * As palavras são espalhadas só pelos trechos com voz (entre as pausas),
 * proporcionalmente ao tamanho de cada palavra.
 */

export type Fala = {
  duracaoAudio: number; // segundos
  silencios: [number, number][]; // pausas do MP3 [início, fim]
  texto: string; // exatamente o que a voz fala
  velocidade: number; // 1.1 = 10% mais rápido
};

type PalavraTempo = {texto: string; ini: number; fim: number};

export const intervalosFala = (f: Fala): [number, number][] => {
  const res: [number, number][] = [];
  let cursor = 0;
  for (const [a, b] of f.silencios) {
    if (a > cursor + 0.05) res.push([cursor, a]);
    cursor = b;
  }
  if (f.duracaoAudio > cursor + 0.05) res.push([cursor, f.duracaoAudio]);
  return res;
};

export const palavrasComTempo = (f: Fala): PalavraTempo[] => {
  const falas = intervalosFala(f);
  const total = falas.reduce((s, [a, b]) => s + (b - a), 0);
  const palavras = f.texto.replace(/R\$ /g, 'R$ ').split(' ').filter(Boolean);
  const pesoTotal = palavras.reduce((s, p) => s + peso(p), 0);
  const paraReal = (t: number) => {
    let resto = t;
    for (const [a, b] of falas) {
      if (resto <= b - a) return a + resto;
      resto -= b - a;
    }
    return f.duracaoAudio;
  };
  let acc = 0;
  return palavras.map((p) => {
    const ini = paraReal((acc / pesoTotal) * total);
    acc += peso(p);
    const fim = paraReal((acc / pesoTotal) * total - 0.001);
    return {texto: p, ini, fim};
  });
};

/** Trechos no formato do componente <Legendas>. */
export const trechosLegenda = (f: Fala): TrechoNarracao[] => {
  const ps = palavrasComTempo(f);
  return intervalosFala(f)
    .map(([a, b]) => {
      const dentro = ps.filter((p) => p.ini >= a - 0.01 && p.ini < b);
      if (!dentro.length) return null;
      const de = dentro[0].ini;
      const ate = dentro[dentro.length - 1].fim;
      return {de, ate, emFrame: Math.round((de * FPS) / f.velocidade), legenda: dentro.map((p) => p.texto).join(' ')};
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);
};

/** Frame do vídeo em que a voz começa a palavra (1ª, 2ª... ocorrência). */
export const frameDaPalavra = (f: Fala, palavra: string, ocorrencia = 1) => {
  const achadas = palavrasComTempo(f).filter((w) => limpar(w.texto).toLowerCase().startsWith(palavra.toLowerCase()));
  const p = achadas[ocorrencia - 1];
  return p ? Math.round((p.ini * FPS) / f.velocidade) : 99999;
};

export const duracaoFala = (f: Fala, folgaFrames = 15) => Math.ceil((f.duracaoAudio / f.velocidade) * FPS + folgaFrames);
