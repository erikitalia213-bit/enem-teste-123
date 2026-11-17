export type Provedor = "kirvano" | "wiapy";
export const PROVEDORES: Provedor[] = ["kirvano", "wiapy"];

export type StatusCompra = "aprovada" | "reembolsada" | "chargeback";

/** Formato único que todo adaptador devolve, independente do provedor. */
export interface CompraNormalizada {
  email: string;
  nome: string | null;
  transacao_id: string;
  status: StatusCompra;
  produto: string | null;
  valor: number | null;
}

export type ResultadoAdaptador =
  | { tipo: "compra"; compra: CompraNormalizada }
  /** Evento que não muda acesso (boleto gerado, carrinho abandonado...). */
  | { tipo: "ignorado"; motivo: string }
  /** Payload que não deu para entender: vai para webhook_logs. */
  | { tipo: "invalido"; motivo: string };

export interface Adaptador {
  provedor: Provedor;
  normalizar(payload: unknown): ResultadoAdaptador;
}
