import type { Metadata } from "next";
import { FOUNDERS } from "@/components/Footer";
import SupportContactForm from "@/components/SupportContactForm";

const SUPPORT_EMAIL = "confiatec0@gmail.com";

export const metadata: Metadata = {
  title: "Soporte Técnico — ConfiaTec",
};

export default function SoportePage() {
  return (
    <section className="auth-page">
      <div className="wrap" style={{ maxWidth: "760px" }}>
        <div className="sec-head" style={{ marginBottom: "24px" }}>
          <span className="eyebrow">Ayuda</span>
          <h2>Soporte Técnico</h2>
          <p>
            ¿Tuviste un error en la plataforma, una duda sobre tu cuenta, un pago o un
            técnico? Escríbenos y el equipo fundador de ConfiaTec te responde
            directamente.
          </p>
        </div>

        <div className="form-notice" style={{ marginBottom: "32px" }}>
          Puedes escribirnos directamente a{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--green)", fontWeight: 600 }}>
            {SUPPORT_EMAIL}
          </a>{" "}
          o usar el formulario de abajo.
        </div>

        <SupportContactForm />

        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>¿A quién le escribes?</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
            ConfiaTec es un proyecto del equipo fundador de Informática Administrativa —
            UNAH:
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {FOUNDERS.map((founder) => (
              <li key={founder} style={{ color: "var(--text-light)", fontSize: "14.5px" }}>
                {founder}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
