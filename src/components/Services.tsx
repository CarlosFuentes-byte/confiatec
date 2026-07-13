import { getServiceIcon } from "@/lib/serviceIcons";

const SERVICES = [
  {
    name: "Electricista",
    desc: "Instalaciones, cortocircuitos y mantenimiento eléctrico del hogar.",
  },
  {
    name: "Fontanero",
    desc: "Fugas, tuberías e instalación de sistemas de agua.",
  },
  {
    name: "Barbero",
    desc: "Cortes y arreglo a domicilio, con horario a tu conveniencia.",
  },
  {
    name: "Cerrajero",
    desc: "Cambio de cerraduras y emergencias de acceso al hogar.",
  },
  {
    name: "Pintor",
    desc: "Pintura interior y exterior con presupuesto claro desde el inicio.",
  },
  {
    name: "Jardinero",
    desc: "Mantenimiento de jardines y áreas verdes residenciales.",
  },
  {
    name: "Electrodomésticos",
    desc: "Reparación de lavadoras, refrigeradoras y equipo del hogar.",
  },
  {
    name: "Albañilería",
    desc: "Reparaciones menores de construcción y acabados.",
  },
];

export default function Services() {
  return (
    <section id="servicios">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Servicios</span>
          <h2>Oficios calificados, un solo lugar para encontrarlos.</h2>
          <p>
            Cada técnico pasa por verificación de antecedentes antes de
            aparecer en la plataforma.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map((service) => (
            <div className="service-card reveal" key={service.name}>
              <svg
                className="service-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                {getServiceIcon(service.name)}
              </svg>
              <h4>{service.name}</h4>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
