import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NaoEncontrado() {
  return (
    <main className="moldura flex flex-col items-center justify-center px-6 text-center">
      <Logo largura={200} />
      <p className="titulo mt-10 text-[72px] leading-none text-limao">404</p>
      <h1 className="titulo mt-2 text-[28px]">Página não encontrada</h1>
      <p className="mt-2 text-[15px] text-suave">O endereço pode ter mudado. Volte para o seu dia.</p>
      <Link href="/hoje" className="botao-primario mt-8 w-full max-w-xs">
        Ir para Hoje
      </Link>
    </main>
  );
}
