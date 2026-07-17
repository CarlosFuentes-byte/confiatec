"use client";

import Link from "next/link";
import TechAvatar from "@/components/TechAvatar";
import NearbyTechniciansMap from "@/components/NearbyTechniciansMap";
import { getServiceIcon } from "@/lib/serviceIcons";
import { useUserLocation } from "@/lib/useUserLocation";
import type { ServiceCategory, TechnicianListItem } from "@/lib/supabase/types";

const TIMELINE = [
  {
    num: "01",
    title: "Pide tu servicio",
    desc: "Elige el oficio, describe el problema y comparte tu ubicación.",
  },
  {
    num: "02",
    title: "Conecta con el ideal",
    desc: "El ranking prioriza calificación y cercanía, con precio estimado.",
  },
  {
    num: "03",
    title: "Recibe, verificado",
    desc: "Geolocalización en vivo y reseña real al terminar.",
  },
];

const TECH_BENEFITS = [
  "Onboarding gratuito para los primeros 50 técnicos fundadores.",
  "Ranking visible: la constancia te pone primero.",
  "Ingresos estables con comisión clara.",
];

const TRUST_STATS = [
  { num: "100%", desc: "Técnicos con antecedentes revisados junto a Policía Nacional." },
  { num: "Live", desc: "Geolocalización en vivo desde que aceptan hasta que llegan." },
  { num: "0", desc: "Reseñas falsas — solo servicios completados califican." },
];

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  { id: 1, name: "Electricista", icon_slug: "electricista" },
  { id: 2, name: "Fontanero", icon_slug: "fontanero" },
  { id: 3, name: "Barbero", icon_slug: "barbero" },
  { id: 4, name: "Cerrajero", icon_slug: "cerrajero" },
  { id: 5, name: "Pintor", icon_slug: "pintor" },
];

const CATEGORY_DESC: Record<string, string> = {
  Electricista: "Instalaciones, cortocircuitos y mantenimiento eléctrico del hogar.",
  Fontanero: "Fugas e instalación de sistemas de agua.",
  Barbero: "Cortes y arreglo a domicilio.",
  Cerrajero: "Cambio de cerraduras y accesos urgentes.",
  Pintor: "Pintura interior y exterior con presupuesto claro.",
  Jardinero: "Mantenimiento de jardines y áreas verdes.",
  Electrodomésticos: "Reparación de lavadoras, refrigeradoras y más.",
  Albañilería: "Reparaciones menores de construcción y acabados.",
};

