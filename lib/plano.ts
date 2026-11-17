import type { NumeroFase } from "@/content/tipos";
import { fases } from "@/content/protocolo";
import { TOTAL_DIAS } from "@/lib/config";
import { type DataISO, hojeISO } from "@/lib/datas";
import type { PerfilCompleto, TreinoConcluido } from "@/lib/dados/tipos";
import { type ConfigPlano, type DiaPlano, diaDoProtocolo, faseDoDia, gerarCalendario } from "./protocolo/calendario";

export interface PlanoAluna {
  config: ConfigPlano;
  calendario: DiaPlano[];
  hoje: DataISO;
  /** Dia real do protocolo (pode passar de 42 quando terminou). */
  diaReal: number;
  /** Dia limitado entre 1 e 42, para telas que mostram "o dia atual". */
  diaAtual: number;
  terminou: boolean;
  fase: NumeroFase;
  nomeFase: string;
  diaHojePlano: DiaPlano;
}

export function configDoPerfil(p: PerfilCompleto): ConfigPlano {
  return { dataInicio: p.data_inicio, diasSemana: p.dias_semana, localTreino: p.local_treino, ajustes: p.ajustes_plano };
}

export function montarPlano(perfil: PerfilCompleto, hoje: DataISO = hojeISO()): PlanoAluna {
  const config = configDoPerfil(perfil);
  const calendario = gerarCalendario(config);
  const diaReal = diaDoProtocolo(perfil.data_inicio, hoje);
  const diaAtual = Math.min(TOTAL_DIAS, Math.max(1, diaReal));
  const fase = faseDoDia(diaAtual);
  return {
    config,
    calendario,
    hoje,
    diaReal,
    diaAtual,
    terminou: diaReal > TOTAL_DIAS,
    fase,
    nomeFase: fases[fase - 1]!.nome,
    diaHojePlano: calendario[diaAtual - 1]!,
  };
}

export function diasConcluidos(treinos: TreinoConcluido[]): Set<number> {
  return new Set(treinos.map((t) => t.dia_protocolo));
}
