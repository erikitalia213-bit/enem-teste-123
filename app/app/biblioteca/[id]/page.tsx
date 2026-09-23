import { notFound } from "next/navigation";
import { PLAYS, PLAY_MAP } from "@/data/plays";
import { PlayDetail } from "./PlayDetail";

export function generateStaticParams() {
  return PLAYS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const play = PLAY_MAP[id];
  return { title: play ? play.name : "Jugada" };
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!PLAY_MAP[id]) notFound();
  return <PlayDetail id={id} />;
}
