import type { Metadata } from "next";
import { EntryForm } from "./EntryForm";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function EntrarPage() {
  return <EntryForm />;
}
