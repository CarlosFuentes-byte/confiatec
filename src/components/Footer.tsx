const PRODUCT_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#servicios", label: "Servicios" },
  { href: "#confianza", label: "Seguridad" },
  { href: "/precios", label: "Precios" },
  { href: "/terminos", label: "Términos y condiciones" },
];

const FOUNDERS = [
  "Amilcar García — CEO",
  "Carlos Adely Pérez — CTO",
  "Carlos Fuentes — CMO",
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <svg className="logo-mark" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#F2A93B" strokeWidth="2" />
                <path
                  d="M9 16.5L13.5 21L23 10"
                  stroke="#F2A93B"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              ConfiaTec
            </div>
            <p>
              La primera plataforma en Honduras que conecta hogares con
              técnicos verificados de oficios — con antecedentes revisados,
              ubicación en vivo y reseñas reales.
            </p>
            <div className="store-badges">
              <div className="store-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 2c.13 1.1-.32 2.2-1 3-.7.85-1.85 1.5-2.95 1.4-.15-1.05.37-2.15 1.05-2.9.75-.85 2-1.45 2.9-1.5zM20.9 17.6c-.5 1.15-1.1 2.25-2 3.25-.85.95-1.85 1.9-3.05 1.9-1.15 0-1.55-.7-2.95-.7s-1.85.7-2.95.7c-1.2 0-2.25-1-3.1-2-1.75-2.05-3.1-5.8-1.3-8.4.9-1.3 2.45-2.1 4.05-2.1 1.15 0 2.2.75 2.95.75.7 0 2-.9 3.4-.75.6.02 2.25.25 3.3 1.85-.1.05-2 1.15-1.95 3.4.02 2.7 2.35 3.6 2.6 3.7z" />
                </svg>
                App Store
              </div>
              <div className="store-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3.5v17c0 .3.15.6.4.75l9.6-9.25L3.4 2.75c-.25.15-.4.4-.4.75zM14 12l2.75-2.65 3.4 1.95c.55.3.55 1.1 0 1.4l-3.4 1.95zM13.3 12.7l-9.6 9.25c.1.05.2.05.3.05.2 0 .4-.05.55-.15l10.9-6.3zM13.3 11.3l1.85-1.8-10.9-6.3c-.15-.1-.35-.15-.55-.15-.1 0-.2 0-.3.05z" />
                </svg>
                Google Play
              </div>
            </div>
          </div>
          <div className="footer-col">
            <h5>Producto</h5>
            <ul>
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Equipo fundador — UNAH</h5>
            <ul>
              {FOUNDERS.map((founder) => (
                <li key={founder}>{founder}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} ConfiaTec — Proyecto académico,
            Informática Administrativa UNAH
          </span>
          <span>San Pedro Sula · Tegucigalpa, Honduras</span>
        </div>
      </div>
    </footer>
  );
}
