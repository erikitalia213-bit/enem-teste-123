// Formas dos enfeites, desenhadas numa caixa 100x100.
// Cada forma devolve "parts" (silhueta que vira molde de corte) e
// "details" (marcações decorativas que só aparecem na ilustração).
// As cores de cada parte vêm da paleta escolhida em cada enfeite.

const P = {
  white: '#FFFFFF', ivory: '#F6EFE3', gold: '#C9A24B', goldDark: '#A9832F',
  green: '#3E5B48', greenLight: '#7E9B7F', red: '#B5483B', kraft: '#D8C3A5',
  brown: '#8A6248', pink: '#E8B9AE', ink: '#3B2F2A', black: '#2B2522', blue: '#9FB7C9',
};

function starPath(cx, cy, R, r, n, rot = -90) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const rad = ((rot + (i * 180) / n) * Math.PI) / 180;
    const rr = i % 2 === 0 ? R : r;
    pts.push(`${(cx + rr * Math.cos(rad)).toFixed(2)} ${(cy + rr * Math.sin(rad)).toFixed(2)}`);
  }
  return `M${pts.join(' L')} Z`;
}

const el = {
  path: (d, extra = '') => ({ tag: 'path', a: `d="${d}" ${extra}` }),
  circle: (cx, cy, r) => ({ tag: 'circle', a: `cx="${cx}" cy="${cy}" r="${r}"` }),
  ellipse: (cx, cy, rx, ry, extra = '') => ({ tag: 'ellipse', a: `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${extra}` }),
  rect: (x, y, w, h, rx = 0) => ({ tag: 'rect', a: `x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"` }),
};

