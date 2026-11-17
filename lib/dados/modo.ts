/**
 * Modo de teste E2E: troca o Supabase por um banco em memória para o Playwright
 * rodar o fluxo completo sem serviços externos.
 * NUNCA é ativado na Vercel (a variável VERCEL existe em todo deploy de lá).
 */
export const modoTesteE2E = process.env.MODO_TESTE_E2E === "1" && !process.env.VERCEL;

export const COOKIE_SESSAO_E2E = "p42_e2e_sessao";

export function emailsAprovadosE2E(): string[] {
  return (process.env.E2E_EMAILS_APROVADOS ?? "aluna@teste.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
