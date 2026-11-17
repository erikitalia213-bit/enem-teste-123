import type { NumeroFase } from "@/content/tipos";
import { TOTAL_DIAS } from "@/lib/config";
import { type DiaPlano, primeiroDiaDaFase } from "./calendario";

/**
 * Sequência de dias seguidos cumpridos (treino ou descanso ativo concluído).
 * Se o dia de hoje ainda não foi concluído, ele não quebra a sequência: a contagem
 * começa de ontem.
 */
export function calcularSequencia(concluidos: ReadonlySet<number>, diaHoje: number): number {
  const ultimo = Math.min(diaHoje, TOTAL_DIAS);
  let dia = concluidos.has(ultimo) ? ultimo : ultimo - 1;
  let seq = 0;
  while (dia >= 1 && concluidos.has(dia)) {
    seq++;
    dia--;
  }
  return seq;
}

export interface ProgressoFase {
  fase: NumeroFase;
  totalTreinos: number;
  treinosFeitos: number;
  diasNaFase: number;
  diasPassados: number;
  /** 0 a 1, pelos dias corridos da fase. */
  pctTempo: number;
  /** 0 a 1, pelos treinos concluídos da fase. */
  pctTreinos: number;
  medalha: boolean;
}

export function progressoDaFase(
  calendario: DiaPlano[],
  concluidos: ReadonlySet<number>,
  fase: NumeroFase,
  diaHoje: number,
): ProgressoFase {
  const dias = calendario.filter((d) => d.fase === fase);
  const treinos = dias.filter((d) => d.tipo === "treino");
  const feitos = treinos.filter((d) => concluidos.has(d.dia)).length;
  const inicio = primeiroDiaDaFase(fase);
  const diasPassados = Math.min(dias.length, Math.max(0, diaHoje - inicio + 1));
  return {
    fase,
    totalTreinos: treinos.length,
    treinosFeitos: feitos,
    diasNaFase: dias.length,
    diasPassados,
    pctTempo: dias.length ? diasPassados / dias.length : 0,
    pctTreinos: treinos.length ? feitos / treinos.length : 0,
    medalha: treinos.length > 0 && feitos === treinos.length,
  };
}

export type EstadoDia = "concluido" | "hoje" | "perdido" | "bloqueado";

/** Estado visual de um dia na jornada: dias futuros ficam bloqueados até chegarem. */
export function estadoDoDia(dia: number, diaHoje: number, concluidos: ReadonlySet<number>): EstadoDia {
  if (concluidos.has(dia)) return "concluido";
  if (dia === diaHoje) return "hoje";
  if (dia > diaHoje) return "bloqueado";
  return "perdido";
}

/** Um dia pode ser aberto se já chegou (dias passados podem ser recuperados). */
export function diaLiberado(dia: number, diaHoje: number): boolean {
  return dia >= 1 && dia <= TOTAL_DIAS && dia <= diaHoje;
}
