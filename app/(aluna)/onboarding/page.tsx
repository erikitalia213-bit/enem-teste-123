import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { perfilCompleto } from "@/lib/dados/tipos";
import { exigirAcesso } from "@/lib/sessao";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: "Montando seu protocolo" };

export default async function PaginaOnboarding() {
  const { perfil } = await exigirAcesso();
  if (perfilCompleto(perfil)) redirect("/hoje");
  return <Onboarding nomeInicial={perfil?.nome ?? ""} />;
}
