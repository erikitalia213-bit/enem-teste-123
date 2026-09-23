"use client";

import { Guide } from "@/components/content/Guide";
import { QB_GUIDE } from "@/data/bonuses";

export default function GuiaQbPage() {
  return <Guide eyebrow="Bonus 5" guide={QB_GUIDE} />;
}
