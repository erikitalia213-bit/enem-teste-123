// Gera content/imagens-exercicios.gerado.ts com os exercícios que já têm as duas
// imagens (início e fim) em /public/exercicios. Roda sozinho antes de dev e build.
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pasta = join(process.cwd(), "public", "exercicios");
const arquivos = existsSync(pasta) ? new Set(readdirSync(pasta)) : new Set();
const slugs = [...arquivos]
  .filter((f) => f.endsWith("-inicio.webp"))
  .map((f) => f.slice(0, -"-inicio.webp".length))
  .filter((slug) => arquivos.has(`${slug}-fim.webp`))
  .sort();

const conteudo = `// ARQUIVO GERADO por scripts/gerar-manifesto-imagens.mjs — não edite à mão.
// Lista os exercícios com as duas imagens em /public/exercicios.
export const exerciciosComImagem: readonly string[] = ${JSON.stringify(slugs, null, 2)};
`;
writeFileSync(join(process.cwd(), "content", "imagens-exercicios.gerado.ts"), conteudo);
console.log(`Imagens de exercícios: ${slugs.length} com início e fim.`);
