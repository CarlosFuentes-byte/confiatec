const STEPS = [
  {
    num: "01",
    title: "Pide tu servicio",
    desc: "Elige el oficio que necesitas, describe el problema en una frase y comparte tu ubicación exacta.",
  },
  {
    num: "02",
    title: "Te conecta con el técnico ideal",
    desc: "El ranking prioriza calificación y cercanía. Ves el precio estimado antes de aceptar — sin sorpresas.",
  },
  {
    num: "03",
    title: "Recibe el servicio, verificado",
    desc: "Antecedentes revisados, geolocalización en vivo durante la visita, y reseña real al terminar.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Cómo funciona</span>
          <h2>De la necesidad al técnico en tu puerta, en tres pasos.</h2>
          <p>
            Pensado para hogares ocupados que valoran seguridad y transparencia
            por encima de todo.
          </p>
        </div>
        <div className="steps">
          {STEPS.map((step, i) => (
            <div className="step-card reveal" key={step.num}>
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < STEPS.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
