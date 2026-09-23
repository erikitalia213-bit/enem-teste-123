import { PlayDetail } from "./PlayDetail";

export const metadata = { title: "Jugada" };

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlayDetail id={id} />;
}
