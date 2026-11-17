import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { obterRepositorio } from "@/lib/dados";
import { perfilCompleto, type PerfilCompleto, type Usuario } from "@/lib/dados/tipos";

/** Carrega usuária, acesso e perfil uma única vez por requisição. */
export const carregarSessao = cache(async () => {
  const repo = obterRepositorio();
  const usuario = await repo.usuarioAtual();
  if (!usuario) return { repo, usuario: null, acesso: false, perfil: null } as const;
  const [acesso, perfil] = await Promise.all([repo.temAcesso(usuario), repo.obterPerfil(usuario)]);
  return { repo, usuario, acesso, perfil } as const;
});

/** Exige login e compra aprovada (reembolso/chargeback → tela de bloqueio). */
export async function exigirAcesso() {
  const s = await carregarSessao();
  if (!s.usuario) redirect("/login");
  if (!s.acesso) redirect("/acesso-bloqueado");
  return { repo: s.repo, usuario: s.usuario, perfil: s.perfil };
}

/** Exige acesso e onboarding concluído. */
export async function exigirAlunaPronta(): Promise<{ repo: ReturnType<typeof obterRepositorio>; usuario: Usuario; perfil: PerfilCompleto }> {
  const s = await exigirAcesso();
  if (!perfilCompleto(s.perfil)) redirect("/onboarding");
  return { repo: s.repo, usuario: s.usuario, perfil: s.perfil };
}