const hole = (cx, cy, r = 3.2) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBF7F0" stroke="rgba(0,0,0,.18)" stroke-width=".8"/>`;
const dots = (list, fill, r = 2) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
const line = (d, stroke, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const eyes = (y, dx = 8, cx = 50, r = 2.2) => dots([[cx - dx, y], [cx + dx, y]], P.ink, r);

const SHAPES = {
  star: {
    label: 'Estrela',
    parts: (c = P.white) => [[el.path(starPath(50, 54, 46, 19, 5)), c]],
    details: (a = P.gold) => line(starPath(50, 54, 38, 15.5, 5), a, 1.3, 'stroke-dasharray="1 3"') + hole(50, 20, 3),
  },
  starRound: {
    label: 'Estrela gordinha',
    parts: (c = P.white) => [[el.path(starPath(50, 54, 44, 25, 5)), c]],
    details: (a = P.gold) => dots([[50, 54]], a, 5) + hole(50, 22, 3),
  },
  snowflake: {
    label: 'Floco de neve',
    parts: (c = P.white) => [[el.path(starPath(50, 50, 46, 22, 6)), c]],
    details: (a = P.gold) => {
      let s = '';
      for (let i = 0; i < 6; i++) {
        const t = ((i * 60 - 90) * Math.PI) / 180;
        s += line(`M50 50 L${(50 + 34 * Math.cos(t)).toFixed(1)} ${(50 + 34 * Math.sin(t)).toFixed(1)}`, a, 2);
      }
      return s + `<circle cx="50" cy="50" r="5" fill="${a}"/>` + hole(50, 13, 2.6);
    },
  },
  heart: {
    label: 'Coração',
    parts: (c = P.white) => [[el.path('M50 90 C20 68 6 52 6 33 C6 18 17 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C83 8 94 18 94 33 C94 52 80 68 50 90 Z'), c]],
    details: (a = P.gold) => line('M50 80 C28 63 16 50 16 35 C16 24 24 17 31 17', a, 1.4, 'stroke-dasharray="1 3"') + hole(50, 32, 3.2),
  },
  ball: {
    label: 'Bola de Natal',
    parts: (c = P.white, a = P.gold) => [[el.circle(50, 57, 38), c], [el.rect(41, 10, 18, 11, 2), a]],
    details: (a = P.gold) => line('M14 52 C30 60 70 60 86 52', a, 2) + line('M16 66 C32 74 68 74 84 66', a, 2) + dots([[30, 42], [50, 40], [70, 42]], a, 2.4) + `<circle cx="50" cy="8" r="3.6" fill="none" stroke="${a}" stroke-width="1.6"/>`,
  },
  bell: {
    label: 'Sino',
    parts: (c = P.white, a = P.gold) => [[el.path('M50 10 C40 10 34 16 33 26 C31 46 28 60 16 74 L84 74 C72 60 69 46 67 26 C66 16 60 10 50 10 Z'), c], [el.circle(50, 82, 7), a]],
    details: (a = P.gold) => line('M22 66 L78 66', a, 2.2) + hole(50, 18, 2.6),
  },
  tree: {
    label: 'Árvore',
    parts: (c = P.green, a = P.brown) => [[el.path('M50 4 L72 32 L62 32 L82 56 L71 56 L92 82 L8 82 L29 56 L18 56 L38 32 L28 32 Z'), c], [el.rect(43, 80, 14, 14, 1), a]],
    details: (a = P.gold) => dots([[46, 28], [56, 46], [40, 52], [62, 66], [34, 72], [50, 64], [72, 76]], a, 2.6) + hole(50, 15, 2.4),
  },
  moon: {
    label: 'Lua',
    parts: (c = P.white) => [[el.path('M58 8 A44 44 0 1 0 94 70 A34 34 0 0 1 58 8 Z'), c]],
    details: (a = P.gold) => `<path d="${starPath(72, 30, 9, 4, 5)}" fill="${a}"/>` + hole(44, 18, 3),
  },
  angel: {
    label: 'Anjo',
    parts: (c = P.white, a = P.ivory) => [
      [el.path('M46 40 C30 24 8 30 12 50 C16 64 34 62 46 52 Z'), a],
      [el.path('M54 40 C70 24 92 30 88 50 C84 64 66 62 54 52 Z'), a],
      [el.path('M50 8 C57 8 62 13 62 20 C62 25 59 29 55 31 L74 90 L26 90 L45 31 C41 29 38 25 38 20 C38 13 43 8 50 8 Z'), c],
    ],
    details: (a = P.gold) => `<ellipse cx="50" cy="5" rx="10" ry="2.6" fill="none" stroke="${a}" stroke-width="1.8"/>` + line('M36 70 L64 70', a, 1.6, 'stroke-dasharray="1 3"') + line('M20 44 C26 40 34 42 40 46', a, 1.2) + line('M80 44 C74 40 66 42 60 46', a, 1.2),
  },
  bird: {
    label: 'Pássaro / pomba',
    parts: (c = P.white) => [[el.path('M20 58 L4 44 L8 66 C16 78 30 84 46 84 C68 84 82 68 78 48 L92 42 L76 36 C72 28 62 22 52 22 C34 22 20 36 20 58 Z'), c]],
    details: (a = P.gold) => line('M32 56 C42 46 56 48 62 58 C52 66 40 66 32 56 Z', a, 1.6) + dots([[66, 36]], P.ink, 2.2) + hole(50, 30, 2.6),
  },
  wreath: {
    label: 'Guirlanda',
    parts: (c = P.greenLight) => [[el.path('M50 8 A42 42 0 1 1 49.99 8 Z M50 30 A20 20 0 1 0 50.01 30 Z', 'fill-rule="evenodd"'), c]],
    details: (a = P.gold) => {
      let s = '';
      for (let i = 0; i < 12; i++) {
        const t = (i * 30 * Math.PI) / 180;
        const x = 50 + 31 * Math.cos(t), y = 50 + 31 * Math.sin(t);
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="3.4" transform="rotate(${i * 30 + 60} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${P.green}" opacity=".55"/>`;
      }
      return s + dots([[50, 82], [44, 79], [56, 79]], P.red, 3.2) + line('M42 86 L36 96 M58 86 L64 96', a, 2.4);
    },
  },
  snowman: {
    label: 'Boneco de neve',
    parts: (c = P.white, a = P.red) => [[el.circle(50, 68, 26), c], [el.circle(50, 32, 19), c], [el.path('M30 44 L70 44 L70 50 L30 50 Z'), a]],
    details: () => eyes(28, 6) + `<path d="M50 33 L62 36 L50 37 Z" fill="#E08A3C"/>` + dots([[50, 62], [50, 72], [50, 82]], P.ink, 2),
  },
  gingerbread: {
    label: 'Biscoito boneco',
    parts: (c = P.brown) => [[el.path('M50 8 C58 8 64 14 64 22 C64 27 62 30 59 33 L82 38 C90 40 90 52 82 52 L66 50 L70 72 L80 86 C84 92 76 98 70 94 L50 78 L30 94 C24 98 16 92 20 86 L30 72 L34 50 L18 52 C10 52 10 40 18 38 L41 33 C38 30 36 27 36 22 C36 14 42 8 50 8 Z'), c]],
    details: () => dots([[45, 20], [55, 20]], P.white, 2) + line('M45 26 C48 29 52 29 55 26', P.white, 1.6) + dots([[50, 46], [50, 56], [50, 66]], P.white, 2.4) + line('M20 42 L22 48 M80 42 L78 48', P.white, 1.6),
  },
  face: {
    label: 'Carinha redonda',
    parts: (c = P.pink) => [[el.circle(50, 54, 36), c]],
    details: () => eyes(50, 10),
  },
  santa: {
    label: 'Papai Noel redondo',
    parts: (c = P.pink, a = P.red) => [
      [el.path('M14 46 C16 20 34 8 54 8 C70 8 80 18 86 30 L74 40 Z'), a],
      [el.circle(50, 58, 34), c],
      [el.path('M18 64 C22 92 78 92 82 64 C70 74 30 74 18 64 Z'), P.white],
    ],
    details: () => `<rect x="14" y="40" width="72" height="10" rx="5" fill="${P.white}"/><circle cx="86" cy="32" r="7" fill="${P.white}"/>` + eyes(58, 9) + `<circle cx="50" cy="66" r="4" fill="${P.red}" opacity=".7"/>`,
  },
  reindeer: {
    label: 'Rena',
    parts: (c = P.kraft, a = P.brown) => [
      [el.path('M30 34 L22 10 L28 12 L30 4 L34 14 L38 8 L38 30 Z'), a],
      [el.path('M70 34 L78 10 L72 12 L70 4 L66 14 L62 8 L62 30 Z'), a],
      [el.ellipse(50, 60, 30, 34), c],
    ],
    details: () => eyes(54, 10) + `<circle cx="50" cy="78" r="7" fill="${P.red}"/>`,
  },
  bear: {
    label: 'Urso',
    parts: (c = P.white) => [[el.circle(24, 26, 12), c], [el.circle(76, 26, 12), c], [el.circle(50, 56, 36), c]],
    details: () => `<ellipse cx="50" cy="66" rx="12" ry="9" fill="${P.ivory}"/>` + eyes(50, 11) + dots([[50, 62]], P.ink, 3.2),
  },
  fox: {
    label: 'Raposinha',
    parts: (c = '#D9895B') => [[el.path('M14 10 L40 30 L60 30 L86 10 L84 50 C82 74 66 92 50 92 C34 92 18 74 16 50 Z'), c]],
    details: () => `<path d="M16 54 C30 58 42 70 50 92 C58 70 70 58 84 54 C82 76 66 92 50 92 C34 92 18 76 16 54 Z" fill="${P.white}"/>` + eyes(52, 12) + dots([[50, 84]], P.ink, 3),
  },
  oval: {
    label: 'Corpo oval',
    parts: (c = P.black) => [[el.ellipse(50, 52, 32, 42), c]],
    details: () => `<ellipse cx="50" cy="60" rx="22" ry="30" fill="${P.white}"/>` + eyes(36, 8) + `<path d="M44 44 L56 44 L50 52 Z" fill="#E08A3C"/>`,
  },
  owl: {
    label: 'Coruja',
    parts: (c = P.kraft) => [[el.path('M18 18 L34 28 C44 24 56 24 66 28 L82 18 L84 56 C84 78 70 92 50 92 C30 92 16 78 16 56 Z'), c]],
    details: () => `<circle cx="38" cy="46" r="11" fill="${P.white}"/><circle cx="62" cy="46" r="11" fill="${P.white}"/>` + dots([[38, 46], [62, 46]], P.ink, 4) + `<path d="M46 56 L54 56 L50 63 Z" fill="${P.gold}"/>` + line('M36 72 C40 76 44 76 48 72 M52 72 C56 76 60 76 64 72 M42 80 C46 84 54 84 58 80', P.brown, 1.6),
  },
  sheep: {
    label: 'Ovelhinha',
    parts: (c = P.white, a = P.ink) => [
      [el.circle(30, 44, 16), c], [el.circle(50, 36, 18), c], [el.circle(70, 44, 16), c],
      [el.circle(30, 64, 16), c], [el.circle(50, 70, 18), c], [el.circle(70, 64, 16), c],
      [el.ellipse(50, 54, 14, 17), a],
    ],
    details: () => eyes(52, 5, 50, 1.8) + `<ellipse cx="34" cy="48" rx="6" ry="3" fill="${P.ink}"/><ellipse cx="66" cy="48" rx="6" ry="3" fill="${P.ink}"/>`,
  },
  holly: {
    label: 'Folha de azevinho',
    parts: (c = P.green) => [
      [el.path('M48 52 L36 46 L36 36 L26 34 L26 24 L16 22 L12 10 C26 8 40 14 48 28 Z'), c],
      [el.path('M52 52 L64 46 L64 36 L74 34 L74 24 L84 22 L88 10 C74 8 60 14 52 28 Z'), c],
      [el.circle(42, 60, 9), P.red], [el.circle(58, 60, 9), P.red], [el.circle(50, 72, 9), P.red],
    ],
    details: () => line('M48 50 L18 14 M52 50 L82 14', P.greenLight, 1.4) + dots([[39, 57], [55, 57], [47, 69]], 'rgba(255,255,255,.6)', 1.8),
  },
  drop: {
    label: 'Gota / pinha',
    parts: (c = P.brown) => [[el.path('M50 6 C60 26 80 44 80 64 C80 82 66 94 50 94 C34 94 20 82 20 64 C20 44 40 26 50 6 Z'), c]],
    details: (a = P.kraft) => {
      let s = '';
      for (let r = 0; r < 5; r++) for (let i = 0; i < 3 + (r > 0 && r < 4 ? 1 : 0); i++) {
        const n = 3 + (r > 0 && r < 4 ? 1 : 0);
        const x = 50 + (i - (n - 1) / 2) * 12, y = 34 + r * 12;
        s += `<path d="M${x - 6} ${y} Q${x} ${y + 9} ${x + 6} ${y}" fill="none" stroke="${a}" stroke-width="2"/>`;
      }
      return s + hole(50, 18, 2.4);
    },
  },
  mushroom: {
    label: 'Cogumelo',
    parts: (c = P.red, a = P.ivory) => [[el.path('M36 52 L34 86 C34 92 66 92 66 86 L64 52 Z'), a], [el.path('M8 54 C8 26 28 10 50 10 C72 10 92 26 92 54 Z'), c]],
    details: () => dots([[30, 36], [50, 24], [70, 36], [50, 44], [22, 48], [78, 48]], P.white, 4.4) + hole(50, 16, 2.4),
  },
  candycane: {
    label: 'Bengala doce',
    stroke: { d: 'M64 92 L64 32 C64 16 56 8 46 8 C36 8 28 16 28 28', w: 15 },
    parts: (c = P.white) => [[el.path('M64 92 L64 32 C64 16 56 8 46 8 C36 8 28 16 28 28', 'fill="none" stroke-width="15" stroke-linecap="round"'), c]],
    details: () => line('M57 86 L71 80 M57 72 L71 66 M57 58 L71 52 M57 44 L71 38 M58 26 L70 20 M50 14 L56 4 M36 17 L34 5 M24 26 L32 30', P.red, 4),
  },
  lollipop: {
    label: 'Pirulito',
    parts: (c = P.white, a = P.kraft) => [[el.rect(46, 62, 8, 34, 3), a], [el.circle(50, 40, 32), c]],
    details: () => line('M50 40 m0 0 a4 4 0 0 1 4 4 a8 8 0 0 1 -12 4 a12 12 0 0 1 14 -18 a16 16 0 0 1 10 22 a20 20 0 0 1 -30 6', P.red, 3.2),
  },
  cupcake: {
    label: 'Cupcake',
    parts: (c = P.pink, a = P.kraft) => [
      [el.path('M20 56 L80 56 L70 92 L30 92 Z'), a],
      [el.path('M16 58 C10 50 16 40 26 40 C24 28 36 20 46 26 C50 14 66 16 66 28 C78 26 86 36 80 44 C90 48 88 58 84 58 Z'), c],
    ],
    details: () => line('M34 60 L38 90 M50 60 L50 90 M66 60 L62 90', P.brown, 1.4) + dots([[50, 14]], P.red, 6) + dots([[36, 44], [58, 38], [70, 48]], P.gold, 1.8),
  },
  house: {
    label: 'Casinha',
    parts: (c = P.white, a = P.brown) => [[el.path('M50 8 L92 46 L84 46 L84 92 L16 92 L16 46 L8 46 Z'), c], [el.rect(42, 64, 16, 28, 2), a]],
    details: () => `<rect x="24" y="54" width="12" height="12" fill="${P.gold}" opacity=".7"/><rect x="64" y="54" width="12" height="12" fill="${P.gold}" opacity=".7"/>` + line('M8 46 L50 8 L92 46', P.white, 5) + line('M6 47 L50 7 L94 47', 'rgba(0,0,0,.08)', 1) + hole(50, 30, 3),
  },
  stocking: {
    label: 'Meia natalina',
    parts: (c = P.red, a = P.white) => [
      [el.path('M30 14 L62 14 L62 56 C62 60 66 62 72 64 C86 68 92 76 90 86 C88 94 78 96 68 92 L36 78 C28 74 28 70 28 62 Z'), c],
      [el.rect(24, 4, 44, 16, 4), a],
    ],
    details: () => line('M36 34 L56 34 M36 44 L56 44', P.white, 1.4, 'stroke-dasharray="2 3"') + `<path d="M66 64 C78 66 88 72 88 84 C86 92 78 94 70 90 Z" fill="${P.white}" opacity=".85"/>` + hole(60, 12, 2.4),
  },
  mitten: {
    label: 'Luvinha',
    parts: (c = P.white, a = P.kraft) => [
      [el.path('M30 82 L30 40 C30 18 40 8 54 8 C70 8 76 20 76 34 L76 46 C82 40 90 42 90 50 C90 58 82 66 76 70 L76 82 Z'), c],
      [el.rect(26, 78, 54, 16, 4), a],
    ],
    details: (a = P.gold) => `<path d="${starPath(53, 44, 11, 5, 5)}" fill="${a}"/>` + line('M30 86 L80 86', P.white, 1.4, 'stroke-dasharray="2 3"'),
  },
  gift: {
    label: 'Presentinho',
    parts: (c = P.white, a = P.gold) => [
      [el.path('M50 32 C40 10 20 14 26 28 C28 32 38 33 50 32 Z'), a],
      [el.path('M50 32 C60 10 80 14 74 28 C72 32 62 33 50 32 Z'), a],
      [el.rect(14, 32, 72, 60, 3), c],
    ],
    details: (a = P.gold) => `<rect x="44" y="32" width="12" height="60" fill="${a}"/><rect x="14" y="54" width="72" height="10" fill="${a}"/>`,
  },
  cup: {
    label: 'Xícara',
    parts: (c = P.white) => [
      [el.path('M70 42 C86 40 92 50 90 58 C88 68 78 72 68 68 L69 60 C76 62 82 60 82 55 C82 50 76 48 70 50 Z'), c],
      [el.path('M16 34 L74 34 L70 82 C69 88 64 92 56 92 L34 92 C26 92 21 88 20 82 Z'), c],
    ],
    details: () => `<ellipse cx="45" cy="34" rx="29" ry="5" fill="${P.brown}"/>` + dots([[34, 30], [46, 28], [56, 31]], P.white, 3.4) + line('M32 22 C28 16 36 12 32 6 M48 22 C44 16 52 12 48 6', P.kraft, 1.6) + line('M24 58 L66 58', P.red, 3),
  },
  macaron: {
    label: 'Macaron',
    parts: (c = P.pink, a = P.ivory) => [[el.ellipse(50, 36, 38, 20), c], [el.rect(14, 44, 72, 12, 6), a], [el.ellipse(50, 64, 38, 20), c]],
    details: () => line('M14 40 C30 46 70 46 86 40', 'rgba(0,0,0,.12)', 1.4) + line('M14 60 C30 54 70 54 86 60', 'rgba(0,0,0,.12)', 1.4),
  },
  donut: {
    label: 'Rosquinha',
    parts: (c = P.kraft) => [[el.path('M50 12 A38 38 0 1 1 49.99 12 Z M50 38 A12 12 0 1 0 50.01 38 Z', 'fill-rule="evenodd"'), c]],
    details: () => `<path d="M50 20 A30 30 0 1 1 49.99 20 Z M50 36 A14 14 0 1 0 50.01 36 Z" fill-rule="evenodd" fill="${P.white}"/>` + line('M30 34 L34 30 M66 30 L70 34 M72 58 L76 62 M28 62 L24 66 M46 74 L52 76', P.red, 2.4) + line('M38 28 L42 26 M60 70 L64 70', P.green, 2.4),
  },
  panettone: {
    label: 'Panetone',
    parts: (c = P.kraft, a = '#E3B061') => [[el.path('M14 46 C14 20 86 20 86 46 Z'), a], [el.rect(18, 42, 64, 46, 4), c]],
    details: () => dots([[32, 36], [46, 30], [62, 34], [72, 40], [40, 42]], P.brown, 2.6) + line('M18 56 L82 56 M18 76 L82 76', P.white, 1.4, 'stroke-dasharray="3 3"') + `<rect x="18" y="58" width="64" height="16" fill="${P.red}" opacity=".18"/>`,
  },
  plaque: {
    label: 'Plaquinha',
    parts: (c = P.white) => [[el.rect(8, 26, 84, 52, 10), c]],
    details: (a = P.gold) => hole(20, 38, 3) + hole(80, 38, 3) + `<text x="50" y="58" text-anchor="middle" font-family="Caveat" font-size="17" fill="${a}">Feliz Natal</text>`,
  },
  roundTag: {
    label: 'Medalhão',
    parts: (c = P.white) => [[el.circle(50, 54, 38), c]],
    details: (a = P.gold) => hole(50, 24, 3.2) + `<circle cx="50" cy="56" r="28" fill="none" stroke="${a}" stroke-width="1.2" stroke-dasharray="1 3"/>`,
  },
  hand: {
    label: 'Medalhão da mãozinha',
    parts: (c = P.white) => [[el.circle(50, 54, 40), c]],
    details: (a = P.gold) => `<path d="M40 76 C34 66 32 58 34 50 L32 38 C32 34 37 34 38 38 L41 48 L41 32 C41 28 46 28 46 32 L47 46 L49 30 C49 26 54 26 54 30 L54 47 L58 34 C59 30 64 31 63 35 L60 52 L66 46 C69 43 73 46 71 50 L62 64 C60 70 58 74 56 78 Z" fill="${P.ivory}" stroke="${P.kraft}" stroke-width="1.2"/>` + hole(50, 20, 3) + `<text x="50" y="90" text-anchor="middle" font-family="Caveat" font-size="9" fill="${a}">1º Natal</text>`,
  },
  napkinStar: {
    label: 'Argola de guardanapo',
    parts: (c = P.white) => [[el.path(starPath(50, 52, 44, 22, 5) + ' M50 40 A12 12 0 1 0 50.01 40 Z', 'fill-rule="evenodd"'), c]],
    details: (a = P.gold) => `<circle cx="50" cy="52" r="15" fill="none" stroke="${a}" stroke-width="1.4"/>`,
  },
  placeCard: {
    label: 'Marcador de lugar',
    parts: (c = P.white, a = P.green) => [[el.ellipse(50, 74, 34, 14), c], [el.path(`M50 8 L64 34 L56 34 L70 56 L30 56 L44 34 L36 34 Z`), a]],
    details: (a = P.gold) => line('M30 66 L70 66', a, 1, 'stroke-dasharray="1 3"') + `<text x="50" y="80" text-anchor="middle" font-family="Caveat" font-size="11" fill="${a}">Ana</text>` + `<rect x="46" y="56" width="8" height="8" fill="${P.brown}"/>`,
  },
  topper: {
    label: 'Ponteira de árvore',
    parts: (c = P.white, a = P.ivory) => [[el.path('M40 98 L40 70 L60 70 L60 98 Z'), a], [el.path(starPath(50, 42, 42, 17, 5)), c]],
    details: (a = P.gold) => `<path d="${starPath(50, 42, 30, 12, 5)}" fill="none" stroke="${a}" stroke-width="2"/>` + line('M42 76 L58 76 M42 84 L58 84', a, 1.4),
  },
  nativity: {
    label: 'Sagrada Família',
    parts: (c = P.white, a = P.ivory) => [
      [el.path('M22 30 C28 30 32 34 32 40 C36 44 38 60 40 88 L4 88 C6 60 8 44 12 40 C12 34 16 30 22 30 Z'), c],
      [el.path('M78 22 C84 22 88 26 88 32 C92 36 96 60 98 88 L58 88 C60 60 64 36 68 32 C68 26 72 22 78 22 Z'), c],
      [el.ellipse(50, 78, 14, 8), a],
    ],
    details: (a = P.gold) => `<path d="${starPath(50, 14, 9, 3.6, 5)}" fill="${a}"/>` + `<circle cx="50" cy="74" r="4" fill="${P.pink}"/>` + line('M14 44 C18 40 26 40 30 44', P.kraft, 1.4) + line('M70 36 C74 32 82 32 86 36', P.kraft, 1.4),
  },
  acorn: {
    label: 'Bolota',
    parts: (c = P.kraft, a = P.brown) => [[el.path('M24 46 L76 46 C76 72 64 92 50 92 C36 92 24 72 24 46 Z'), c], [el.path('M18 48 C18 26 34 16 50 16 C66 16 82 26 82 48 Z'), a], [el.rect(47, 6, 6, 12, 2), a]],
    details: () => line('M26 40 L74 40 M30 32 L70 32 M38 24 L62 24', P.kraft, 1.2, 'stroke-dasharray="2 2"'),
  },
  berries: {
    label: 'Raminho de bagas',
    parts: (c = P.kraft, a = P.white) => [
      [el.path('M48 96 C46 70 44 40 30 12 L34 10 C48 38 52 70 54 96 Z'), c],
      [el.circle(30, 14, 6), a], [el.circle(40, 26, 6), a], [el.circle(28, 34, 6), a], [el.circle(56, 30, 6), a],
      [el.circle(44, 48, 6), a], [el.circle(62, 50, 6), a], [el.circle(40, 64, 6), a], [el.circle(60, 70, 6), a],
    ],
    details: () => line('M46 40 L56 30 M48 56 L62 50 M50 72 L60 70', P.kraft, 1.6),
  },
  anise: {
    label: 'Estrela de anis',
    parts: (c = P.brown) => [[el.path((() => {
      let d = '';
      for (let i = 0; i < 8; i++) {
        const t = (i * 45 * Math.PI) / 180, t1 = t - 0.28, t2 = t + 0.28;
        const tx = 50 + 44 * Math.cos(t), ty = 50 + 44 * Math.sin(t);
        const ax = 50 + 18 * Math.cos(t1), ay = 50 + 18 * Math.sin(t1);
        const bx = 50 + 18 * Math.cos(t2), by = 50 + 18 * Math.sin(t2);
        d += `M50 50 L${ax.toFixed(1)} ${ay.toFixed(1)} Q${(50 + 40 * Math.cos(t1)).toFixed(1)} ${(50 + 40 * Math.sin(t1)).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)} Q${(50 + 40 * Math.cos(t2)).toFixed(1)} ${(50 + 40 * Math.sin(t2)).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)} Z `;
      }
      return d;
    })()), c]],
    details: () => {
      let s = '';
      for (let i = 0; i < 8; i++) {
        const t = (i * 45 * Math.PI) / 180;
        s += `<ellipse cx="${(50 + 26 * Math.cos(t)).toFixed(1)}" cy="${(50 + 26 * Math.sin(t)).toFixed(1)}" rx="4" ry="2.6" transform="rotate(${i * 45} ${(50 + 26 * Math.cos(t)).toFixed(1)} ${(50 + 26 * Math.sin(t)).toFixed(1)})" fill="${P.gold}"/>`;
      }
      return s + `<circle cx="50" cy="50" r="5" fill="${P.goldDark}"/>`;
    },
  },
  penguin: null, // definido abaixo (usa oval)
  elf: {
    label: 'Duende',
    parts: (c = P.pink, a = P.green) => [
      [el.path('M22 44 C26 22 40 4 74 6 C64 14 66 30 78 44 Z'), a],
      [el.path('M14 56 L24 48 L26 64 Z'), c], [el.path('M86 56 L76 48 L74 64 Z'), c],
      [el.circle(50, 62, 28), c],
    ],
    details: () => `<rect x="18" y="40" width="64" height="10" rx="5" fill="${P.red}"/><circle cx="74" cy="6" r="5" fill="${P.gold}"/>` + eyes(62, 9) + line('M44 72 C48 76 52 76 56 72', P.ink, 1.6),
  },
  mrsClaus: {
    label: 'Mamãe Noel',
    parts: (c = P.pink, a = P.white) => [
      [el.path('M16 60 C14 30 28 16 50 16 C72 16 86 30 84 60 C80 52 72 46 70 40 C60 46 40 46 30 40 C28 46 20 52 16 60 Z'), a],
      [el.circle(50, 58, 28), c],
      [el.circle(50, 14, 9), a],
    ],
    details: () => `<path d="M30 32 C36 22 64 22 70 32" fill="none" stroke="${P.red}" stroke-width="5" stroke-linecap="round"/>` + `<circle cx="40" cy="56" r="5" fill="none" stroke="${P.gold}" stroke-width="1.4"/><circle cx="60" cy="56" r="5" fill="none" stroke="${P.gold}" stroke-width="1.4"/><path d="M45 56 L55 56" stroke="${P.gold}" stroke-width="1.4"/>` + eyes(56, 10, 50, 1.6) + dots([[38, 66], [62, 66]], P.red, 3),
  },
  church: {
    label: 'Igrejinha',
    parts: (c = P.white, a = P.brown) => [[el.path('M50 2 L58 16 L58 36 L88 58 L80 58 L80 94 L20 94 L20 58 L12 58 L42 36 L42 16 Z'), c], [el.path('M43 94 L43 76 C43 70 57 70 57 76 L57 94 Z'), a]],
    details: (a = P.gold) => `<rect x="47" y="20" width="6" height="9" rx="3" fill="${a}"/><rect x="28" y="64" width="8" height="12" rx="4" fill="${a}" opacity=".7"/><rect x="64" y="64" width="8" height="12" rx="4" fill="${a}" opacity=".7"/>` + line('M50 2 L50 -6 M46 -3 L54 -3', a, 1.6),
  },
};

const poinsettia = (cx, cy, r) => {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = i * 72 + 36;
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.55}" rx="${r * 0.32}" ry="${r * 0.62}" transform="rotate(${a} ${cx} ${cy})" fill="${P.green}"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const a = i * 60;
    s += `<ellipse cx="${cx}" cy="${cy - r * 0.5}" rx="${r * 0.28}" ry="${r * 0.55}" transform="rotate(${a} ${cx} ${cy})" fill="${P.red}"/>`;
  }
  return s + dots([[cx, cy], [cx - 2.5, cy - 2], [cx + 2.5, cy - 1.5], [cx, cy + 2.6]], P.gold, 1.6);
};

Object.assign(SHAPES, {
  ballRelief: {
    label: 'Bola em relevo',
    parts: (c = P.ivory, a = P.gold) => [[el.circle(50, 57, 38), c], [el.rect(41, 10, 18, 11, 2), a]],
    details: () => `<circle cx="50" cy="57" r="33" fill="none" stroke="${P.gold}" stroke-width="1.6"/>` + poinsettia(50, 58, 22) + `<path d="M50 8 C40 -2 30 6 40 10 Z M50 8 C60 -2 70 6 60 10 Z" fill="${P.red}"/>`,
  },
  santaHat: {
    label: 'Gorro de Papai Noel',
    parts: (c = P.red, a = P.white) => [
      [el.path('M18 74 C18 40 34 14 60 12 C76 11 86 22 88 38 C80 32 72 34 70 42 L82 74 Z'), c],
      [el.rect(10, 66, 80, 22, 11), a],
      [el.circle(84, 44, 11), a],
    ],
    details: () => line('M30 66 L36 30 M44 66 L48 24 M58 66 L60 20 M72 66 L70 40', 'rgba(0,0,0,.14)', 1.6) + poinsettia(30, 70, 8),
  },
  starGarland: {
    label: 'Guirlanda de estrelas',
    parts: (c = P.white) => [
      [el.path(starPath(18, 54, 16, 7, 5)), c], [el.path(starPath(50, 66, 16, 7, 5)), c], [el.path(starPath(82, 54, 16, 7, 5)), c],
    ],
    details: (a = P.gold) => line('M0 30 C20 44 30 50 50 52 C70 50 80 44 100 30', P.kraft, 1.6) + line('M18 40 L18 36 M50 52 L50 50 M82 40 L82 36', P.kraft, 1.2) + dots([[18, 54], [50, 66], [82, 54]], a, 2.4),
  },
  candleStar: {
    label: 'Porta-vela estrela',
    parts: (c = P.ivory) => [[el.path(starPath(50, 56, 46, 26, 5)), c]],
    details: () => `<circle cx="50" cy="58" r="15" fill="${P.white}" stroke="${P.gold}" stroke-width="2"/>` + `<path d="M50 40 C55 47 55 52 50 54 C45 52 45 47 50 40 Z" fill="#F4B740"/>` + poinsettia(22, 46, 7) + poinsettia(78, 46, 7) + poinsettia(50, 88, 7),
  },
  centerpiece: {
    label: 'Centro de mesa',
    parts: (c = P.kraft, a = P.white) => [
      [el.ellipse(50, 80, 46, 14), c],
      [el.path('M14 76 L14 52 L26 40 L38 52 L38 76 Z'), a],
      [el.path('M60 78 L60 46 L74 32 L88 46 L88 78 Z'), a],
      [el.path('M48 30 L58 54 L52 54 L60 72 L36 72 L44 54 L38 54 Z'), P.green],
      [el.rect(42, 64, 10, 14, 2), P.ivory],
    ],
    details: () => `<path d="M47 56 C50 60 50 62 47 63 C44 62 44 60 47 56 Z" fill="#F4B740"/>` + `<rect x="22" y="58" width="8" height="8" fill="${P.gold}"/><rect x="69" y="52" width="10" height="10" fill="${P.gold}"/><rect x="70" y="66" width="8" height="12" fill="${P.red}"/>` + line('M12 52 L26 38 L40 52 M58 46 L74 30 L90 46', P.white, 4) + poinsettia(30, 84, 6) + poinsettia(68, 86, 6),
  },
  village: {
    label: 'Vila natalina',
    parts: (c = P.white) => [
      [el.path('M6 90 L6 58 L20 44 L34 58 L34 90 Z'), c],
      [el.path('M66 90 L66 58 L80 44 L94 58 L94 90 Z'), c],
      [el.path('M30 90 L30 46 L50 24 L70 46 L70 90 Z'), c],
    ],
    details: () => line('M4 58 L20 42 L36 58 M64 58 L80 42 L96 58 M28 46 L50 22 L72 46', P.red, 3.4) + `<rect x="45" y="72" width="10" height="18" fill="${P.red}"/><rect x="38" y="52" width="8" height="10" fill="${P.gold}"/><rect x="54" y="52" width="8" height="10" fill="${P.gold}"/><rect x="15" y="66" width="10" height="10" fill="${P.gold}"/><rect x="75" y="66" width="10" height="10" fill="${P.gold}"/>` + `<circle cx="50" cy="40" r="4" fill="${P.green}"/>`,
  },
  coneTree: {
    label: 'Mini árvore 3D',
    parts: (c = P.green, a = P.kraft) => [[el.rect(42, 82, 16, 12, 2), a], [el.path('M50 8 C60 30 80 62 82 82 C70 88 30 88 18 82 C20 62 40 30 50 8 Z'), c]],
    details: () => {
      let s = '';
      for (let r = 0; r < 6; r++) {
        const y = 26 + r * 10, w = 6 + r * 5;
        for (let x = 50 - w; x <= 50 + w; x += 7) s += `<path d="M${x - 3} ${y} L${x} ${y + 5} L${x + 3} ${y}" fill="none" stroke="${P.greenLight}" stroke-width="1.4"/>`;
      }
      return s + `<path d="${starPath(50, 8, 7, 3, 5)}" fill="${P.gold}"/>` + dots([[40, 50], [60, 62], [44, 72], [56, 40]], P.red, 2.4);
    },
  },
});

SHAPES.penguin = {
  label: 'Pinguim',
  parts: (c = P.black) => [[el.path('M18 60 L8 70 L22 72 Z'), c], [el.path('M82 60 L92 70 L78 72 Z'), c], [el.ellipse(50, 52, 32, 42), c]],
  details: () => `<ellipse cx="50" cy="60" rx="22" ry="30" fill="${P.white}"/>` + eyes(36, 8) + `<path d="M44 44 L56 44 L50 52 Z" fill="#E08A3C"/>` + `<path d="M24 22 C30 4 70 4 76 22 Z" fill="${P.red}"/><rect x="22" y="20" width="56" height="7" rx="3.5" fill="${P.white}"/>`,
};

function renderParts(parts) {
  return parts.map(([e, fill]) => {
    if (e.a.includes('stroke-width="15"')) return `<${e.tag} ${e.a} stroke="${fill}"/>`;
    return `<${e.tag} ${e.a} fill="${fill}"/>`;
  }).join('');
}

// Ilustração colorida
function art(shapeKey, colors = []) {
  const s = SHAPES[shapeKey];
  if (!s) throw new Error('forma desconhecida: ' + shapeKey);
  const parts = s.parts(...colors);
  const shadow = renderParts(parts.map(([e]) => [e, 'rgba(59,47,42,.12)']));
  const outline = parts.map(([e]) => e.a.includes('stroke-width="15"')
    ? `<${e.tag} ${e.a.replace('stroke-width="15"', 'stroke-width="17"')} stroke="rgba(59,47,42,.25)"/>`
    : `<${e.tag} ${e.a} fill="none" stroke="rgba(59,47,42,.28)" stroke-width="1.4"/>`).join('');
  return `<g transform="translate(1.6 2.2)">${shadow}</g>${outline}${renderParts(parts)}${s.details(colors[2])}`;
}

// Molde: só a silhueta externa, com espessura de linha calculada para o tamanho real
function outline(shapeKey, sizeMM) {
  const s = SHAPES[shapeKey];
  const parts = s.parts();
  const w = (0.55 * 100) / sizeMM * 2; // ~0,55 mm de linha visível
  const stroke = parts.map(([e]) => {
    if (e.a.includes('stroke-width="15"')) return `<${e.tag} ${e.a.replace('stroke-width="15"', `stroke-width="${15 + w}"`)} stroke="#2B2522"/>`;
    return `<${e.tag} ${e.a} fill="none" stroke="#2B2522" stroke-width="${w}" stroke-linejoin="round"/>`;
  }).join('');
  const fill = parts.map(([e]) => {
    if (e.a.includes('stroke-width="15"')) return `<${e.tag} ${e.a} stroke="#fff"/>`;
    return `<${e.tag} ${e.a} fill="#fff"/>`;
  }).join('');
  return stroke + fill;
}

module.exports = { SHAPES, P, art, outline, starPath };
