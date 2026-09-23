"use client";

import { Guide } from "@/components/content/Guide";
import { WR_GUIDE } from "@/data/bonuses";

export default function GuiaReceptoresPage() {
  return <Guide eyebrow="Bonus 6" guide={WR_GUIDE} />;
}
