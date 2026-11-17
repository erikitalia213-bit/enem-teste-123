/* Gera docs/prompt-imagens-exercicios.md a partir de content/. Uso: npm run docs:imagens */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { exercicios } from "../content/exercicios";
import { posesImagens } from "../content/poses-imagens";

const ESTILO = `Ilustração 3D renderizada, estilo consistente em TODAS as imagens:
- Manequim 3D feminino estilizado, cinza-grafite (#3a3a3e) com acabamento fosco e leve brilho de estúdio, SEM rosto (cabeça lisa), cabelo preso em rabo de cavalo, proporções atléticas e realistas.
- Roupa de treino neutra: top esportivo e legging em cinza-escuro (#2a2a2e), tênis cinza. Sem logotipos, sem estampas, sem texto.
- Fundo sólido preto #0b0b0b, sem cenário, sem chão aparente (apenas uma sombra suave sob o corpo e o equipamento).
- Realce verde-limão #c6f432: brilho translúcido/emissivo SOMENTE sobre o músculo trabalhado, como um mapa de calor suave sobre a pele do manequim.
- Equipamentos em cinza-escuro neutro, sem marcas.
- Iluminação de estúdio suave vinda de cima e da esquerda, contraste alto, sem sombras duras.
- Enquadramento: corpo inteiro (e equipamento) centralizado, ocupando ~80% da altura, câmera na altura do quadril, mesma distância e mesma escala em todas as imagens.
- Formato quadrado 800x800 px, exportar em WebP (qualidade 85).`;

const linhas: string[] = [];
linhas.push("# Prompts para gerar as imagens dos exercícios");
linhas.push("");
linhas.push("> Arquivo gerado por `npm run docs:imagens` a partir de `content/exercicios.ts` e `content/poses-imagens.ts`. Não edite à mão: edite as poses e gere de novo.");
linhas.push("");
linhas.push("## Como usar");
linhas.push("");
linhas.push(`1. Para cada exercício abaixo, copie o bloco de **início** e depois o de **fim** e gere no Codex (ou outro gerador). Cada bloco já é um prompt completo. Gere as duas imagens do exercício na mesma conversa para manter o mesmo manequim, a mesma câmera e a mesma luz.`);
linhas.push("2. Salve com o **nome exato do arquivo** indicado em `public/exercicios/` (ex.: `public/exercicios/hip-thrust-barra-inicio.webp`).");
linhas.push("3. Rode `npm run imagens:manifesto` (ou só `npm run dev` / `npm run build`, que já rodam sozinhos). O app troca o placeholder pelas imagens automaticamente quando as **duas** imagens do exercício existem.");
linhas.push("4. Confira na Biblioteca do app se o enquadramento ficou consistente entre os exercícios.");
linhas.push("");
linhas.push("Referência visual do manequim: `public/img/mapa-base.webp` (silhueta agachando). Se o gerador aceitar imagem de referência, envie esse arquivo junto.");
linhas.push("");
linhas.push("## Estilo comum (já incluído em cada prompt abaixo)");
linhas.push("");
linhas.push("```text");
linhas.push(ESTILO);
linhas.push("```");
linhas.push("");
linhas.push(`## Exercícios (${exercicios.length} × 2 = ${exercicios.length * 2} imagens)`);
linhas.push("");
linhas.push("| # | Exercício | Arquivos |");
linhas.push("|---|---|---|");
exercicios.forEach((e, i) => linhas.push(`| ${i + 1} | ${e.nome} | \`${e.slug}-inicio.webp\` · \`${e.slug}-fim.webp\` |`));
linhas.push("");

exercicios.forEach((e, i) => {
  const p = posesImagens[e.slug]!;
  const vista =
    p.vista === "lateral"
      ? "Vista lateral (perfil esquerdo do manequim voltado para a câmera)."
      : "Vista frontal levemente em 3/4 (este movimento acontece para o lado e não aparece de perfil).";
  for (const fase of ["inicio", "fim"] as const) {
    linhas.push(`### ${i + 1}${fase === "inicio" ? "a" : "b"}. ${e.nome}: ${fase === "inicio" ? "início" : "fim"}`);
    linhas.push("");
    linhas.push(`**Arquivo:** \`public/exercicios/${e.slug}-${fase}.webp\``);
    linhas.push("");
    linhas.push("```text");
    linhas.push(ESTILO);
    linhas.push("");
    linhas.push(`Exercício: ${e.nome}. Posição ${fase === "inicio" ? "INICIAL" : "FINAL"} do movimento.`);
    linhas.push(`Pose: ${fase === "inicio" ? p.inicio : p.fim}.`);
    linhas.push(`Equipamento: ${p.equipamento}.`);
    linhas.push(`Realce verde-limão #c6f432 em: ${p.musculo}${fase === "inicio" ? " (realce mais suave, músculo alongado)" : " (realce mais intenso, músculo contraído)"}.`);
    linhas.push(vista);
    linhas.push(`Técnica correta: ${e.passos[0]}`);
    linhas.push("Quadrado 800x800, fundo #0b0b0b, sem texto, sem logotipo, sem rosto.");
    linhas.push("```");
    linhas.push("");
  }
});

const destino = join(process.cwd(), "docs", "prompt-imagens-exercicios.md");
writeFileSync(destino, linhas.join("\n"));
console.log(`✔ ${destino} (${exercicios.length * 2} prompts)`);
