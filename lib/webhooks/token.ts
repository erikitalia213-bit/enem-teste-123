import { timingSafeEqual } from "node:crypto";

/** Cabeçalhos aceitos para o token secreto (o primeiro encontrado vale). */
export const CABECALHOS_TOKEN = ["x-webhook-token", "x-webhook-secret", "x-kirvano-token", "x-wiapy-token", "x-api-key", "token"];

/**
 * Procura o token enviado pelo provedor: cabeçalho, `Authorization: Bearer`,
 * query string (?token=) ou campo "token" no corpo JSON.
 */
export function extrairToken(headers: Headers, query: URLSearchParams, corpo: unknown): string | null {
  for (const h of CABECALHOS_TOKEN) {
    const v = headers.get(h);
    if (v) return v.trim();
  }
  const auth = headers.get("authorization");
  if (auth) return auth.replace(/^(Bearer|Token)\s+/i, "").trim();
  const q = query.get("token") ?? query.get("secret");
  if (q) return q.trim();
  if (corpo && typeof corpo === "object" && "token" in corpo) {
    const t = (corpo as Record<string, unknown>).token;
    if (typeof t === "string" && t) return t.trim();
  }
  return null;
}

/** Comparação em tempo constante. Segredo vazio = sempre recusa. */
export function tokenValido(recebido: string | null, segredo: string | undefined): boolean {
  if (!segredo || !recebido) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(segredo);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
