import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { RegistroCompra } from "@/lib/webhooks/processarCompra";
import wiapyAprovada from "@/lib/webhooks/exemplos/wiapy-aprovada.json";
import wiapyReembolso from "@/lib/webhooks/exemplos/wiapy-reembolso.json";

// Banco e e-mail em memória no lugar do Supabase.
const estado = vi.hoisted(() => ({
  compras: new Map<string, RegistroCompra>(),
  logs: [] as { origem: string; observacao?: string; corpoJson: unknown }[],
  envios: [] as string[],
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/env", () => ({ supabaseConfigurado: true, supabaseUrl: "http://x", supabaseAnonKey: "anon" }));
vi.mock("@/lib/webhooks/depsSupabase", () => ({
  depsSupabase: () => ({
    buscarCompra: async (id: string) => {
      const c = estado.compras.get(id);
      return c ? { status: c.status } : null;
    },
    salvarCompra: async (c: RegistroCompra) => void estado.compras.set(c.transacao_id, c),
    enviarAcesso: async (email: string) => {
      estado.envios.push(email);
      return "convite" as const;
    },
  }),
  registrarLogWebhook: async (log: { origem: string; observacao?: string; corpoJson: unknown }) => void estado.logs.push(log),
}));

const { POST } = await import("@/app/api/webhooks/[provedor]/route");
const { POST: POST_DEBUG } = await import("@/app/api/webhooks/debug/route");

function requisicao(url: string, corpo: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(url, { method: "POST", body: typeof corpo === "string" ? corpo : JSON.stringify(corpo), headers: { "content-type": "application/json", ...headers } });
}
const ctx = (provedor: string) => ({ params: Promise.resolve({ provedor }) });

describe("POST /api/webhooks/[provedor]", () => {
  beforeEach(() => {
    estado.compras.clear();
    estado.logs.length = 0;
    estado.envios.length = 0;
    process.env.WEBHOOK_SECRET_WIAPY = "segredo-wiapy";
    process.env.WEBHOOK_SECRET_DEBUG = "segredo-debug";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
    delete process.env.WEBHOOK_PRODUTOS_ACEITOS;
  });

  it("recusa token inválido", async () => {
    const r = await POST(requisicao("http://app/api/webhooks/wiapy?token=errado", wiapyAprovada), ctx("wiapy"));
    expect(r.status).toBe(401);
    expect(estado.compras.size).toBe(0);
  });

  it("recusa provedor desconhecido", async () => {
    const r = await POST(requisicao("http://app/api/webhooks/hotmart?token=x", {}), ctx("hotmart"));
    expect(r.status).toBe(404);
  });

  it("aprova, é idempotente e bloqueia no reembolso", async () => {
    const url = "http://app/api/webhooks/wiapy?token=segredo-wiapy";
    const r1 = await POST(requisicao(url, wiapyAprovada), ctx("wiapy"));
    expect(r1.status).toBe(200);
    expect(await r1.json()).toMatchObject({ ok: true, acao: "criada", acesso: "convite-enviado" });

    const r2 = await POST(requisicao(url, wiapyAprovada), ctx("wiapy"));
    expect(await r2.json()).toMatchObject({ acao: "sem-mudanca" });
    expect(estado.envios).toHaveLength(1);

    const r3 = await POST(requisicao(url, wiapyReembolso, { "x-webhook-token": "segredo-wiapy" }), ctx("wiapy"));
    expect(await r3.json()).toMatchObject({ acao: "atualizada", acesso: "bloqueado" });
    expect(estado.compras.get("WP-77881")!.status).toBe("reembolsada");
  });

  it("payload irreconhecível vai para webhook_logs com 422", async () => {
    const r = await POST(requisicao("http://app/api/webhooks/wiapy?token=segredo-wiapy", { status: "paid", foo: 1 }), ctx("wiapy"));
    expect(r.status).toBe(422);
    expect(estado.logs).toHaveLength(1);
    expect(estado.logs[0]!.observacao).toMatch(/não reconhecido/);
  });

  it("sem segredo configurado responde 503", async () => {
    delete process.env.WEBHOOK_SECRET_WIAPY;
    const r = await POST(requisicao("http://app/api/webhooks/wiapy?token=x", wiapyAprovada), ctx("wiapy"));
    expect(r.status).toBe(503);
  });
});

describe("POST /api/webhooks/debug", () => {
  beforeEach(() => {
    estado.logs.length = 0;
    process.env.WEBHOOK_SECRET_DEBUG = "segredo-debug";
  });

  it("salva o payload cru e não libera acesso", async () => {
    const r = await POST_DEBUG(requisicao("http://app/api/webhooks/debug?token=segredo-debug&origem=wiapy", "texto qualquer"));
    expect(r.status).toBe(200);
    expect(estado.logs).toHaveLength(1);
    expect(estado.logs[0]!.origem).toBe("debug:wiapy");
    expect(estado.compras.size).toBe(0);
  });

  it("exige token e some quando o segredo não está definido", async () => {
    expect((await POST_DEBUG(requisicao("http://app/api/webhooks/debug?token=x", {}))).status).toBe(401);
    delete process.env.WEBHOOK_SECRET_DEBUG;
    expect((await POST_DEBUG(requisicao("http://app/api/webhooks/debug?token=x", {}))).status).toBe(404);
  });
});
