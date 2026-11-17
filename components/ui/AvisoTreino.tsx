import { AVISO_TREINO } from "@/lib/config";

/** Rodapé discreto obrigatório nas telas de treino. */
export function AvisoTreino({ className = "" }: { className?: string }) {
  return <p className={`px-2 text-center text-[11px] leading-relaxed text-suave/80 ${className}`}>{AVISO_TREINO}</p>;
}
