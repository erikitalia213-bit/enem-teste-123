import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Aviso de independencia", description: "FLAGLAB 5x5 es una herramienta independiente, sin afiliación con ligas ni federaciones." };

export default function IndependenciaPage() {
  return (
    <LegalPage title="Aviso de independencia">
      <p>
        FLAGLAB 5x5 es una <b>herramienta educativa independiente</b>. No está afiliada, patrocinada, respaldada ni aprobada por la National Football League (NFL), por ninguna liga, federación, asociación deportiva, escuela ni equipo profesional o amateur.
      </p>
      <p>“Tocho bandera” y “flag football” se usan únicamente como términos descriptivos del deporte. Cualquier marca de terceros mencionada pertenece a sus respectivos titulares.</p>
      <p>Las jugadas, drills, entrenamientos, clases, textos y diagramas de FLAGLAB son contenido original creado para este producto. No reproducen playbooks ni materiales de ninguna liga o equipo.</p>
      <p>
        Las reglas del tocho bandera cambian según la liga, la categoría y el torneo (por ejemplo, la distancia del rusher, el número de oportunidades o el tamaño del campo). <b>Antes de cada temporada, verifica el reglamento de tu liga</b> y adapta las jugadas y los entrenamientos a esas reglas.
      </p>
    </LegalPage>
  );
}
