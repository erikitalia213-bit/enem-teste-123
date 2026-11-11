// Base visual compartilhada por todos os PDFs
const path = require('path');
const { art, outline, SHAPES } = require('./shapes');

const FONTS = path.join(__dirname, 'fonts');

const C = {
  red: '#A8322D', redDark: '#7E2420', green: '#2F5A3E', greenDark: '#21402C', gold: '#C9A24B',
  goldLight: '#E9D6A6', cream: '#FBF6EE', paper: '#FFFDF8', ink: '#3B2F2A', muted: '#7A6A5F', line: '#E7DCCB',
};

const css = `
@font-face{font-family:'Playfair';src:url('file://${FONTS}/playfair.woff2') format('woff2');font-weight:400 900;font-style:normal}
@font-face{font-family:'Playfair';src:url('file://${FONTS}/playfair-italic.woff2') format('woff2');font-weight:400 900;font-style:italic}
@font-face{font-family:'Nunito';src:url('file://${FONTS}/nunito.woff2') format('woff2');font-weight:200 1000}
@font-face{font-family:'Caveat';src:url('file://${FONTS}/caveat.woff2') format('woff2');font-weight:400 700}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:${C.cream}}
body{font-family:'Nunito',sans-serif;color:${C.ink};font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;padding:17mm 16mm 20mm;background:${C.cream}}
.page:last-child{page-break-after:auto;break-after:auto}
.foot{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;font-size:8pt;color:${C.muted};border-top:1px solid ${C.line};padding-top:2.5mm;letter-spacing:.02em}
.foot b{color:${C.red};font-weight:800}
h1,h2,h3{font-family:'Playfair',serif;font-weight:700;line-height:1.12;color:${C.red}}
h1{font-size:32pt}
h2{font-size:25pt;margin-bottom:3mm}
h3{font-size:14pt;margin:5mm 0 2.5mm;color:${C.green}}
h4{font-size:9pt;text-transform:uppercase;letter-spacing:.12em;color:${C.gold};font-weight:800;margin-bottom:2mm}
p{margin-bottom:2.6mm}
.kicker{font-size:8.5pt;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${C.gold};margin-bottom:2mm}
.lead{font-size:12pt;color:${C.ink};line-height:1.55}
.hand{font-family:'Caveat',cursive;font-weight:700}
ul.clean{list-style:none}
ul.clean li{position:relative;padding-left:5.5mm;margin-bottom:1.6mm}
ul.clean li:before{content:'';position:absolute;left:0;top:2.1mm;width:2.2mm;height:2.2mm;border-radius:50%;background:${C.gold}}
.box{background:${C.paper};border:1px solid ${C.line};border-radius:4mm;padding:5mm 6mm;margin-bottom:4mm}
.box.red{background:${C.red};color:#fff;border:none}
.box.red h3,.box.red h4{color:${C.goldLight}}
.box.green{background:#EAF0E8;border-color:#CFDCCD}
.box.gold{background:#FBF1DA;border-color:${C.goldLight}}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm}
table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:4mm}
th{background:${C.green};color:#fff;text-align:left;padding:2mm 3mm;font-weight:800;font-size:8.5pt;letter-spacing:.04em}
td{padding:2mm 3mm;border-bottom:1px solid ${C.line};vertical-align:top;background:${C.paper}}
tr:nth-child(even) td{background:#FBF7EF}
.num-step{display:inline-flex;align-items:center;justify-content:center;width:6.5mm;height:6.5mm;border-radius:50%;background:${C.red};color:#fff;font-weight:800;font-size:9pt;flex:none}
.ornament-ring{border-radius:50%;background:radial-gradient(circle at 50% 40%,#fff 0%,${C.paper} 60%,#F3E9D8 100%);border:1.2mm solid #fff;box-shadow:0 0 0 .6mm ${C.goldLight}}
/* capa */
.cover{padding:0;background:${C.red};color:#fff}
.cover.green{background:${C.green}}
.cover .frame{position:absolute;inset:9mm;border:.6mm solid ${C.gold};border-radius:3mm}
.cover .frame:after{content:'';position:absolute;inset:2mm;border:.25mm solid rgba(233,214,166,.55);border-radius:2mm}
.cover .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;text-align:center;padding:30mm 22mm 0}
.cover .tag{font-size:9pt;font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:${C.goldLight}}
.cover h1{color:#fff;font-size:44pt;margin:6mm 0 4mm;line-height:1.02}
.cover h1 em{font-style:italic;color:${C.goldLight};font-weight:500}
.cover .sub{font-size:13pt;color:#F7E9E4;max-width:150mm;line-height:1.45}
.cover .badge{display:inline-block;margin-top:6mm;border:.4mm solid ${C.gold};color:${C.goldLight};border-radius:20mm;padding:2mm 6mm;font-weight:800;font-size:9.5pt;letter-spacing:.06em}
.cover .bottom{position:absolute;bottom:17mm;left:0;right:0;text-align:center;font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;color:${C.goldLight}}
.cover .arts{position:absolute;left:0;right:0;bottom:30mm;height:120mm}
.cover .arts .o{position:absolute;filter:drop-shadow(0 2mm 3mm rgba(0,0,0,.25))}
/* divisória de capítulo */
.divider{background:${C.green};color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:30mm 24mm}
.divider.red{background:${C.red}}
.divider .big{font-family:'Playfair',serif;font-size:90pt;color:${C.goldLight};line-height:1;opacity:.95}
.divider h2{color:#fff;font-size:34pt;margin:4mm 0 4mm}
.divider p{font-size:13pt;color:#EEF2EC;max-width:130mm}
.divider .arts{position:absolute;right:-6mm;bottom:22mm;display:flex;gap:4mm;opacity:.95}
.divider .list{margin-top:8mm;columns:2;column-gap:10mm;font-size:10.5pt;color:#F2F0E8}
.divider .list div{margin-bottom:1.6mm;break-inside:avoid}
.divider .list b{color:${C.goldLight};display:inline-block;width:9mm}
`;

