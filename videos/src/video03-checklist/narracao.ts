import {TrechoNarracao} from '../compartilhado/componentes';

// Narração do vídeo 3 (ElevenLabs, voz Ana Alice). Arquivo original intacto em
// public/narracao/narracao-03-original.mp3 (22,4s).
// Para caber no vídeo, cada frase toca no seu frame, a 1,18x, com pausas curtas.
// Se gerar uma narração nova, ajuste `de`/`ate` (segundos no MP3) de cada frase.
export const ARQUIVO_NARRACAO = 'narracao/narracao-03-original.mp3';
export const VELOCIDADE = 1.18;

export const trechos: TrechoNarracao[] = [
  {de: 0.0, ate: 1.93, emFrame: 3, texto: 'Manda esse vídeo pra sua amiga ARMY'},
  {de: 2.3, ate: 4.46, emFrame: 57, legenda: 'Esse é o nosso checklist de Natal:'},
  {de: 4.91, ate: 7.26, emFrame: 117, legenda: 'colorir ouvindo BTS no repeat…'},
  {de: 7.66, ate: 9.64, emFrame: 181, legenda: 'escrever as memórias desse ano…'},
  {de: 9.98, ate: 12.04, emFrame: 236, legenda: 'imprimir e trocar photocards…'},
  {de: 12.29, ate: 14.87, emFrame: 293, legenda: 'montar o calendário de 2027…'},
  {de: 15.17, ate: 17.65, emFrame: 363, legenda: 'e dar um de presente pra sua melhor amiga.'},
  {de: 18.02, ate: 19.07, emFrame: 434, legenda: 'Tudo num kit só,'},
  {de: 19.2, ate: 20.56, emFrame: 464, legenda: 'por R$ 19,90.'},
  {de: 20.92, ate: 22.19, emFrame: 502, legenda: 'Toca em Saiba mais!'},
];

// Momentos da animação casados com a fala (em frames, 30fps)
export const tempos = {
  inicioNota: 57, // "Esse é o nosso checklist de Natal"
  inicioItens: [117, 181, 236, 293, 363], // uma linha do checklist por frase
  atrasoCheck: 30, // ✓ entra este tanto depois da linha aparecer
  inicioFinal: 431, // "Tudo num kit só"
  atrasoPreco: 38, // "dezenove e noventa"
  atrasoCTA: 71, // "Toca em Saiba mais!"
  duracao: 545, // ~18s
};
