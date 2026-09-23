import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalValue } from "@/components/legal/LegalPage";
import { BRAND, LEGAL } from "@/config";

export const metadata: Metadata = { title: "Términos y condiciones", description: "Condiciones de uso de FLAGLAB 5x5." };

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones">
      <p>
        Estos términos regulan el uso de FLAGLAB 5x5 ({BRAND.siteUrl}), ofrecido por <LegalValue value={LEGAL.owner} env="NEXT_PUBLIC_LEGAL_OWNER" />. Al crear una cuenta o usar la app aceptas estas condiciones.
      </p>

      <h2>Qué es FLAGLAB</h2>
      <p>FLAGLAB 5x5 es una herramienta digital educativa para coaches y profesores de tocho bandera (flag football) 5x5: creador de jugadas, biblioteca de jugadas y drills, generador de entrenamientos, playbook, muñequeras, manual y materiales complementarios.</p>

      <h2>Acceso y cuenta</h2>
      <ul>
        <li>El acceso es personal y se asocia al correo con el que compraste. Crea tu cuenta con ese mismo correo.</li>
        <li>Los complementos (Playbook Defensivo, Pack 50 Entrenamientos Extra, Kit Coach Escolar) solo se habilitan si los adquiriste.</li>
        <li>No compartas tu contraseña. Podemos suspender cuentas con uso compartido evidente o actividad fraudulenta.</li>
        <li>Si el pago se reembolsa o se desconoce (contracargo), el acceso al producto correspondiente se retira.</li>
      </ul>

      <h2>Pagos, precio y garantía</h2>
      <p>El pago se procesa en una plataforma externa (por ejemplo Hotmart o Kiwify), que emite el comprobante y aplica sus propias condiciones. Las condiciones de garantía y reembolso son las que se muestran en el checkout al momento de tu compra. El precio publicado es un pago único por el acceso descrito en la página de venta.</p>

      <h2>Tus datos en la app</h2>
      <p>Las jugadas, playbooks, entrenamientos y estadísticas que creas se guardan en el navegador de tu dispositivo. Borrar los datos del navegador los elimina. Usa la opción de exportar respaldo en Ajustes para conservarlos o pasarlos a otro dispositivo.</p>

      <h2>Uso del contenido</h2>
      <ul>
        <li>Puedes usar e imprimir el contenido para tus equipos, entrenamientos y clases.</li>
        <li>No está permitido revender, redistribuir o publicar el contenido de la biblioteca, el manual o los complementos como producto propio.</li>
        <li>Las jugadas que tú creas son tuyas.</li>
      </ul>

      <h2>Seguridad y responsabilidad deportiva</h2>
      <p>El tocho bandera es un deporte sin contacto, pero toda actividad física implica riesgos. El coach o profesor es responsable de adaptar los ejercicios a la edad, condición y número de participantes, de supervisar la actividad, de revisar el terreno y de contar con la autorización de padres o tutores cuando trabaja con menores. FLAGLAB no sustituye la valoración médica ni la certificación como entrenador.</p>

      <h2>Sin garantía de resultados</h2>
      <p>FLAGLAB es una herramienta de organización y apoyo. No garantizamos victorias, mejoras de rendimiento ni resultados deportivos específicos.</p>

      <h2>Independencia</h2>
      <p>
        FLAGLAB no está afiliado a la NFL, ligas ni federaciones. Consulta el <Link href="/aviso-de-independencia/" className="text-volt hover:underline">Aviso de independencia</Link>.
      </p>

      <h2>Disponibilidad y cambios</h2>
      <p>Trabajamos para que la app esté disponible, pero puede haber interrupciones por mantenimiento o fallas de terceros. Podemos actualizar funciones y contenido para mejorarlos. Los cambios a estos términos se publicarán en esta página.</p>

      <h2>Contacto</h2>
      <p>
        Soporte: <LegalValue value={BRAND.supportEmail} env="NEXT_PUBLIC_SUPPORT_EMAIL" />. Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
      </p>
    </LegalPage>
  );
}
