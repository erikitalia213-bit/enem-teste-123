import { NavInferior } from "@/components/app/NavInferior";
import { exigirAlunaPronta } from "@/lib/sessao";

/** Telas com a barra de navegação inferior. Exige login, compra aprovada e onboarding. */
export default async function LayoutComNavegacao({ children }: { children: React.ReactNode }) {
  await exigirAlunaPronta();
  return (
    <div className="moldura pb-[calc(76px+env(safe-area-inset-bottom,0px))]">
      {children}
      <NavInferior />
    </div>
  );
}
