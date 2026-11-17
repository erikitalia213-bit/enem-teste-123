import { addDays, differenceInCalendarDays, format, getDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FUSO_HORARIO } from "./config";

/** Datas do app trafegam como string ISO "yyyy-MM-dd" (sem horário, sem fuso). */
export type DataISO = string;

const RE_DATA = /^\d{4}-\d{2}-\d{2}$/;

export function ehDataISO(valor: unknown): valor is DataISO {
  return typeof valor === "string" && RE_DATA.test(valor) && !Number.isNaN(parseISO(valor).getTime());
}

/** "Hoje" no fuso de Brasília (ou outro informado), independente do fuso do servidor. */
export function hojeISO(agora: Date = new Date(), fuso: string = FUSO_HORARIO): DataISO {
  return new Intl.DateTimeFormat("en-CA", { timeZone: fuso, year: "numeric", month: "2-digit", day: "2-digit" }).format(agora);
}

export function somarDias(data: DataISO, dias: number): DataISO {
  return format(addDays(parseISO(data), dias), "yyyy-MM-dd");
}

/** Diferença em dias de calendário: a − b. */
export function diferencaDias(a: DataISO, b: DataISO): number {
  return differenceInCalendarDays(parseISO(a), parseISO(b));
}

/** 0 = domingo, 1 = segunda ... 6 = sábado */
export function diaDaSemana(data: DataISO): number {
  return getDay(parseISO(data));
}

export function formatarData(data: DataISO, padrao = "d 'de' MMMM"): string {
  return format(parseISO(data), padrao, { locale: ptBR });
}

/** Dias até 31/12 do ano corrente (0 no próprio dia 31). Depois do Réveillon, conta para o próximo. */
export function diasAteReveillon(hoje: DataISO): number {
  const ano = Number(hoje.slice(0, 4));
  const alvo = `${ano}-12-31`;
  const dif = diferencaDias(alvo, hoje);
  return dif >= 0 ? dif : diferencaDias(`${ano + 1}-12-31`, hoje);
}

export const NOME_DIA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
export const NOME_DIA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;
