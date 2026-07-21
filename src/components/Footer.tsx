import QRCode from "qrcode";

const INSTAGRAM_HANDLE = "confiatechn";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const PRODUCT_LINKS = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#confianza", label: "Seguridad" },
  { href: "/precios", label: "Precios" },
  { href: "/soporte", label: "Soporte Técnico" },
  { href: "/terminos", label: "Términos y condiciones" },
];

export const FOUNDERS = [
  "Amilcar García — CEO",
  "Carlos Adely Pérez — CTO",
  "Carlos Fuentes — CMO",
];

export default async function Footer() {
  const qrSvg = await QRCode.toString(INSTAGRAM_URL, {
    type: "svg",
    margin: 0,
    color: { dark: "#0B1E27", light: "#FFFFFF" },
  });

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
            <div className="footer-instagram">
              <p className="footer-instagram-label">Síguenos en Instagram</p>
              <div className="footer-instagram-row">
                <div className="footer-qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-instagram-handle"
                >
                  @{INSTAGRAM_HANDLE}
                </a>
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
