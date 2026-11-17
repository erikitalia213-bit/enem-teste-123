import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Sem conexão" };

export default function Offline() {
  return (
    <main className="moldura flex flex-col items-center justify-center px-6 text-center">
      <Logo largura={200} />
      <WifiOff className="mt-10 text-limao" size={44} aria-hidden />
      <h1 className="titulo mt-4 text-[30px]">Você está sem internet</h1>
      <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-suave">
        As telas que você já abriu continuam disponíveis. Assim que a conexão voltar, é só recarregar para salvar seu progresso.
      </p>
      <a href="/hoje" className="botao-primario mt-8 w-full max-w-xs">
        Tentar de novo
      </a>
    </main>
  );
}
