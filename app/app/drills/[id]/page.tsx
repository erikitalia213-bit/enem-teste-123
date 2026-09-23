import { notFound } from "next/navigation";
import { DRILLS, DRILL_MAP } from "@/data/drills";
import { DrillDetail } from "./DrillDetail";

export function generateStaticParams() {
  return DRILLS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: DRILL_MAP[id]?.name ?? "Drill" };
}

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!DRILL_MAP[id]) notFound();
  return <DrillDetail id={id} />;
}
