import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { FormLogin } from "./FormLogin";

export const metadata: Metadata = { title: "Entrar" };

const ERROS: Record<string, string> = {
  link: "Esse link expirou ou já foi usado. Peça um novo abaixo. Ele chega em segundos.",
  config: "O app ainda está sendo configurado. Tente novamente em instantes.",
};

export default async function PaginaLogin({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="moldura flex flex-col px-5 pb-10">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-[url('/img/bg-quiz.webp')] bg-cover bg-[center_20%] opacity-20"
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 mx-auto max-w-[480px] bg-gradient-to-b from-fundo/40 via-fundo/90 to-fundo" />
      <div className="relative z-10 flex flex-1 flex-col justify-center pt-10">
        <Logo largura={260} prioridade />
        <h1 className="titulo mt-8 text-center text-[32px]">
          Seu protocolo <span className="text-limao">te espera</span>
        </h1>
        <p className="mt-2 text-center text-[15px] leading-relaxed text-suave">
          Digite o e-mail que você usou na compra. Vamos enviar um link de acesso, sem senha.
        </p>
        {erro && ERROS[erro] && (
          <p role="alert" className="mt-5 rounded-app border border-rosa/40 bg-rosa/10 p-3 text-sm text-texto">
            {ERROS[erro]}
          </p>
        )}
        <FormLogin />
      </div>
    </main>
  );
}
