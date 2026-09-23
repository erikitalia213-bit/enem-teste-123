import { ClassDetail } from "./ClassDetail";

export const metadata = { title: "Clase" };

export default async function ClasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassDetail id={id} />;
}
