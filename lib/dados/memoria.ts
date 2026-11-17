import "server-only";
import { cookies } from "next/headers";
import { COOKIE_SESSAO_E2E, emailsAprovadosE2E } from "./modo";
import type { Perfil, RefeicaoMarcada, Repositorio, TreinoConcluido, Usuario } from "./tipos";

/**
 * Repositório em memória para o teste E2E (MODO_TESTE_E2E=1).
 * Vive enquanto o processo do servidor estiver de pé. Não use em produção.
 */
interface ContaMemoria {
  perfil: Perfil;
  treinos: Map<number, TreinoConcluido>;
  refeicoes: Map<string, RefeicaoMarcada>;
}

const global = globalThis as unknown as { __p42Memoria?: Map<string, ContaMemoria> };
const contas = (global.__p42Memoria ??= new Map());

function conta(usuario: Usuario): ContaMemoria {
  let c = contas.get(usuario.email);
  if (!c) {
    c = {
      perfil: {
        id: usuario.id,
        email: usuario.email,
        nome: null,
        local_treino: null,
        dias_semana: null,
        objetivo: null,
        nivel: null,
        data_inicio: null,
        onboarding_completo: false,
        ajustes_plano: [],
      },
      treinos: new Map(),
      refeicoes: new Map(),
    };
    contas.set(usuario.email, c);
  }
  return c;
}

export function idDoEmail(email: string): string {
  // id determinístico e estável no formato de UUID
  let h = 0;
  for (const ch of email) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const hex = h.toString(16).padStart(8, "0");
  return `${hex}-0000-4000-8000-${hex.padEnd(12, "0")}`;
}

export function repositorioMemoria(): Repositorio {
  return {
    async usuarioAtual() {
      const email = (await cookies()).get(COOKIE_SESSAO_E2E)?.value;
      return email ? { id: idDoEmail(email), email } : null;
    },
    async temAcesso(usuario) {
      return emailsAprovadosE2E().includes(usuario.email);
    },
    async obterPerfil(usuario) {
      return { ...conta(usuario).perfil };
    },
    async atualizarPerfil(usuario, dados) {
      const c = conta(usuario);
      c.perfil = { ...c.perfil, ...dados };
    },
    async listarTreinos(usuario) {
      return [...conta(usuario).treinos.values()].sort((a, b) => a.dia_protocolo - b.dia_protocolo);
    },
    async concluirTreino(usuario, dia, treinoId) {
      conta(usuario).treinos.set(dia, { dia_protocolo: dia, treino_id: treinoId, concluido_em: new Date().toISOString() });
    },
    async desfazerTreino(usuario, dia) {
      conta(usuario).treinos.delete(dia);
    },
    async apagarTreinos(usuario) {
      conta(usuario).treinos.clear();
    },
    async listarRefeicoes(usuario, de, ate) {
      return [...conta(usuario).refeicoes.values()].filter((r) => r.data >= de && r.data <= ate);
    },
    async marcarRefeicao(usuario, data, refeicao, receitaId) {
      conta(usuario).refeicoes.set(`${data}|${refeicao}`, { data, refeicao, receita_id: receitaId });
    },
    async desmarcarRefeicao(usuario, data, refeicao) {
      conta(usuario).refeicoes.delete(`${data}|${refeicao}`);
    },
    async sair() {
      (await cookies()).delete(COOKIE_SESSAO_E2E);
    },
  };
}
