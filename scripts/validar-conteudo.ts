/* Confere o conteúdo de /content. Uso: npm run validar:conteudo */
import { validarConteudo } from "../lib/validarConteudo";
import { exercicios } from "../content/exercicios";
import { receitas } from "../content/receitas";
import { treinosBase } from "../content/protocolo";

const erros = validarConteudo();
if (erros.length) {
  console.error(`✖ ${erros.length} problema(s) no conteúdo:`);
  for (const e of erros) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✔ Conteúdo ok: ${exercicios.length} exercícios, ${treinosBase.length} treinos, ${receitas.length} receitas.`);
