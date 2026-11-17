import { cardapio14Dias, trocasPorFase } from "@/content/cardapio";
import { exercicios, obterExercicio } from "@/content/exercicios";
import { ingredientes } from "@/content/ingredientes";
import { rotinaDescanso, treinosBase } from "@/content/protocolo";
import { obterReceita, ORDEM_REFEICOES, receitas } from "@/content/receitas";

/** Confere a integridade do conteúdo em /content. Retorna a lista de problemas (vazia = ok). */
export function validarConteudo(): string[] {
  const erros: string[] = [];

  // Exercícios
  if (exercicios.length < 24) erros.push(`São necessários pelo menos 24 exercícios (há ${exercicios.length}).`);
  const slugs = new Set<string>();
  for (const e of exercicios) {
    if (slugs.has(e.slug)) erros.push(`Slug de exercício repetido: ${e.slug}`);
    slugs.add(e.slug);
    if (!/^[a-z0-9-]+$/.test(e.slug)) erros.push(`Slug inválido (use minúsculas, números e hífen): ${e.slug}`);
    if (e.passos.length < 3 || e.passos.length > 4) erros.push(`${e.slug}: precisa de 3 a 4 passos (tem ${e.passos.length}).`);
    for (const campo of ["nome", "equipamento", "ondeSentir", "erroComum", "dicaDeOuro"] as const) {
      if (!e[campo]?.trim()) erros.push(`${e.slug}: campo "${campo}" vazio.`);
    }
  }
  if (!exercicios.some((e) => e.local !== "casa")) erros.push("Nenhum exercício de academia.");
  if (!exercicios.some((e) => e.local !== "academia")) erros.push("Nenhum exercício de casa.");

  // Treinos
  if (treinosBase.length !== 24) erros.push(`O protocolo deve ter 24 treinos (3 fases × 4 letras × 2 versões); há ${treinosBase.length}.`);
  for (const t of [...treinosBase, { id: rotinaDescanso.id, itens: rotinaDescanso.itens, versao: "ambos" }]) {
    if (t.itens.length === 0) erros.push(`${t.id}: treino sem exercícios.`);
    for (const it of t.itens) {
      const ex = obterExercicio(it.exercicio);
      if (!ex) {
        erros.push(`${t.id}: exercício inexistente "${it.exercicio}".`);
        continue;
      }
      if (t.versao === "casa" && ex.local === "academia") erros.push(`${t.id}: "${it.exercicio}" é só de academia, mas está na versão de casa.`);
      if (t.versao === "academia" && ex.local === "casa") erros.push(`${t.id}: "${it.exercicio}" é só de casa, mas está na versão de academia.`);
      if (!it.reps && !it.tempoSeg) erros.push(`${t.id}/${it.exercicio}: informe repetições ou tempo.`);
      if (it.series < 1) erros.push(`${t.id}/${it.exercicio}: séries inválidas.`);
      if (it.descansoSeg < 0) erros.push(`${t.id}/${it.exercicio}: descanso inválido.`);
      if (!it.cadencia || !it.progressao) erros.push(`${t.id}/${it.exercicio}: cadência e progressão são obrigatórias.`);
    }
  }

  // Receitas
  if (receitas.length < 40) erros.push(`São necessárias pelo menos 40 receitas (há ${receitas.length}).`);
  const ids = new Set<string>();
  for (const r of receitas) {
    if (ids.has(r.id)) erros.push(`Id de receita repetido: ${r.id}`);
    ids.add(r.id);
    if (r.ingredientes.length === 0) erros.push(`${r.id}: sem ingredientes.`);
    if (r.preparo.length === 0) erros.push(`${r.id}: sem modo de preparo.`);
    if (r.porcoes < 1) erros.push(`${r.id}: porções inválidas.`);
    if (r.proteinaG <= 0) erros.push(`${r.id}: informe a proteína aproximada.`);
    for (const ing of r.ingredientes) {
      if (!ingredientes[ing.item]) erros.push(`${r.id}: ingrediente fora do catálogo "${ing.item}".`);
    }
  }

  // Cardápio
  if (cardapio14Dias.length !== 14) erros.push(`O cardápio deve ter 14 dias (tem ${cardapio14Dias.length}).`);
  cardapio14Dias.forEach((dia, idx) => {
    for (const ref of ORDEM_REFEICOES) {
      const r = obterReceita(dia[ref]);
      if (!r) erros.push(`Cardápio dia ${idx + 1}/${ref}: receita inexistente "${dia[ref]}".`);
      else if (r.refeicao !== ref) erros.push(`Cardápio dia ${idx + 1}: "${r.id}" é de ${r.refeicao}, mas está no ${ref}.`);
    }
  });
  for (const [fase, trocas] of Object.entries(trocasPorFase)) {
    for (const [de, para] of Object.entries(trocas)) {
      const a = obterReceita(de);
      const b = obterReceita(para);
      if (!a || !b) erros.push(`Troca da fase ${fase}: receita inexistente (${de} → ${para}).`);
      else if (a.refeicao !== b.refeicao) erros.push(`Troca da fase ${fase}: ${de} e ${para} são de refeições diferentes.`);
    }
  }

  return erros;
}
