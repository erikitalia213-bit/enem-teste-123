import { DrillDetail } from "./DrillDetail";

export const metadata = { title: "Drill" };

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DrillDetail id={id} />;
}
