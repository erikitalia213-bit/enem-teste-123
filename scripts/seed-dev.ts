/**
 * Seed de desenvolvimento: cria uma COMPRA APROVADA fake e uma USUÁRIA DE TESTE,
 * e imprime um link de acesso direto (sem precisar de e-mail).
 *
 * Uso:
 *   npm run seed:dev
 *   npm run seed:dev -- --email=outra@teste.com --nome=Bia
 *   npm run seed:dev -- --pronta --dias=10     (já com onboarding feito, no dia 10, com treinos marcados)
 *
 * Por segurança, só roda em Supabase local (localhost/127.0.0.1). Para um projeto de
 * desenvolvimento na nuvem, acrescente --projeto-de-testes (NUNCA no projeto de produção:
 * a compra fake libera acesso de verdade).
 */
import { createClient } from "@supabase/supabase-js";
import { gerarCalendario } from "../lib/protocolo/calendario";
import { hojeISO, somarDias } from "../lib/datas";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
) as Record<string, string>;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");

function sair(msg: string): never {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

if (!url || !chave) sair("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.");
const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url);
if (!local && args["projeto-de-testes"] !== "true") {
  sair(`${url} não é um Supabase local. Se for um projeto SÓ de testes, rode de novo com --projeto-de-testes.`);
}

const email = (args.email ?? "aluna.teste@exemplo.com").toLowerCase();
const nome = args.nome ?? "Aluna";
const admin = createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });

async function principal() {
  // 1) Compra aprovada fake (idempotente pelo transacao_id)
  const { error: erroCompra } = await admin.from("compras").upsert(
    {
      email,
      nome,
      provedor: "wiapy",
      transacao_id: `SEED-DEV-${email}`,
      status: "aprovada",
      produto: "Protocolo 42 Dias: Bumbum pro Réveillon (seed de desenvolvimento)",
      valor: 0,
      payload: { seed: true, criado_em: new Date().toISOString() },
    },
    { onConflict: "transacao_id" },
  );
  if (erroCompra) sair(`Erro ao criar compra: ${erroCompra.message}`);
  console.log(`✔ Compra aprovada fake para ${email}`);

  // 2) Usuária no Auth (o gatilho cria o profile)
  let { data: perfil } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (!perfil) {
    const { data, error } = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { nome } });
    if (error && !/already/i.test(error.message)) sair(`Erro ao criar usuária: ${error.message}`);
    if (data.user) perfil = { id: data.user.id };
    if (!perfil) ({ data: perfil } = await admin.from("profiles").select("id").eq("email", email).maybeSingle());
  }
  if (!perfil) sair("Usuária criada, mas o profile não apareceu. A migration foi aplicada?");
  console.log(`✔ Usuária de teste: ${email} (${perfil.id})`);

  // 3) Opcional: onboarding pronto, já no meio do protocolo
  if (args.pronta === "true") {
    const dia = Math.min(42, Math.max(1, Number(args.dias ?? 1)));
    const dataInicio = somarDias(hojeISO(), -(dia - 1));
    const { error } = await admin
      .from("profiles")
      .update({ nome, local_treino: "ambos", dias_semana: 4, objetivo: "empinado", nivel: "intermediario", data_inicio: dataInicio, onboarding_completo: true, ajustes_plano: [] })
      .eq("id", perfil.id);
    if (error) sair(`Erro ao preparar perfil: ${error.message}`);
    const cal = gerarCalendario({ dataInicio, diasSemana: 4, localTreino: "ambos" });
    const feitos = cal
      .filter((d) => d.dia < dia)
      .map((d) => ({ user_id: perfil!.id, dia_protocolo: d.dia, treino_id: d.tipo === "treino" ? `${d.base}-academia` : "descanso-ativo" }));
    await admin.from("treinos_concluidos").delete().eq("user_id", perfil.id);
    if (feitos.length) {
      const { error: e2 } = await admin.from("treinos_concluidos").insert(feitos);
      if (e2) sair(`Erro ao marcar treinos: ${e2.message}`);
    }
    console.log(`✔ Onboarding pronto: dia ${dia} de 42, ${feitos.length} dias concluídos`);
  }

  // 4) Link de acesso direto (sem e-mail)
  const { data: link, error: erroLink } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (erroLink || !link.properties?.hashed_token) sair(`Erro ao gerar link: ${erroLink?.message ?? "sem token"}`);
  console.log("\nAbra este link no navegador para entrar (vale 1 hora, uso único):");
  console.log(`${appUrl}/auth/confirmar?token_hash=${link.properties.hashed_token}&type=magiclink&next=/hoje\n`);
}

principal().catch((e) => sair(e instanceof Error ? e.message : String(e)));
