import type { Metadata } from "next";
import { carregarSessao } from "@/lib/sessao";
import { BemVinda } from "./BemVinda";

export const metadata: Metadata = { title: "Boas-vindas" };

/**
 * Página de chegada depois da compra. O quiz pode mandar ?nome=&local=&dias=&objetivo=&nivel=
 * que ficam salvos no aparelho para pré-preencher o onboarding.
 */
export default async function PaginaBemVinda() {
  const { usuario } = await carregarSessao();
  return <BemVinda logada={Boolean(usuario)} />;
}
