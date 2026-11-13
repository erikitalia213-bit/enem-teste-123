// Renderiza os 3 vídeos (MP4 H.264, crf 18) + um PNG do segundo 1 de cada.
// Uso: node render.mjs            -> todos
//      node render.mjs 02         -> só o vídeo 02
// Para usar um Chrome já instalado: CHROME_PATH=/caminho/do/chrome node render.mjs
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

const videos = [
  {id: 'NatalArmy01-Folheie', arquivo: 'natal-army-01-folheie'},
  {id: 'NatalArmy02-Oferta', arquivo: 'natal-army-02-oferta'},
  {id: 'NatalArmy03-Checklist', arquivo: 'natal-army-03-checklist'},
  // Anúncios UGC (src/video04-ugc/anuncios.ts): adicione aqui cada id novo
  {id: 'UGC-Mae-Gancho1', arquivo: 'ugc-mae-gancho1'},
  {id: 'Fundo-Personagem', arquivo: 'fundo-para-personagem'},
  // Personagem Apresentadora (src/video06-apresentadora/roteiros.ts)
  {id: 'Apresentadora-A-Identidade', arquivo: 'apresentadora-a-identidade'},
  {id: 'Apresentadora-B-UltimoMinuto', arquivo: 'apresentadora-b-ultimo-minuto'},
  {id: 'Apresentadora-C-Amiga', arquivo: 'apresentadora-c-amiga'},
];

const filtro = process.argv[2];
const extra = process.env.CHROME_PATH ? [`--browser-executable=${process.env.CHROME_PATH}`] : [];
mkdirSync('out', {recursive: true});

const remotion = (args) =>
  execFileSync('npx', ['remotion', ...args, ...extra], {stdio: 'inherit', shell: process.platform === 'win32'});

for (const v of videos) {
  if (filtro && !v.arquivo.includes(filtro)) continue;
  console.log(`\n▶ ${v.arquivo}`);
  remotion(['render', 'src/index.ts', v.id, `out/${v.arquivo}.mp4`, '--codec=h264', '--crf=18']);
  remotion(['still', 'src/index.ts', v.id, `out/${v.arquivo}-gancho-1s.png`, '--frame=30']);
}
console.log('\n✓ Pronto! Arquivos em videos/out/');
