import { z } from "zod";
import type { LetraTreino, LocalTreino, NumeroFase } from "@/content/tipos";
import { TOTAL_DIAS } from "@/lib/config";
import { type DataISO, diaDaSemana, diferencaDias, somarDias } from "@/lib/datas";

/**
 * Gerador do calendário de 42 dias.
 *
 * O plano NÃO é salvo no banco: ele é calculado de forma determinística a partir da
 * data de início, dos dias por semana, do local e do histórico de ajustes. Assim,
 * editar o conteúdo em /content atualiza o plano de todas as alunas.
 */

/** Dias de treino por semana → dias da semana (0 = dom, 1 = seg ... 6 = sáb). */
export const DIAS_TREINO: Record<number, readonly number[]> = {
  2: [1, 4], // seg e qui
  3: [1, 3, 5], // seg, qua, sex
  4: [1, 2, 4, 5], // seg, ter, qui, sex
  5: [1, 2, 3, 5, 6], // seg, ter, qua, sex, sáb
  6: [1, 2, 3, 4, 5, 6], // seg a sáb
};

export const ajusteSchema = z.object({
  desde_dia: z.number().int().min(1).max(TOTAL_DIAS),
  dias_semana: z.number().int().min(2).max(6),
  local_treino: z.enum(["academia", "casa", "ambos"]),
});
export type AjustePlano = z.infer<typeof ajusteSchema>;

/** Lê o jsonb `ajustes_plano` com segurança (ignora itens inválidos). */
export function lerAjustes(valor: unknown): AjustePlano[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .map((v) => ajusteSchema.safeParse(v))
    .filter((r) => r.success)
    .map((r) => r.data)
    .sort((a, b) => a.desde_dia - b.desde_dia);
}

export interface ConfigPlano {
  dataInicio: DataISO;
  diasSemana: number;
  localTreino: LocalTreino;
  ajustes?: AjustePlano[];
}

export type TipoDia = "treino" | "descanso";

export interface DiaPlano {
  dia: number;
  data: DataISO;
  semana: number;
  fase: NumeroFase;
  diaSemana: number;
  tipo: TipoDia;
  letra: LetraTreino | null;
  /** "f2-B" para treino ou "descanso-ativo". */
  base: string;
  local: LocalTreino;
  diasSemana: number;
}

export const ID_DESCANSO = "descanso-ativo";

export function semanaDoDia(dia: number): number {
  return Math.min(6, Math.max(1, Math.ceil(dia / 7)));
}

export function faseDoDia(dia: number): NumeroFase {
  const semana = semanaDoDia(dia);
  return semana <= 2 ? 1 : semana <= 4 ? 2 : 3;
}

export function primeiroDiaDaFase(fase: NumeroFase): number {
  return (fase - 1) * 14 + 1;
}

/** Configuração em vigor num dia, considerando os ajustes feitos no perfil. */
export function configNoDia(config: ConfigPlano, dia: number): { diasSemana: number; local: LocalTreino } {
  let diasSemana = config.diasSemana;
  let local = config.localTreino;
  for (const a of config.ajustes ?? []) {
    if (a.desde_dia <= dia) {
      diasSemana = a.dias_semana;
      local = a.local_treino;
    }
  }
  return { diasSemana, local };
}

/** Letras em rodízio: 2–3 dias/semana usam A, B, C; 4 ou mais usam A, B, C, D. */
export function letrasDoRodizio(diasSemana: number): LetraTreino[] {
  return diasSemana >= 4 ? ["A", "B", "C", "D"] : ["A", "B", "C"];
}

export function gerarCalendario(config: ConfigPlano): DiaPlano[] {
  const dias: DiaPlano[] = [];
  let faseAtual: NumeroFase | null = null;
  let indiceNaFase = 0;

  for (let dia = 1; dia <= TOTAL_DIAS; dia++) {
    const data = somarDias(config.dataInicio, dia - 1);
    const fase = faseDoDia(dia);
    if (fase !== faseAtual) {
      faseAtual = fase;
      indiceNaFase = 0; // cada fase começa pelo treino A
    }
    const { diasSemana, local } = configNoDia(config, dia);
    const dSemana = diaDaSemana(data);
    const ehTreino = (DIAS_TREINO[diasSemana] ?? DIAS_TREINO[3]!).includes(dSemana);

    let letra: LetraTreino | null = null;
    if (ehTreino) {
      const letras = letrasDoRodizio(diasSemana);
      letra = letras[indiceNaFase % letras.length]!;
      indiceNaFase++;
    }

    dias.push({
      dia,
      data,
      semana: semanaDoDia(dia),
      fase,
      diaSemana: dSemana,
      tipo: ehTreino ? "treino" : "descanso",
      letra,
      base: letra ? `f${fase}-${letra}` : ID_DESCANSO,
      local,
      diasSemana,
    });
  }
  return dias;
}

/** Dia do protocolo para uma data (pode ser < 1 antes do início ou > 42 depois do fim). */
export function diaDoProtocolo(dataInicio: DataISO, hoje: DataISO): number {
  return diferencaDias(hoje, dataInicio) + 1;
}

/**
 * Registra uma mudança de rotina feita no perfil, preservando o histórico.
 * Os dias anteriores a `diaAtual` continuam com a configuração antiga.
 */
export function registrarAjuste(
  atual: { diasSemana: number; localTreino: LocalTreino; ajustes: AjustePlano[] },
  novo: { diasSemana: number; localTreino: LocalTreino },
  diaAtual: number,
): AjustePlano[] {
  const desde = Math.min(TOTAL_DIAS, Math.max(1, diaAtual));
  if (desde === 1) return [];
  const anteriores = atual.ajustes.filter((a) => a.desde_dia < desde);
  if (anteriores.length === 0) {
    anteriores.push({ desde_dia: 1, dias_semana: atual.diasSemana, local_treino: atual.localTreino });
  }
  return [...anteriores, { desde_dia: desde, dias_semana: novo.diasSemana, local_treino: novo.localTreino }];
}
