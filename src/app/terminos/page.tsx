import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — ConfiaTec",
};

export default function TerminosPage() {
  return (
    <section className="auth-page">
      <div className="wrap" style={{ maxWidth: "760px" }}>
        <div className="sec-head" style={{ marginBottom: "24px" }}>
          <span className="eyebrow">Legal</span>
          <h2>Términos y Condiciones</h2>
          <p>Última actualización: 2026. Aplican tanto a clientes como a técnicos.</p>
        </div>

        <div className="form-notice" style={{ marginBottom: "32px" }}>
          ConfiaTec es un proyecto académico del curso de Negocios Electrónicos,
          Informática Administrativa — UNAH. Este documento es un borrador redactado
          con fines del proyecto y no constituye asesoría legal profesional.
        </div>

        <div style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7 }}>
          <h3>1. Aceptación de los términos</h3>
          <p>
            Al crear una cuenta en ConfiaTec, ya sea como Cliente o como Técnico,
            aceptas estos Términos y Condiciones en su totalidad. Si no estás de
            acuerdo con alguna parte, no debes registrarte ni usar la plataforma.
          </p>

          <h3>2. Definiciones</h3>
          <p>
            <strong>Plataforma:</strong> el sitio web y los servicios de ConfiaTec.{" "}
            <strong>Cliente:</strong> persona que busca y solicita un servicio de
            oficio a través de la Plataforma. <strong>Técnico:</strong> persona
            independiente que ofrece sus servicios de oficio (electricista,
            fontanero, barbero, etc.) a través de la Plataforma.{" "}
            <strong>Solicitud:</strong> el pedido de servicio que un Cliente dirige a
            un Técnico específico.
          </p>

          <h3>3. Naturaleza del servicio</h3>
          <p>
            ConfiaTec es un intermediario tecnológico que conecta Clientes con
            Técnicos independientes. Los Técnicos no son empleados de ConfiaTec: son
            profesionales independientes responsables de la calidad, seguridad y
            legalidad del trabajo que realizan. ConfiaTec no presta directamente los
            servicios de oficio anunciados en la Plataforma.
          </p>

          <h3>4. Para Clientes</h3>
          <p>
            Al solicitar un servicio, te comprometes a proporcionar una dirección y
            descripción precisas, a tratar al Técnico con respeto, y a pagar el
            precio acordado por el servicio completado. Puedes cancelar una
            solicitud mientras esté en estado &ldquo;pendiente&rdquo;. Una vez que un
            Técnico acepta y completa el servicio, solo tú puedes calificarlo con
            una reseña — no se aceptan reseñas de servicios no completados en la
            Plataforma.
          </p>

          <h3>5. Para Técnicos</h3>
          <p>
            Al registrarte como Técnico fundador, aceptas que ConfiaTec cobra una
            comisión de 10% a 15% sobre cada servicio completado y pagado a través
            de la Plataforma, y que puedes optar por una suscripción premium de
            L. 300 al mes para aparecer destacado en el ranking de búsqueda. Eres
            responsable de la veracidad de la información de tu perfil (oficio,
            experiencia, ciudad) y de cumplir con los servicios que aceptes. El
            incumplimiento reiterado o el mal comportamiento reportado por Clientes
            puede resultar en la suspensión de tu cuenta.
          </p>

          <h3>6. Verificación y seguridad</h3>
          <p>
            ConfiaTec busca verificar antecedentes de los Técnicos en alianza con
            municipalidades y autoridades locales antes de marcarlos como
            &ldquo;Verificado&rdquo;. Esta verificación reduce el riesgo pero no lo
            elimina por completo: ConfiaTec no garantiza la conducta de ningún
            Técnico ni Cliente y recomienda actuar con precaución razonable en cada
            interacción.
          </p>

          <h3>7. Privacidad y geolocalización</h3>
          <p>
            Cuando un Técnico acepta una Solicitud, la Plataforma puede acceder a su
            ubicación en tiempo real (con el permiso explícito del navegador) para
            mostrársela al Cliente correspondiente mientras el servicio esté en
            camino. Esta ubicación solo es visible para el Cliente de esa Solicitud
            específica, deja de compartirse en cuanto el servicio se marca como
            completado o cancelado, y no se usa con ningún otro fin. Los datos de
            perfil (nombre, teléfono, ciudad) se usan únicamente para operar la
            Plataforma y no se venden a terceros.
          </p>

          <h3>8. Cancelaciones y disputas</h3>
          <p>
            Cualquiera de las partes puede rechazar o cancelar una solicitud
            mientras esté pendiente. Las disputas sobre la calidad del trabajo o el
            pago se resuelven directamente entre Cliente y Técnico; ConfiaTec puede
            mediar de buena fe pero no garantiza un resultado ni actúa como árbitro
            legal.
          </p>

          <h3>9. Terminación de cuenta</h3>
          <p>
            ConfiaTec puede suspender o eliminar cuentas que incumplan estos
            Términos, incluyendo información falsa, comportamiento abusivo, o uso
            indebido de la Plataforma. Puedes solicitar la eliminación de tu cuenta
            en cualquier momento.
          </p>

          <h3>10. Limitación de responsabilidad</h3>
          <p>
            ConfiaTec no se hace responsable por daños, pérdidas o perjuicios
            derivados directamente de los servicios prestados por los Técnicos, ya
            que estos actúan de forma independiente. El uso de la Plataforma es bajo
            tu propio criterio y responsabilidad.
          </p>

          <h3>11. Ley aplicable</h3>
          <p>
            Estos Términos se rigen por las leyes de la República de Honduras.
          </p>

          <h3>12. Contacto</h3>
          <p>
            Para preguntas sobre estos Términos, contacta al equipo fundador de
            ConfiaTec a través de los canales indicados en el pie de página.
          </p>
        </div>
      </div>
    </section>
  );
}
