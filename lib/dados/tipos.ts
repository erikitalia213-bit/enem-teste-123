import type { LocalTreino, Nivel, Objetivo, Refeicao } from "@/content/tipos";
import type { AjustePlano } from "@/lib/protocolo/calendario";
import type { DataISO } from "@/lib/datas";

export interface Usuario {
  id: string;
  email: string;
}

export interface Perfil {
  id: string;
  nome: string | null;
  email: string;
  local_treino: LocalTreino | null;
  dias_semana: number | null;
  objetivo: Objetivo | null;
  nivel: Nivel | null;
  data_inicio: DataISO | null;
  onboarding_completo: boolean;
  ajustes_plano: AjustePlano[];
}

/** Perfil com onboarding concluído: todos os campos do plano preenchidos. */
export interface PerfilCompleto extends Perfil {
  local_treino: LocalTreino;
  dias_semana: number;
  objetivo: Objetivo;
  nivel: Nivel;
  data_inicio: DataISO;
  onboarding_completo: true;
}

export function perfilCompleto(p: Perfil | null): p is PerfilCompleto {
  return Boolean(p && p.onboarding_completo && p.local_treino && p.dias_semana && p.objetivo && p.nivel && p.data_inicio);
}

export type AtualizacaoPerfil = Partial<Omit<Perfil, "id" | "email">>;

export interface TreinoConcluido {
  dia_protocolo: number;
  treino_id: string;
  concluido_em: string;
}

export interface RefeicaoMarcada {
  data: DataISO;
  refeicao: Refeicao;
  receita_id: string;
}

/** Tudo que as telas precisam ler/gravar. Duas implementações: Supabase e memória (E2E). */
export interface Repositorio {
  usuarioAtual(): Promise<Usuario | null>;
  temAcesso(usuario: Usuario): Promise<boolean>;
  obterPerfil(usuario: Usuario): Promise<Perfil | null>;
  atualizarPerfil(usuario: Usuario, dados: AtualizacaoPerfil): Promise<void>;
  listarTreinos(usuario: Usuario): Promise<TreinoConcluido[]>;
  concluirTreino(usuario: Usuario, dia: number, treinoId: string): Promise<void>;
  desfazerTreino(usuario: Usuario, dia: number): Promise<void>;
  apagarTreinos(usuario: Usuario): Promise<void>;
  listarRefeicoes(usuario: Usuario, de: DataISO, ate: DataISO): Promise<RefeicaoMarcada[]>;
  marcarRefeicao(usuario: Usuario, data: DataISO, refeicao: Refeicao, receitaId: string): Promise<void>;
  desmarcarRefeicao(usuario: Usuario, data: DataISO, refeicao: Refeicao): Promise<void>;
  sair(): Promise<void>;
}
