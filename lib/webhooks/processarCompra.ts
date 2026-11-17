import type { CompraNormalizada, Provedor, StatusCompra } from "./tipos";

export interface RegistroCompra extends CompraNormalizada {
  provedor: Provedor;
  payload: unknown;
}

/** Dependências externas (Supabase em produção, dublês nos testes). */
export interface DepsProcessamento {
  buscarCompra(transacaoId: string): Promise<{ status: StatusCompra } | null>;
  salvarCompra(compra: RegistroCompra): Promise<void>;
  /** Envia o acesso: convite para quem é nova, link mágico para quem já tem conta. */
  enviarAcesso(email: string, nome: string | null): Promise<"convite" | "link">;
}

export type AcaoCompra = "criada" | "atualizada" | "sem-mudanca" | "ignorada-ordem" | "ignorada-produto";

export interface ResultadoProcessamento {
  acao: AcaoCompra;
  email: string;
  transacao_id: string;
  status: StatusCompra;
  acesso: "convite-enviado" | "link-enviado" | "bloqueado" | "nenhum";
  avisos: string[];
}

const NEGATIVOS: StatusCompra[] = ["reembolsada", "chargeback"];

/** Lista de produtos aceitos (variável WEBHOOK_PRODUTOS_ACEITOS, separada por vírgula). */
export function lerProdutosAceitos(valor: string | undefined): string[] {
  return (valor ?? "")
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
}

export function produtoAceito(produto: string | null, aceitos: string[]): boolean {
  if (aceitos.length === 0) return true;
  const p = (produto ?? "").toLowerCase();
  return aceitos.some((a) => p.includes(a));
}

/**
 * Regras (idempotentes pelo transacao_id):
 * - Evento repetido com o mesmo status: não faz nada (não reenvia e-mail).
 * - Aprovada nova: salva e envia o acesso por e-mail.
 * - Reembolso/chargeback: atualiza o status, o que bloqueia o acesso.
 * - Aprovação que chega DEPOIS de um reembolso/chargeback (fora de ordem) é ignorada.
 */
export async function processarCompra(
  provedor: Provedor,
  compra: CompraNormalizada,
  payload: unknown,
  deps: DepsProcessamento,
  opcoes: { produtosAceitos?: string[] } = {},
): Promise<ResultadoProcessamento> {
  const base = { email: compra.email, transacao_id: compra.transacao_id, avisos: [] as string[] };

  if (!produtoAceito(compra.produto, opcoes.produtosAceitos ?? [])) {
    return { ...base, acao: "ignorada-produto", status: compra.status, acesso: "nenhum" };
  }

  const existente = await deps.buscarCompra(compra.transacao_id);

  if (existente && existente.status === compra.status) {
    return { ...base, acao: "sem-mudanca", status: existente.status, acesso: "nenhum" };
  }
  if (existente && NEGATIVOS.includes(existente.status) && compra.status === "aprovada") {
    return { ...base, acao: "ignorada-ordem", status: existente.status, acesso: "bloqueado" };
  }

  await deps.salvarCompra({ ...compra, provedor, payload });
  const acao: AcaoCompra = existente ? "atualizada" : "criada";

  if (NEGATIVOS.includes(compra.status)) {
    return { ...base, acao, status: compra.status, acesso: "bloqueado" };
  }

  try {
    const enviado = await deps.enviarAcesso(compra.email, compra.nome);
    return { ...base, acao, status: compra.status, acesso: enviado === "convite" ? "convite-enviado" : "link-enviado" };
  } catch (erro) {
    // A compra fica salva: a aluna consegue pedir o link na tela de login.
    const msg = erro instanceof Error ? erro.message : String(erro);
    return { ...base, acao, status: compra.status, acesso: "nenhum", avisos: [`Falha ao enviar o e-mail de acesso: ${msg}`] };
  }
}
