import type { ItemTreino, LetraTreino, LocalTreino, Nivel, NumeroFase, Treino, VersaoTreino } from "@/content/tipos";
import { estimarDuracaoMin, obterTreinoBase } from "@/content/protocolo";

/**
 * Monta o treino final de um dia: escolhe a versão (academia/casa) e aplica o nível.
 * - Iniciante: uma série a menos na Fase 1 (mínimo 2) nos exercícios com 3+ séries.
 * - Estagnada: recebe as técnicas avançadas extras a partir da Fase 2.
 */
export function montarTreino(fase: NumeroFase, letra: LetraTreino, versao: VersaoTreino, nivel: Nivel): Treino {
  const base = obterTreinoBase(fase, letra, versao);
  const itens: ItemTreino[] = base.itens.map(({ tecnicaSeEstagnada, ...item }) => {
    const final: ItemTreino = { ...item };
    if (nivel === "iniciante" && fase === 1 && final.series >= 3) {
      final.series = Math.max(2, final.series - 1);
    }
    if (nivel === "estagnada" && fase >= 2 && tecnicaSeEstagnada) {
      final.tecnica = final.tecnica ? `${final.tecnica} ${tecnicaSeEstagnada}` : tecnicaSeEstagnada;
    }
    return final;
  });
  return { ...base, itens, duracaoMin: estimarDuracaoMin(itens) };
}

/** Versão do treino a usar: o local da aluna, ou a escolha do dia quando ela treina nos dois. */
export function resolverVersao(local: LocalTreino, escolha?: VersaoTreino | null): VersaoTreino {
  if (local === "academia" || local === "casa") return local;
  return escolha ?? "academia";
}
