import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, ShieldAlert } from "lucide-react";
import { ContatoSuporte } from "@/components/ui/ContatoSuporte";
import { Logo } from "@/components/ui/Logo";
import { sair } from "@/lib/acoes/sessao";
import { carregarSessao } from "@/lib/sessao";

export const metadata: Metadata = { title: "Acesso indisponível" };

export default async function AcessoBloqueado() {
  const { usuario, acesso } = await carregarSessao();
  if (!usuario) redirect("/login");
  if (acesso) redirect("/hoje");

  return (
    <main className="moldura flex flex-col justify-center px-5 py-10">
      <Logo largura={200} />
      <div className="cartao mt-8 p-5">
        <ShieldAlert className="text-rosa" size={36} aria-hidden />
        <h1 className="titulo mt-3 text-[28px]">Acesso indisponível</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-suave">
          Não encontramos uma compra ativa para <b className="text-texto">{usuario.email}</b>. Isso acontece quando o pagamento ainda não
          foi aprovado, foi reembolsado ou contestado.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-suave">Se você acredita que é um engano, fale com o suporte:</p>
        <ContatoSuporte mensagem={`Oi! Meu acesso ao Protocolo 42 Dias (${usuario.email}) aparece como indisponível.`} />
        <form action={sair} className="mt-4">
          <button type="submit" className="botao-secundario w-full">
            <LogOut size={18} aria-hidden /> Entrar com outro e-mail
          </button>
        </form>
      </div>
    </main>
  );
}
