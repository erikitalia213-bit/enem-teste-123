import {TrechoNarracao} from '../compartilhado/componentes';

// Narração do vídeo 1 (ElevenLabs, voz Keren). Arquivo original intacto em
// public/narracao/narracao-01-original.mp3 (17,6s).
// Para caber no vídeo, cada frase toca no seu frame, a 1,1x, com pausas curtas.
// Se gerar uma narração nova, ajuste `de`/`ate` (segundos no MP3) de cada frase.
export const ARQUIVO_NARRACAO = 'narracao/narracao-01-original.mp3';
export const VELOCIDADE = 1.1;

export const trechos: TrechoNarracao[] = [
  {de: 0.0, ate: 1.68, emFrame: 3, texto: 'POV: seu Natal ARMY esse ano'},
  {de: 2.0, ate: 5.5, emFrame: 58, texto: 'Oitenta desenhos… diário criativo de bônus'},
  {de: 5.7, ate: 8.6, emFrame: 158, texto: 'espaço pras suas músicas, suas memórias de Natal'},
  {de: 8.92, ate: 11.7, emFrame: 241, texto: 'e calendário três dê de 2027'},
  {de: 12.08, ate: 14.36, emFrame: 322, texto: 'Tudo isso por só dezenove e noventa'},
  {de: 14.62, ate: 16.01, emFrame: 389, texto: 'Baixa e imprime hoje'},
  {de: 16.26, ate: 17.4, emFrame: 431, texto: 'Toca em Saiba mais!'},
];

// Momentos da animação casados com a fala (em frames, 30fps)
export const tempos = {
  // capa, colorir, journal, músicas, memórias, calendário
  inicioPaginas: [0, 60, 103, 158, 191, 241],
  inicioFinal: 318, // kit completo
  atrasoPreco: 18, // "dezenove e noventa" (contado a partir do inicioFinal)
  atrasoCTA: 70, // "Baixa e imprime hoje"
  duracao: 480, // 16s
};
