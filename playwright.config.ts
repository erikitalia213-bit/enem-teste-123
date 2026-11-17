import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do fluxo principal: login → onboarding → hoje → concluir treino.
 * Roda o app em MODO_TESTE_E2E=1 (banco em memória, sem Supabase nem e-mail).
 * Para rodar contra um Supabase real, veja o README (seção "Testes").
 */
const PORTA = 3200;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: "off",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  },
  projects: [{ name: "celular", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORTA}`,
    port: PORTA,
    timeout: 240_000,
    reuseExistingServer: false,
    env: { MODO_TESTE_E2E: "1", E2E_EMAILS_APROVADOS: "aluna@teste.com", NEXT_PUBLIC_APP_URL: `http://localhost:${PORTA}` },
  },
});
