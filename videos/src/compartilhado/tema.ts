import {loadFont} from '@remotion/google-fonts/Fredoka';

const fredoka = loadFont('normal', {
  weights: ['500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

// Emoji colorido como fallback (💜 🎁 👀)
export const fonte = `${fredoka.fontFamily}, "Noto Color Emoji", "Apple Color Emoji", sans-serif`;

export const cores = {
  lavanda: '#B69CFF',
  roxo: '#7B5CD6',
  roxoProfundo: '#4A2F9A',
  fundo: '#1E1433',
  dourado: '#F3C969',
  branco: '#FFFFFF',
};

export const LARGURA = 1080;
export const ALTURA = 1920;
export const FPS = 30;
export const DURACAO = 15 * FPS; // 450 frames

// Zona segura do Reels/Stories: nada importante aqui.
export const ZONA_SEGURA = {topo: 250, base: 350};
export const LIMITE_INFERIOR = ALTURA - ZONA_SEGURA.base; // y = 1570

/** Contorno de texto com sombras em volta (funciona com emoji e acentos). */
export const contorno = (raio: number, cor = cores.roxo, passos = 16) => {
  const sombras: string[] = [];
  for (let i = 0; i < passos; i++) {
    const a = (i / passos) * Math.PI * 2;
    sombras.push(
      `${(Math.cos(a) * raio).toFixed(1)}px ${(Math.sin(a) * raio).toFixed(1)}px 0 ${cor}`,
    );
  }
  return sombras.join(', ');
};

export const estiloTexto = (
  tamanho: number,
  cor: string = cores.branco,
  corContorno: string = cores.roxo,
): React.CSSProperties => ({
  fontFamily: fonte,
  fontWeight: 700,
  fontSize: tamanho,
  lineHeight: 1.12,
  color: cor,
  textAlign: 'center',
  textShadow: `${contorno(Math.max(3, tamanho * 0.065), corContorno)}, 0 ${tamanho * 0.12}px ${
    tamanho * 0.25
  }px rgba(20,8,48,0.7), 0 0 ${tamanho * 0.5}px rgba(182,156,255,0.55)`,
});
