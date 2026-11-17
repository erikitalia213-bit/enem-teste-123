import { redirect } from "next/navigation";

/** A raiz leva para a tela "Hoje"; o layout da área logada cuida de login e onboarding. */
export default function Inicio() {
  redirect("/hoje");
}
