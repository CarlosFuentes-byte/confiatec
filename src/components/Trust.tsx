const TRUST_ITEMS = [
  {
    title: "Verificación de antecedentes",
    desc: "Alianza con las municipalidades de SPS y Tegucigalpa y la Policía Nacional para revisar a cada técnico antes de activarlo.",
    icon: (
      <>
        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Geolocalización en vivo",
    desc: "Sabes exactamente dónde está tu técnico desde que acepta el servicio hasta que llega a tu puerta.",
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    title: "Reseñas reales",
    desc: "Solo clientes con servicio completado pueden calificar — nada de reseñas compradas ni falsas.",
    icon: (
      <path d="M12 17.3 6.2 20l1.1-6.5L2.6 9l6.5-1L12 2l2.9 6 6.5 1-4.7 4.5 1.1 6.5z" />
    ),
  },
];

export default function Trust() {
  return (
    <section id="confianza">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Seguridad primero</span>
          <h2>La confianza no se promete, se verifica.</h2>
          <p>
            Tres capas de seguridad respaldan cada servicio que se realiza en
            ConfiaTec.
          </p>
        </div>
        <div className="trust-grid">
          {TRUST_ITEMS.map((item) => (
            <div className="trust-card reveal" key={item.title}>
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {item.icon}
                </svg>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
