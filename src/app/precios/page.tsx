import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Precios y modelo de negocio — ConfiaTec",
};

export default function PreciosPage() {
  return (
    <section className="auth-page">
      <div className="wrap" style={{ maxWidth: "760px" }}>
        <div className="sec-head" style={{ marginBottom: "24px" }}>
          <span className="eyebrow">Modelo de negocio</span>
          <h2>Cómo gana dinero ConfiaTec</h2>
          <p>Dos fuentes de ingreso, simples y transparentes — sin letras pequeñas.</p>
        </div>

        <div className="trust-grid" style={{ marginBottom: "32px" }}>
          <div className="trust-card">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3>Comisión por servicio</h3>
            <p>
              10% a 15% sobre cada servicio completado y pagado a través de la
              plataforma — el estándar en marketplaces como PedidosYa o Uber.
            </p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 17.3 6.2 20l1.1-6.5L2.6 9l6.5-1L12 2l2.9 6 6.5 1-4.7 4.5 1.1 6.5z" />
              </svg>
            </div>
            <h3>Suscripción Premium</h3>
            <p>
              L. 300 al mes para técnicos que quieren aparecer destacados en el
              ranking de búsqueda — ingreso recurrente, independiente del volumen
              de servicios.
            </p>
          </div>
        </div>

        <div className="form-notice" style={{ marginBottom: "32px" }}>
          Estado actual: la suscripción Premium ya se puede activar desde el
          panel de técnico. El cobro real se conectará a PayPal (facturado en
          USD, ya que ni Lempiras ni la mayoría de pasarelas internacionales
          operan directamente en HNL) en cuanto se confirme la disponibilidad de
          una cuenta PayPal Business desde Honduras. Por ahora, activar Premium
          no genera un cargo.
        </div>

        <div style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.7 }}>
          <h3>¿Por qué este modelo?</h3>
          <p>
            La comisión se cobra únicamente cuando un técnico ya generó ingreso
            gracias a la plataforma, así que ConfiaTec crece solo si sus
            técnicos también crecen. La suscripción Premium le da a los técnicos
            fundadores una forma de invertir en visibilidad extra en San Pedro
            Sula y Tegucigalpa, sin depender solo del azar del ranking orgánico.
          </p>
          <h3>¿Eres técnico?</h3>
          <p>
            Activa tu suscripción Premium desde{" "}
            <a href="/dashboard" style={{ color: "var(--gold)" }}>
              tu panel
            </a>{" "}
            para aparecer con la insignia &ldquo;Destacado&rdquo; en los
            resultados de búsqueda.
          </p>
        </div>
      </div>
    </section>
  );
}
