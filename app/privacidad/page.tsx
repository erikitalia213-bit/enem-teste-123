import type { Metadata } from "next";
import { LegalPage, LegalValue } from "@/components/legal/LegalPage";
import { BRAND, LEGAL } from "@/config";

export const metadata: Metadata = { title: "Aviso de privacidad", description: "Cómo FLAGLAB 5x5 trata tus datos personales." };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Aviso de privacidad">
      <p>
        <LegalValue value={LEGAL.owner} env="NEXT_PUBLIC_LEGAL_OWNER" />, con domicilio en <LegalValue value={LEGAL.address} env="NEXT_PUBLIC_LEGAL_ADDRESS" /> (el “Responsable”), es responsable del tratamiento de los datos personales que nos proporcionas al usar FLAGLAB 5x5 ({BRAND.siteUrl}), conforme a la legislación mexicana de protección de datos personales en posesión de particulares.
      </p>

      <h2>Datos que tratamos</h2>
      <ul>
        <li>
          <b>Cuenta:</b> correo electrónico, contraseña (guardada cifrada por nuestro proveedor de autenticación), nombre de coach y nombre de equipo (opcionales).
        </li>
        <li>
          <b>Compra:</b> correo, nombre, producto adquirido, identificador y estado del pedido que nos envía la plataforma de pago. No recibimos ni guardamos datos de tarjeta.
        </li>
        <li>
          <b>Navegación y campañas:</b> páginas visitadas, parámetros de campaña (utm_*, fbclid) y eventos de interacción, mediante cookies o tecnologías similares de Meta y Google cuando estén activadas.
        </li>
        <li>
          <b>Contenido que creas en la app</b> (jugadas, playbooks, entrenamientos, roster y estadísticas): se guarda en el almacenamiento local de tu navegador, en tu dispositivo. No lo recibimos en nuestros servidores salvo que nos envíes un respaldo por soporte.
        </li>
      </ul>
      <p>No solicitamos datos personales sensibles. Si registras nombres de jugadores menores de edad en el roster, esa información permanece en tu dispositivo; te recomendamos usar solo nombres o apodos y contar con la autorización de sus padres o tutores.</p>

      <h2>Finalidades</h2>
      <p>
        <b>Necesarias:</b> crear y administrar tu cuenta, verificar tu compra y darte acceso a los productos adquiridos, atender soporte, y cumplir obligaciones legales.
      </p>
      <p>
        <b>Secundarias:</b> medir el desempeño de anuncios y de la página, y enviarte comunicaciones sobre FLAGLAB. Puedes oponerte a ellas en cualquier momento escribiendo a <LegalValue value={LEGAL.privacyEmail} env="NEXT_PUBLIC_PRIVACY_EMAIL" />, sin que eso afecte tu acceso.
      </p>

      <h2>Transferencias y encargados</h2>
      <p>Para operar el servicio compartimos datos con proveedores que actúan por nuestra cuenta: el proveedor de autenticación y base de datos (Supabase), el hosting del sitio, la plataforma de pago con la que compraste (por ejemplo Hotmart o Kiwify) y, si están activadas, las herramientas de medición de Meta y Google. Algunos de estos proveedores pueden almacenar datos fuera de México. No vendemos tus datos personales.</p>

      <h2>Derechos ARCO y revocación</h2>
      <p>
        Puedes acceder, rectificar, cancelar u oponerte al tratamiento de tus datos, revocar tu consentimiento o limitar su uso enviando un correo a <LegalValue value={LEGAL.privacyEmail} env="NEXT_PUBLIC_PRIVACY_EMAIL" /> con tu nombre, el correo de tu cuenta, la solicitud concreta y, en su caso, documentos que acrediten tu identidad. Responderemos en los plazos que marca la ley.
      </p>

      <h2>Cookies</h2>
      <p>Usamos cookies necesarias para mantener tu sesión iniciada. Las cookies de medición de Meta y Google solo se cargan si el sitio las tiene configuradas; puedes bloquearlas desde la configuración de tu navegador.</p>

      <h2>Cambios</h2>
      <p>Cualquier cambio a este aviso se publicará en esta misma página con su fecha de actualización.</p>
    </LegalPage>
  );
}
