import "server-only";
import { lerAjustes } from "@/lib/protocolo/calendario";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Perfil, Repositorio } from "./tipos";

/** Repositório real: Supabase com a sessão da aluna (todas as consultas passam pelo RLS). */
export function repositorioSupabase(): Repositorio {
  const cliente = () => criarClienteServidor();

  const falhou = (acao: string, erro: { message: string } | null) => {
    if (erro) throw new Error(`${acao}: ${erro.message}`);
  };

  return {
    async usuarioAtual() {
      const sb = await cliente();
      const { data } = await sb.auth.getUser();
      if (!data.user?.email) return null;
      return { id: data.user.id, email: data.user.email.toLowerCase() };
    },

    async temAcesso() {
      const sb = await cliente();
      const { data, error } = await sb.rpc("tem_acesso");
      falhou("Erro ao verificar acesso", error);
      return data === true;
    },

    async obterPerfil(usuario) {
      const sb = await cliente();
      const { data, error } = await sb
        .from("profiles")
        .select("id, nome, email, local_treino, dias_semana, objetivo, nivel, data_inicio, onboarding_completo, ajustes_plano")
        .eq("id", usuario.id)
        .maybeSingle();
      falhou("Erro ao carregar perfil", error);
      if (!data) return null;
      return { ...(data as Omit<Perfil, "ajustes_plano">), ajustes_plano: lerAjustes(data.ajustes_plano) };
    },

    async atualizarPerfil(usuario, dados) {
      const sb = await cliente();
      // upsert cobre o caso raro de o gatilho não ter criado o perfil.
      const { error } = await sb.from("profiles").upsert({ id: usuario.id, email: usuario.email, ...dados }, { onConflict: "id" });
      falhou("Erro ao salvar perfil", error);
    },

    async listarTreinos(usuario) {
      const sb = await cliente();
      const { data, error } = await sb
        .from("treinos_concluidos")
        .select("dia_protocolo, treino_id, concluido_em")
        .eq("user_id", usuario.id)
        .order("dia_protocolo");
      falhou("Erro ao carregar treinos", error);
      return data ?? [];
    },

    async concluirTreino(usuario, dia, treinoId) {
      const sb = await cliente();
      const { error } = await sb
        .from("treinos_concluidos")
        .upsert({ user_id: usuario.id, dia_protocolo: dia, treino_id: treinoId, concluido_em: new Date().toISOString() }, { onConflict: "user_id,dia_protocolo" });
      falhou("Erro ao registrar treino", error);
    },

    async desfazerTreino(usuario, dia) {
      const sb = await cliente();
      const { error } = await sb.from("treinos_concluidos").delete().eq("user_id", usuario.id).eq("dia_protocolo", dia);
      falhou("Erro ao desfazer treino", error);
    },

    async apagarTreinos(usuario) {
      const sb = await cliente();
      const { error } = await sb.from("treinos_concluidos").delete().eq("user_id", usuario.id);
      falhou("Erro ao reiniciar treinos", error);
    },

    async listarRefeicoes(usuario, de, ate) {
      const sb = await cliente();
      const { data, error } = await sb
        .from("refeicoes_marcadas")
        .select("data, refeicao, receita_id")
        .eq("user_id", usuario.id)
        .gte("data", de)
        .lte("data", ate);
      falhou("Erro ao carregar refeições", error);
      return data ?? [];
    },

    async marcarRefeicao(usuario, data, refeicao, receitaId) {
      const sb = await cliente();
      const { error } = await sb
        .from("refeicoes_marcadas")
        .upsert({ user_id: usuario.id, data, refeicao, receita_id: receitaId }, { onConflict: "user_id,data,refeicao" });
      falhou("Erro ao marcar refeição", error);
    },

    async desmarcarRefeicao(usuario, data, refeicao) {
      const sb = await cliente();
      const { error } = await sb.from("refeicoes_marcadas").delete().eq("user_id", usuario.id).eq("data", data).eq("refeicao", refeicao);
      falhou("Erro ao desmarcar refeição", error);
    },

    async sair() {
      const sb = await cliente();
      await sb.auth.signOut();
    },
  };
}
