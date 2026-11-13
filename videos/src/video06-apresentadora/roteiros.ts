import {IMAGENS} from '../compartilhado/imagens';

// Vídeos da personagem "Apresentadora ARMY" (narração Keren, ElevenLabs).
// Cada roteiro = 1 vídeo. Para uma variação nova, copie um bloco e troque:
// - `audio`: MP3 em public/narracao/
// - `texto`: exatamente o que a voz fala (vira a legenda)
// - `silencios`: pausas do MP3 em segundos [início, fim] (dá pra medir com o
//   comando do README ou me pedir)
// - `gancho`: texto grande do começo
// - `itens`: imagem que entra quando a voz fala a palavra-chave

export type ItemRoteiro = {palavra: string; imagem: string; rotulo: string};

export type Roteiro = {
  id: string;
  arquivo: string; // nome do MP4 final em out/
  audio: string;
  duracaoAudio: number; // segundos
  velocidade: number; // 1.1 = 10% mais rápido (tom preservado)
  texto: string;
  silencios: [number, number][];
  gancho: string;
  /** Palavra (início) a partir da qual o preço aparece. */
  palavraPreco: string;
  /** Palavra (início) a partir da qual o botão aparece. */
  palavraCTA: string;
  itens: ItemRoteiro[];
};

export const PRECO = 'R$ 19,90';
export const CTA_TEXTO = 'Toque em Saiba mais 💜';

export const ROTEIROS: Roteiro[] = [
  {
    id: 'Apresentadora-A-Identidade',
    arquivo: 'apresentadora-a-identidade',
    audio: 'narracao/apresentadora-A.mp3',
    duracaoAudio: 20.92,
    velocidade: 1.1,
    texto:
      'Atenção, ARMY! Se o seu Natal não tiver isso, tá incompleto. Olha só: 80 desenhos pra colorir, 1.500 photocards pra imprimir, calendário 3D de 2027… e ainda diário de bônus! Tudo por R$ 19,90, e chega na hora, sem frete. Toca em Saiba mais e me agradece depois!',
    silencios: [
      [1.147, 1.503], [3.269, 3.491], [4.203, 4.542], [4.92, 5.478], [5.62, 5.765], [7.035, 7.433],
      [9.588, 10.006], [10.46, 10.626], [12.437, 12.725], [14.419, 14.843], [16.489, 16.616],
      [17.78, 17.917], [18.262, 18.693], [20.601, 20.924],
    ],
    gancho: 'Atenção, ARMY! 🚨',
    palavraPreco: 'tudo',
    palavraCTA: 'toca',
    itens: [
      {palavra: 'desenhos', imagem: IMAGENS.colorir, rotulo: '80 desenhos'},
      {palavra: 'photocards', imagem: IMAGENS.cartoes, rotulo: '1.500 photocards'},
      {palavra: 'calendário', imagem: IMAGENS.calendario, rotulo: 'Calendário 3D 2027'},
      {palavra: 'diário', imagem: IMAGENS.diarioCapa, rotulo: 'Diário bônus'},
    ],
  },
  {
    id: 'Apresentadora-B-UltimoMinuto',
    arquivo: 'apresentadora-b-ultimo-minuto',
    audio: 'narracao/apresentadora-B.mp3',
    duracaoAudio: 18.99,
    velocidade: 1.1,
    texto:
      'ARMY, alerta de Natal! Presente que não chega a tempo? Esquece. Esse kit é digital: você compra, baixa e imprime em casa no mesmo dia. São 80 desenhos pra colorir, 1.500 photocards e 7 calendários 3D. R$ 19,90, pagamento único. Toca em Saiba mais!',
    silencios: [
      [0.473, 0.705], [1.851, 2.23], [3.539, 3.817], [4.479, 4.823], [6.029, 6.396], [9.666, 10.098],
      [11.686, 12.021], [13.465, 13.59], [15.047, 15.491], [16.432, 16.565], [17.4, 17.786], [18.815, 18.991],
    ],
    gancho: 'ARMY, alerta de Natal! 🚨',
    palavraPreco: 'r$',
    palavraCTA: 'toca',
    itens: [
      {palavra: 'digital', imagem: IMAGENS.kitCompleto, rotulo: '100% digital'},
      {palavra: 'desenhos', imagem: IMAGENS.colorir, rotulo: '80 desenhos'},
      {palavra: 'photocards', imagem: IMAGENS.cartoes, rotulo: '1.500 photocards'},
      {palavra: 'calendários', imagem: IMAGENS.calendario, rotulo: '7 calendários 3D'},
    ],
  },
  {
    id: 'Apresentadora-C-Amiga',
    arquivo: 'apresentadora-c-amiga',
    audio: 'narracao/apresentadora-C.mp3',
    duracaoAudio: 18.21,
    velocidade: 1.1,
    texto:
      'Tô aqui com uma missão: achar o presente perfeito pra sua amiga ARMY. E achei! Um kit de Natal pra imprimir, com desenhos pra colorir, photocards, diário e calendário de 2027. Custa R$ 19,90. Manda esse vídeo pra ela, ou compra um pra cada uma! Toca em Saiba mais.',
    silencios: [
      [1.201, 1.601], [2.469, 2.627], [2.857, 3.01], [4.227, 4.63], [5.178, 5.642], [8.533, 8.752],
      [9.55, 9.672], [12.073, 12.513], [13.758, 14.119], [15.183, 15.332], [16.598, 16.974], [17.826, 18.207],
    ],
    gancho: 'Missão: o presente da sua amiga ARMY 🎁',
    palavraPreco: 'custa',
    palavraCTA: 'manda',
    itens: [
      {palavra: 'kit', imagem: IMAGENS.kitCompleto, rotulo: 'Kit de Natal ARMY'},
      {palavra: 'desenhos', imagem: IMAGENS.colorir, rotulo: 'Desenhos pra colorir'},
      {palavra: 'photocards', imagem: IMAGENS.cartoes, rotulo: 'Photocards'},
      {palavra: 'diário', imagem: IMAGENS.diarioMemorias, rotulo: 'Diário'},
      {palavra: 'calendário', imagem: IMAGENS.calendario, rotulo: 'Calendário 2027'},
    ],
  },
];
