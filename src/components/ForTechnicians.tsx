const BENEFITS = [
  "Onboarding gratuito para los primeros 50 técnicos fundadores.",
  "Ranking visible: la constancia y las buenas calificaciones te ponen primero.",
  "Ingresos estables con comisión clara — sin letras pequeñas.",
  "Formación continua junto a INFOP y reclutamiento en gremios locales.",
];

const RANKING = [
  {
    pos: "01",
    initials: "JR",
    name: "José Ramírez",
    detail: "Electricista · 4.9 ★ · 112 servicios",
    featured: true,
  },
  {
    pos: "02",
    initials: "MC",
    name: "María Cálix",
    detail: "Fontanera · 4.8 ★ · 97 servicios",
    featured: true,
  },
  {
    pos: "03",
    initials: "AL",
    name: "Ángel López",
    detail: "Barbero · 4.8 ★ · 84 servicios",
    featured: false,
  },
];

export default function ForTechnicians() {
  return (
    <section className="pro-section" id="tecnicos">
      <div className="wrap pro-grid">
        <div>
          <span className="eyebrow reveal">Para técnicos</span>
          <h2 className="reveal" style={{ fontSize: "clamp(24px,3vw,34px)", marginTop: "14px" }}>
            ¿Eres electricista, fontanero o barbero? Sé fundador, no solo
            usuario.
          </h2>
          <ul className="pro-list reveal">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
          <a className="btn btn-primary reveal" href="/tecnicos/unirse">
            Únete como técnico fundador
          </a>
        </div>

        <div className="pro-visual reveal">
          <h3 style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px", fontWeight: 500 }}>
            Ranking de la semana · San Pedro Sula
          </h3>
          {RANKING.map((tech) => (
            <div className="rank-row" key={tech.pos}>
              <span className="rank-pos">{tech.pos}</span>
              <div className="rank-avatar">{tech.initials}</div>
              <div className="rank-name">
                {tech.name} <span>{tech.detail}</span>
              </div>
              {tech.featured && <span className="rank-badge">Destacado</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
