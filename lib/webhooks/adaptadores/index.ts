import type { Adaptador, Provedor } from "../tipos";
import { adaptadorKirvano } from "./kirvano";
import { adaptadorWiapy } from "./wiapy";

export const adaptadores: Record<Provedor, Adaptador> = {
  kirvano: adaptadorKirvano,
  wiapy: adaptadorWiapy,
};

/** Segredo de cada provedor (variáveis de ambiente). */
export function segredoDoProvedor(provedor: Provedor): string | undefined {
  return provedor === "kirvano" ? process.env.WEBHOOK_SECRET_KIRVANO : process.env.WEBHOOK_SECRET_WIAPY;
}
