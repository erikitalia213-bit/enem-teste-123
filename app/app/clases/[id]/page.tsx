import { notFound } from "next/navigation";
import { CLASSES, getClass } from "@/data/classes";
import { ClassDetail } from "./ClassDetail";

export function generateStaticParams() {
  return CLASSES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getClass(id);
  return { title: c ? `Clase ${c.number}: ${c.title}` : "Clase" };
}

export default async function ClasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getClass(id)) notFound();
  return <ClassDetail id={id} />;
}
