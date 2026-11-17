"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { obterReceita } from "@/content/receitas";
import { TOTAL_DIAS } from "@/lib/config";
import { ehDataISO, hojeISO } from "@/lib/datas";
import { perfilCompleto } from "@/lib/dados/tipos";
import { montarPlano } from "@/lib/plano";
import { ID_DESCANSO, registrarAjuste } from "@/lib/protocolo/calendario";
import { limparNome } from "@/lib/quiz";
import { exigirAcesso, exigirAlunaPronta } from "@/lib/sessao";

export type ResultadoAcao = { ok: true } | { ok: false; erro: string };

const local = z.enum(["academia", "casa", "ambos"]);
const objetivo = z.enum(["volume", "empinado", "firme", "flacidez"]);
const nivel = z.enum(["iniciante", "intermediario", "estagnada"]);
const dias = z.number().int().min(2).max(6);

function revalidarTudo() {
  for (const p of ["/hoje", "/treino", "/jornada", "/cardapio", "/perfil"]) revalidatePath(p);
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------
const onboardingSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome.").max(40),
  local_treino: local,
  dias_semana: dias,
  objetivo,
  nivel,
});

export async function concluirOnboarding(dados: z.input<typeof onboardingSchema>): Promise<ResultadoAcao> {
  const { repo, usuario } = await exigirAcesso();
  const v = onboardingSchema.safeParse(dados);
  if (!v.success) return { ok: false, erro: v.error.issues[0]?.message ?? "Dados inválidos." };
  await repo.atualizarPerfil(usuario, {
    ...v.data,
    nome: limparNome(v.data.nome) ?? v.data.nome,
    data_inicio: hojeISO(),
    onboarding_completo: true,
    ajustes_plano: [],
  });
  // Sem revalidatePath aqui: revalidar re-renderizaria /onboarding (que redireciona
  // quem já concluiu) antes de a tela de comemoração aparecer. As telas são dinâmicas.
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Treino
// ---------------------------------------------------------------------------
export async function concluirTreinoDoDia(dia: number, treinoId: string): Promise<ResultadoAcao> {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  if (!Number.isInteger(dia) || dia < 1 || dia > TOTAL_DIAS) return { ok: false, erro: "Dia inválido." };
  const plano = montarPlano(perfil);
  if (dia > plano.diaReal) return { ok: false, erro: "Esse dia ainda não chegou." };
  const doDia = plano.calendario[dia - 1]!;
  const esperado = doDia.tipo === "descanso" ? treinoId === ID_DESCANSO : treinoId.startsWith(`${doDia.base}-`);
  if (!esperado) return { ok: false, erro: "Treino não corresponde ao dia." };
  await repo.concluirTreino(usuario, dia, treinoId);
  revalidarTudo();
  return { ok: true };
}

export async function desfazerTreinoDoDia(dia: number): Promise<ResultadoAcao> {
  const { repo, usuario } = await exigirAlunaPronta();
  if (!Number.isInteger(dia) || dia < 1 || dia > TOTAL_DIAS) return { ok: false, erro: "Dia inválido." };
  await repo.desfazerTreino(usuario, dia);
  revalidarTudo();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Refeições
// ---------------------------------------------------------------------------
export async function marcarRefeicao(data: string, refeicao: string, receitaId: string, marcada: boolean): Promise<ResultadoAcao> {
  const { repo, usuario } = await exigirAlunaPronta();
  const ref = z.enum(["cafe", "almoco", "lanche", "jantar"]).safeParse(refeicao);
  if (!ehDataISO(data) || !ref.success) return { ok: false, erro: "Refeição inválida." };
  if (data > hojeISO()) return { ok: false, erro: "Só dá para marcar refeições de hoje ou de dias anteriores." };
  if (marcada) {
    const receita = obterReceita(receitaId);
    if (!receita || receita.refeicao !== ref.data) return { ok: false, erro: "Receita inválida." };
    await repo.marcarRefeicao(usuario, data, ref.data, receitaId);
  } else {
    await repo.desmarcarRefeicao(usuario, data, ref.data);
  }
  revalidatePath("/hoje");
  revalidatePath("/cardapio");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------
const dadosSchema = z.object({ nome: z.string().trim().min(2, "Digite seu nome.").max(40), objetivo, nivel });

export async function salvarDados(dados: z.input<typeof dadosSchema>): Promise<ResultadoAcao> {
  const { repo, usuario } = await exigirAlunaPronta();
  const v = dadosSchema.safeParse(dados);
  if (!v.success) return { ok: false, erro: v.error.issues[0]?.message ?? "Dados inválidos." };
  await repo.atualizarPerfil(usuario, { ...v.data, nome: limparNome(v.data.nome) ?? v.data.nome });
  revalidarTudo();
  return { ok: true };
}

/** Troca local e/ou dias por semana a partir de hoje, mantendo o histórico. */
export async function salvarRotina(dados: { local_treino: string; dias_semana: number }): Promise<ResultadoAcao> {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const v = z.object({ local_treino: local, dias_semana: dias }).safeParse(dados);
  if (!v.success) return { ok: false, erro: "Dados inválidos." };
  if (!perfilCompleto(perfil)) return { ok: false, erro: "Complete o onboarding primeiro." };
  const plano = montarPlano(perfil);
  const ajustes = registrarAjuste(
    { diasSemana: perfil.dias_semana, localTreino: perfil.local_treino, ajustes: perfil.ajustes_plano },
    { diasSemana: v.data.dias_semana, localTreino: v.data.local_treino },
    plano.diaAtual,
  );
  await repo.atualizarPerfil(usuario, { local_treino: v.data.local_treino, dias_semana: v.data.dias_semana, ajustes_plano: ajustes });
  revalidarTudo();
  return { ok: true };
}

/** Recomeça do dia 1 hoje. Apaga os treinos marcados (as refeições ficam). */
export async function reiniciarProtocolo(): Promise<ResultadoAcao> {
  const { repo, usuario } = await exigirAlunaPronta();
  await repo.apagarTreinos(usuario);
  await repo.atualizarPerfil(usuario, { data_inicio: hojeISO(), ajustes_plano: [] });
  revalidarTudo();
  return { ok: true };
}
