"use client";

import { Guide } from "@/components/content/Guide";
import { useContent } from "@/components/app/ContentProvider";

export default function GuiaReceptoresPage() {
  return <Guide eyebrow="Bonus 6" guide={useContent().core.wrGuide} />;
}
