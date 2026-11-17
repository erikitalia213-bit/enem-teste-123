import { exerciciosComImagem } from "@/content/imagens-exercicios.gerado";

const disponiveis = new Set(exerciciosComImagem);

/** O exercício já tem as imagens de início e fim em /public/exercicios? */
export function temImagem(slug: string): boolean {
  return disponiveis.has(slug);
}
