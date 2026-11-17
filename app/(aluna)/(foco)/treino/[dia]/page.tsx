import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DICA_OBJETIVO, fases } from "@/content/protocolo";
import type { VersaoTreino } from "@/content/tipos";
import { TOTAL_DIAS } from "@/lib/config";
import { montarPlano } from "@/lib/plano";
import { diaLiberado } from "@/lib/protocolo/progresso";
import { sessaoDeDescanso, sessaoDeTreino, type SessaoGuiada } from "@/lib/sessaoGuiada";
import { exigirAlunaPronta } from "@/lib/sessao";
import { TreinoGuiado } from "./TreinoGuiado";

export const metadata: Metadata = { title: "Treino" };

export default async function PaginaTreino({ params }: { params: Promise<{ dia: string }> }) {
  const { dia: bruto } = await params;
  const dia = Number(bruto);
  if (!Number.isInteger(dia) || dia < 1 || dia > TOTAL_DIAS) notFound();

  const { repo, usuario, perfil } = await exigirAlunaPronta();
  const plano = montarPlano(perfil);
  if (!diaLiberado(dia, plano.diaReal)) redirect("/jornada");

  const doDia = plano.calendario[dia - 1]!;
  const treinos = await repo.listarTreinos(usuario);
  const concluido = treinos.some((t) => t.dia_protocolo === dia);

  const versoes: Partial<Record<VersaoTreino, SessaoGuiada>> = {};
  let descanso: SessaoGuiada | null = null;
  if (doDia.tipo === "descanso" || !doDia.letra) {
    descanso = sessaoDeDescanso();
  } else {
    const locais: VersaoTreino[] = doDia.local === "ambos" ? ["academia", "casa"] : [doDia.local];
    for (const v of locais) versoes[v] = sessaoDeTreino(doDia.fase, doDia.letra, v, perfil.nivel);
  }

  return (
    <TreinoGuiado
      dia={dia}
      rotuloFase={`Fase ${doDia.fase} · ${fases[doDia.fase - 1]!.nome}`}
      versoes={versoes}
      descanso={descanso}
      concluidoAntes={concluido}
      dicaObjetivo={DICA_OBJETIVO[perfil.objetivo]}
    />
  );
}
