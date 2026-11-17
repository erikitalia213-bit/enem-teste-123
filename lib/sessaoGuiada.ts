import { exigirExercicio } from "@/content/exercicios";
import { rotinaDescanso } from "@/content/protocolo";
import type { ItemTreino, Nivel, NumeroFase, LetraTreino, VersaoTreino } from "@/content/tipos";
import { temImagem } from "@/lib/imagens";
import { montarTreino } from "@/lib/protocolo/montarTreino";

/** Exercício já com tudo que o modo guiado precisa exibir (serializável para o cliente). */
export interface ItemGuiado extends ItemTreino {
  nome: string;
  equipamento: string;
  passos: string[];
  ondeSentir: string;
  erroComum: string;
  dicaDeOuro: string;
  temImagem: boolean;
}

export interface SessaoGuiada {
  /** Valor gravado em treinos_concluidos.treino_id */
  id: string;
  titulo: string;
  foco: string;
  duracaoMin: number;
  aquecimento: string[];
  itens: ItemGuiado[];
}

function enriquecer(itens: ItemTreino[]): ItemGuiado[] {
  return itens.map((it) => {
    const e = exigirExercicio(it.exercicio);
    return {
      ...it,
      nome: e.nome,
      equipamento: e.equipamento,
      passos: e.passos,
      ondeSentir: e.ondeSentir,
      erroComum: e.erroComum,
      dicaDeOuro: e.dicaDeOuro,
      temImagem: temImagem(e.slug),
    };
  });
}

export function sessaoDeTreino(fase: NumeroFase, letra: LetraTreino, versao: VersaoTreino, nivel: Nivel): SessaoGuiada {
  const t = montarTreino(fase, letra, versao, nivel);
  return { id: t.id, titulo: `${t.nome} · ${versao === "casa" ? "Casa" : "Academia"}`, foco: t.foco, duracaoMin: t.duracaoMin, aquecimento: t.aquecimento, itens: enriquecer(t.itens) };
}

export function sessaoDeDescanso(): SessaoGuiada {
  return {
    id: rotinaDescanso.id,
    titulo: rotinaDescanso.nome,
    foco: rotinaDescanso.descricao,
    duracaoMin: rotinaDescanso.duracaoMin,
    aquecimento: [],
    itens: enriquecer(rotinaDescanso.itens),
  };
}
