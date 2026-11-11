// Gera todos os PDFs do entregável.
// Uso: node build.js            (todos)
//      node build.js guia moldes (só alguns)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { doc, paginate } = require('./src/layout');
const { buildGuia, buildMoldes } = require('./src/guia');
const bonus = require('./src/bonus-pdfs');

const OUT = path.join(__dirname, 'entregavel');
const HTML = path.join(__dirname, 'build');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const moldes = buildMoldes();
const DOCS = {
  guia: ['01-Natal-em-Ceramica-Fria-2026-50-Enfeites', 'Natal em Cerâmica Fria 2026 · 50 Enfeites', () => buildGuia({ moldeMap: moldes.map })],
  moldes: ['Bonus-01-Kit-de-Moldes-Natalinos', 'Bônus 01 · Kit de Moldes Natalinos', () => moldes.pages],
  secagem: ['Bonus-02-Guia-de-Secagem-e-Acabamento', 'Bônus 02 · Secagem e Acabamento', bonus.buildSecagem],
  vender: ['Bonus-03-Ceramica-Fria-para-Vender-no-Natal', 'Bônus 03 · Cerâmica Fria para Vender no Natal', bonus.buildVender],
  criancas: ['Bonus-04-15-Enfeites-com-as-Criancas', 'Bônus 04 · 15 Enfeites com as Crianças', bonus.buildCriancas],
  vila: ['Bonus-05-Vila-Natalina-Iluminada', 'Bônus 05 · Vila Natalina Iluminada', bonus.buildVila],
  materiais: ['Bonus-06-Lista-Completa-de-Materiais', 'Bônus 06 · Lista Completa de Materiais', bonus.buildMateriais],
  basico: ['Kit-Basico-20-Enfeites-para-Comecar', 'Kit Básico · 20 Enfeites para Começar', () => buildGuia({ basico: true })],
};

(async () => {
  const want = process.argv.slice(2);
  const keys = want.length ? want : Object.keys(DOCS);
  const browser = await chromium.launch();
  const pg = await browser.newPage();
  for (const k of keys) {
    const [file, foot, fn] = DOCS[k];
    const html = doc(foot, paginate(fn(), foot));
    const htmlPath = path.join(HTML, `${file}.html`);
    fs.writeFileSync(htmlPath, html);
    await pg.goto('file://' + htmlPath, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const pdfPath = path.join(OUT, `${file}.pdf`);
    await pg.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
    const n = await pg.evaluate(() => document.querySelectorAll('.page').length);
    console.log(`${file}.pdf  ${n} páginas  ${(fs.statSync(pdfPath).size / 1024).toFixed(0)} KB`);
  }
  await browser.close();
})();
