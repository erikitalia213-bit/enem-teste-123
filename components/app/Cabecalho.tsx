import { ChevronLeft } from "lucide-react";
import Link from "next/link";

/** Cabeçalho das telas internas: título grande em Anton e, opcionalmente, botão voltar. */
export function Cabecalho({ titulo, subtitulo, voltar, acao }: { titulo: string; subtitulo?: string; voltar?: string; acao?: React.ReactNode }) {
  return (
    <header className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-2">
      <div className="flex items-center gap-2">
        {voltar && (
          <Link href={voltar} aria-label="Voltar" className="-ml-2.5 grid size-11 place-items-center rounded-full text-suave hover:text-texto">
            <ChevronLeft size={26} aria-hidden />
          </Link>
        )}
        <h1 className="titulo flex-1 text-[30px]">{titulo}</h1>
        {acao}
      </div>
      {subtitulo && <p className="mt-1 text-sm text-suave">{subtitulo}</p>}
    </header>
  );
}
