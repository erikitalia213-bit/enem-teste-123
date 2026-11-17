import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Lock, Medal } from "lucide-react";
import { fases } from "@/content/protocolo";
import { Cabecalho } from "@/components/app/Cabecalho";
import { BarraProgresso } from "@/components/ui/BarraProgresso";
import { TOTAL_DIAS } from "@/lib/config";
import { diasAteReveillon, formatarData } from "@/lib/datas";
import { diasConcluidos, montarPlano } from "@/lib/plano";
import { estadoDoDia, progressoDaFase } from "@/lib/protocolo/progresso";
import { exigirAlunaPronta } from "@/lib/sessao";

export const metadata: Metadata = { title: "Jornada" };

const ESTILO_ESTADO = {
  concluido: "border-limao bg-limao text-fundo",
  hoje: "border-limao text-limao animate-pulso bg-limao/10",
  perdido: "border-rosa/40 text-texto",
  bloqueado: "border-borda/60 text-suave/50",
} as const;

export default async function Jornada() {
  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);
  const feitos = diasConcluidos(await repo.listarTreinos(usuario));
  const faltam = diasAteReveillon(plano.hoje);

  return (
    <main className="flex flex-col gap-5">
      <Cabecalho titulo="Jornada" subtitulo={`${feitos.size} de ${TOTAL_DIAS} dias cumpridos`} />
      <div className="px-5">
        <BarraProgresso valor={feitos.size / TOTAL_DIAS} rotulo="Dias cumpridos no protocolo" />
      </div>

      <ul className="grid grid-cols-3 gap-2 px-5" aria-label="Medalhas">
        {fases.map((f) => {
          const p = progressoDaFase(plano.calendario, feitos, f.numero, plano.diaAtual);
          return (
            <li key={f.numero} className={`cartao flex flex-col items-center p-3 text-center ${p.medalha ? "border-dourado/60 bg-dourado/[0.08]" : ""}`}>
              <span className={`grid size-12 place-items-center rounded-full ${p.medalha ? "bg-dourado text-fundo" : "bg-card-2 text-suave/60"}`}>
                <Medal size={26} aria-hidden />
              </span>
              <span className={`mt-2 text-[12px] font-bold leading-tight ${p.medalha ? "text-dourado" : ""}`}>{f.nome}</span>
              <span className="mt-0.5 text-[11px] text-suave">
                {p.medalha ? "Conquistada!" : `${p.treinosFeitos}/${p.totalTreinos} treinos`}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="px-5 text-xs leading-relaxed text-suave">
        Verde = dia cumprido. Dias passados que ficaram para trás podem ser recuperados: é só tocar neles. Os dias futuros abrem quando
        chegarem.
      </p>

      {fases.map((f) => {
        const dias = plano.calendario.filter((d) => d.fase === f.numero);
        return (
          <section key={f.numero} aria-labelledby={`fase-${f.numero}`} className="px-5">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 id={`fase-${f.numero}`} className="titulo text-[22px]">
                <span className="text-limao">Fase {f.numero}</span> · {f.nome}
              </h2>
              <span className="text-xs text-suave">Semanas {f.semanas[0]}–{f.semanas[1]}</span>
            </div>
            <ol className="grid grid-cols-7 gap-1.5">
              {dias.map((d) => {
                const estado = estadoDoDia(d.dia, plano.diaReal, feitos);
                const rotulo = `Dia ${d.dia}, ${formatarData(d.data, "d/MM")}: ${d.tipo === "treino" ? `treino ${d.letra}` : "descanso ativo"}, ${
                  { concluido: "concluído", hoje: "hoje", perdido: "pendente", bloqueado: "bloqueado" }[estado]
                }`;
                const corpo = (
                  <>
                    <span className="text-[13px] font-bold leading-none">{d.dia}</span>
                    <span className="mt-0.5 text-[10px] font-semibold leading-none opacity-80">
                      {estado === "concluido" ? <Check size={12} strokeWidth={3} aria-hidden /> : estado === "bloqueado" ? <Lock size={10} aria-hidden /> : d.tipo === "treino" ? d.letra : "•"}
                    </span>
                  </>
                );
                const classe = `flex aspect-square flex-col items-center justify-center rounded-xl border-[1.5px] ${ESTILO_ESTADO[estado]}`;
                return (
                  <li key={d.dia}>
                    {estado === "bloqueado" ? (
                      <span className={classe} aria-label={rotulo} role="img">
                        {corpo}
                      </span>
                    ) : (
                      <Link href={`/treino/${d.dia}`} className={`${classe} min-h-11`} aria-label={rotulo}>
                        {corpo}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <section className="mx-5 mb-4 flex items-center gap-4 overflow-hidden rounded-[20px] border border-dourado/40 bg-gradient-to-br from-[#2a2410] to-card p-4">
        <Image src="/img/calendario-reveillon.webp" alt="" width={84} height={84} />
        <div>
          <p className="rotulo text-dourado">Linha de chegada</p>
          <p className="titulo text-[28px] leading-tight">Réveillon 🎆</p>
          <p className="text-sm text-suave">{faltam === 0 ? "É hoje! Brilha!" : `Faltam ${faltam} ${faltam === 1 ? "dia" : "dias"} para o dia 31.`}</p>
        </div>
      </section>
    </main>
  );
}