function svgArt(shape, colors, size = 40, pad = 6) {
  return `<svg viewBox="${-pad} ${-pad - 4} ${100 + pad * 2} ${100 + pad * 2 + 4}" width="${size}mm" height="${size}mm" style="display:block;overflow:visible">${art(shape, colors)}</svg>`;
}

function doc(title, pages) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
}

// Monta páginas com rodapé numerado
function paginate(sections, footTitle) {
  let n = 0;
  return sections.map((s) => {
    n++;
    if (s.noFoot) return s.html.replace('%FOOT%', '');
    return s.html.replace('%FOOT%', `<div class="foot"><span>${footTitle}</span><span><b>${n}</b></span></div>`);
  });
}

function page(inner, cls = '', noFoot = false) {
  return { html: `<section class="page ${cls}">${inner}%FOOT%</section>`, noFoot };
}

function cover({ tag, title, sub, badge, arts = [], green = false, bottom = 'Natal em Cerâmica Fria 2026' }) {
  const placed = arts.map(([shape, colors, x, y, s, rot = 0]) =>
    `<div class="o" style="left:${x}mm;top:${y}mm;transform:rotate(${rot}deg)">${svgArt(shape, colors, s)}</div>`).join('');
  return page(`<div class="frame"></div><div class="inner"><div class="tag">${tag}</div><h1>${title}</h1><div class="sub">${sub}</div>${badge ? `<div class="badge">${badge}</div>` : ''}</div><div class="arts">${placed}</div><div class="bottom">${bottom}</div>`, `cover ${green ? 'green' : ''}`, true);
}

// Empacotamento em prateleiras com "first fit" entre páginas (mm)
function pack(items, W, H, gap = 5) {
  const sorted = [...items].sort((a, b) => b.h - a.h || b.w - a.w);
  const pages = []; // { shelves: [{y, h, x}], used, items }
  for (const it of sorted) {
    let placed = false;
    for (const pg of pages) {
      for (const sh of pg.shelves) {
        if (sh.x + it.w <= W && it.h <= sh.h) { pg.items.push({ ...it, x: sh.x, y: sh.y }); sh.x += it.w + gap; placed = true; break; }
      }
      if (placed) break;
      if (pg.used + it.h <= H) {
        const sh = { y: pg.used, h: it.h, x: it.w + gap };
        pg.shelves.push(sh); pg.used += it.h + gap;
        pg.items.push({ ...it, x: 0, y: sh.y }); placed = true; break;
      }
    }
    if (!placed) pages.push({ shelves: [{ y: 0, h: it.h, x: it.w + gap }], used: it.h + gap, items: [{ ...it, x: 0, y: 0 }] });
  }
  return pages.map((p) => p.items);
}

const calib = `<div style="display:flex;align-items:center;gap:3mm;font-size:8pt;color:${C.muted}">
  <svg width="50mm" height="12mm" viewBox="0 0 50 12" style="overflow:visible">
    <rect x="0" y="0" width="10" height="10" fill="none" stroke="${C.ink}" stroke-width=".3"/>
    <text x="5" y="6.6" font-size="3.2" text-anchor="middle" fill="${C.ink}" font-family="Nunito" font-weight="800">1 cm</text>
    <line x1="14" y1="9" x2="49" y2="9" stroke="${C.ink}" stroke-width=".3"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="${14 + i * 5}" y1="${i % 2 ? 7.5 : 6}" x2="${14 + i * 5}" y2="9" stroke="${C.ink}" stroke-width=".3"/>`).join('')}
    <text x="31.5" y="4.5" font-size="2.8" text-anchor="middle" fill="${C.muted}" font-family="Nunito">régua de conferência (3,5 cm)</text>
  </svg>
  <span>Imprima em <b>tamanho real / 100%</b>. Confira o quadrado com a régua: ele precisa medir 1 cm.</span></div>`;

// Molde de forma do shapes.js em tamanho real
function moldeSvg(shapeKey, sizeMM) {
  const pad = 2;
  return `<svg width="${sizeMM}mm" height="${sizeMM}mm" viewBox="${-pad} ${-pad} ${100 + pad * 2} ${100 + pad * 2}" style="overflow:visible">${outline(shapeKey, sizeMM)}</svg>`;
}

module.exports = { C, css, svgArt, doc, paginate, page, cover, pack, calib, moldeSvg, SHAPES };
