/** Utilitários para ler a requisição do webhook com segurança. */

/** Cabeçalhos que nunca vão para o log (segredos). */
const CABECALHOS_SENSIVEIS = /authorization|cookie|token|secret|api-key|signature/i;

export function cabecalhosParaLog(headers: Headers): Record<string, string> {
  const saida: Record<string, string> = {};
  headers.forEach((valor, chave) => {
    saida[chave] = CABECALHOS_SENSIVEIS.test(chave) ? "[oculto]" : valor;
  });
  return saida;
}

export function queryParaLog(query: URLSearchParams): Record<string, string> {
  const saida: Record<string, string> = {};
  query.forEach((valor, chave) => {
    saida[chave] = /token|secret/i.test(chave) ? "[oculto]" : valor;
  });
  return saida;
}

/** Interpreta JSON ou application/x-www-form-urlencoded. Retorna null se não der. */
export function interpretarCorpo(bruto: string, contentType: string | null): unknown {
  if (!bruto.trim()) return null;
  try {
    return JSON.parse(bruto);
  } catch {
    if ((contentType ?? "").includes("application/x-www-form-urlencoded") || /^[^=&\s]+=[^&]*(&[^=&\s]+=[^&]*)*$/.test(bruto.trim())) {
      const obj: Record<string, unknown> = {};
      new URLSearchParams(bruto).forEach((v, k) => {
        // Aceita chaves no formato customer[email]
        const partes = k.replace(/\]/g, "").split("[");
        let alvo = obj;
        partes.forEach((p, i) => {
          if (i === partes.length - 1) alvo[p] = v;
          else alvo = (alvo[p] ??= {}) as Record<string, unknown>;
        });
      });
      return obj;
    }
    return null;
  }
}

export const LIMITE_CORPO = 1_000_000; // 1 MB