export default function HomeLanding({
  categories,
  technicians,
}: {
  categories: ServiceCategory[];
  technicians: TechnicianListItem[];
}) {
  const visibleCategories = categories?.length ? categories : DEFAULT_CATEGORIES;
  const bentoCategories = visibleCategories.slice(0, 5);
  const previewTechnicians = technicians.slice(0, 2);
  const rankedTechnicians = technicians.slice(0, 3);
  const location = useUserLocation();

  return (
    <main>
      <section className="b-hero">
        <div className="wrap">
          <div className="b-hero-top">
            <span className="eyebrow">San Pedro Sula · Tegucigalpa</span>
            <div className="b-badgerow">
              <span className="b-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                312 antecedentes verificados
              </span>
              <span className="b-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                4.8★ promedio
              </span>
            </div>
          </div>

          <div className="b-bento">
            <div>
              <h1>
                Tu técnico <em>verificado</em>, en minutos y a tu puerta.
              </h1>
              <p className="b-lead">
                ConfiaTec conecta hogares con electricistas, fontaneros, barberos y otros trabajadores de oficio verificados —
                antecedentes revisados, ubicación en vivo y reseñas reales.
              </p>
              <div className="b-ctas">
                <Link className="btn btn-primary" href="/buscar">
                  Buscar técnico verificado
                </Link>
                <Link className="btn btn-ghost" href="#tecnicos">
                  Quiero ofrecer mis servicios
                </Link>
              </div>
              <NearbyTechniciansMap
                status={location.status}
                error={location.error}
                position={location.position}
                onActivate={location.activar}
              />
            </div>

            <div className="b-side">
              <div className="b-card">
                <h4>Vista previa · Panel técnico</h4>
                {previewTechnicians.length > 0 ? (
                  previewTechnicians.map((t) => (
                    <div className="b-mini-rank" key={t.profile_id}>
                      <TechAvatar tech={t} className="b-mini-avatar" />
                      <span style={{ flex: 1 }}>{t.profiles.full_name}</span>
                      <span className="mono" style={{ color: "var(--green)" }}>
                        {t.rating_avg > 0 ? `${t.rating_avg}★` : "Nuevo"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted-2)" }}>
                    Sé de los primeros técnicos fundadores.
                  </p>
                )}
                <Link
                  className="btn btn-teal btn-block"
                  href="/tecnicos/unirse"
                  style={{ marginTop: "10px", fontSize: "13px", padding: "10px 18px" }}
                >
                  Únete como técnico
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "0" }}>
            <span className="eyebrow">Cómo funciona</span>
            <h2>De la necesidad al técnico en tu puerta.</h2>
          </div>
          <div className="b-timeline">
            {TIMELINE.map((step) => (
              <div className="b-tstep" key={step.num}>
                <div className="b-tnum">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "28px" }}>
            <span className="eyebrow">Servicios</span>
            <h2>Oficios calificados, un solo lugar para encontrarlos.</h2>
            <p>
              Estos son algunos de los oficios más buscados — pero no nos limitamos a
              ellos. Aceptamos técnicos verificados de cualquier oficio o trabajo manual.
            </p>
          </div>
          <div className="b-svc-grid">
            {bentoCategories.map((cat, i) => (
              <Link
                href={`/buscar?category=${cat.id}`}
                className={`b-svc ${i === 0 ? "big" : ""}`}
                key={cat.id}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {getServiceIcon(cat.name)}
                </svg>
                <h4>{cat.name}</h4>
                {i === 0 && <p>{CATEGORY_DESC[cat.name] ?? "Servicio verificado a domicilio."}</p>}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
            ¿Tu oficio no está en la lista?{" "}
            <Link href="/tecnicos/unirse" style={{ color: "var(--gold)", fontWeight: 600 }}>
              Únete de todas formas →
            </Link>
          </p>
        </div>
      </section>

      <section className="b-techzone" id="tecnicos">
        <div className="wrap b-tz-grid">
          <div>
            <span className="b-tz-badge">Zona técnico</span>
            <h2>¿Tienes un oficio? Sé fundador, no solo usuario.</h2>
            <ul className="b-tz-list">
              {TECH_BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
            <Link className="btn btn-teal" href="/tecnicos/unirse">
              Únete como técnico fundador
            </Link>
          </div>

          <div className="b-rankcard">
            <h4>Ranking de la semana</h4>
            {rankedTechnicians.length > 0 ? (
              rankedTechnicians.map((t, i) => (
                <div className="rank-row" key={t.profile_id}>
                  <span className="rank-pos">{String(i + 1).padStart(2, "0")}</span>
                  <TechAvatar tech={t} className="rank-avatar" />
                  <div className="rank-name">
                    {t.profiles.full_name}
                    <span>
                      {t.service_categories.name} ·{" "}
                      {t.rating_avg > 0 ? `${t.rating_avg}★` : "Nuevo"}
                    </span>
                  </div>
                  {t.featured && <span className="rank-badge">Destacado</span>}
                </div>
              ))
            ) : (
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                Todavía no hay técnicos verificados — sé el primero.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="confianza">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "0" }}>
            <span className="eyebrow">Seguridad primero</span>
            <h2>La confianza no se promete, se verifica.</h2>
          </div>
          <div className="b-trust-grid">
            {TRUST_STATS.map((stat) => (
              <div className="b-tcard" key={stat.desc}>
                <div className="num">{stat.num}</div>
                <p>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
