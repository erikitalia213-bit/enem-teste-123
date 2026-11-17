import type { Metadata } from "next";
import { exercicios } from "@/content/exercicios";
import { Cabecalho } from "@/components/app/Cabecalho";
import { temImagem } from "@/lib/imagens";
import { Biblioteca } from "./Biblioteca";

export const metadata: Metadata = { title: "Biblioteca de exercícios" };

export default function PaginaBiblioteca() {
  const lista = exercicios.map((e) => ({ slug: e.slug, nome: e.nome, local: e.local, musculoAlvo: e.musculoAlvo, equipamento: e.equipamento, temImagem: temImagem(e.slug) }));
  return (
    <main className="flex flex-col">
      <Cabecalho titulo="Biblioteca" subtitulo={`${exercicios.length} exercícios com passo a passo`} voltar="/treino" />
      <Biblioteca exercicios={lista} />
    </main>
  );
}
