"use client";

import { Guide } from "@/components/content/Guide";
import { useContent } from "@/components/app/ContentProvider";

export default function GuiaQbPage() {
  return <Guide eyebrow="Bonus 5" guide={useContent().core.qbGuide} />;
}
