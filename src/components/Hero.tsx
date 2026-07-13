"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getServiceIcon } from "@/lib/serviceIcons";
import type { ServiceCategory } from "@/lib/supabase/types";

export default function Hero({ categories }: { categories: ServiceCategory[] }) {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? null);
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState({ message: "", show: false });
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, show: true });
    toastTimeout.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      3200
    );
  };

  const handleSearch = () => {
    if (!address.trim()) {
      showToast("Escribe tu dirección para buscar técnicos cerca de ti");
      return;
    }
    const query = activeCategoryId ? `?category=${activeCategoryId}` : "";
    router.push(`/buscar${query}`);
  };

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">San Pedro Sula · Tegucigalpa</span>
          <h1>
            Tu técnico <em>verificado</em>, en minutos y a tu puerta.
          </h1>
          <p className="lead">
            ConfiaTec conecta hogares con electricistas, fontaneros y barberos
            verificados. Antecedentes revisados, ubicación en vivo y reseñas
            reales — sin arriesgarte con un número que llegó por WhatsApp.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#buscar">
              Buscar técnico verificado
            </a>
            <a className="btn btn-ghost" href="#tecnicos">
              Quiero ofrecer mis servicios
            </a>
          </div>
          <div className="trust-mini">
            <div className="avatars">
              <span>JR</span>
              <span>MC</span>
              <span>AL</span>
              <span>+50</span>
            </div>
            <span>Técnicos fundadores verificados desde el día uno</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div className="search-card" id="buscar">
            <h3>¿Qué servicio necesitas hoy?</h3>
            <div className="chip-row">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`chip ${activeCategoryId === cat.id ? "active" : ""}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {getServiceIcon(cat.name)}
                  </svg>
                  {cat.name}
                </div>
              ))}
            </div>
            <div className="field">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <input
                type="text"
                placeholder="Tu colonia o dirección — SPS o Tegucigalpa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={handleSearch}>
              Buscar técnico verificado
            </button>
            <p className="search-note">Resultados verificados de ConfiaTec</p>
          </div>

          <div className="stamp-wrap">
            <div className="ring"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>
            <svg className="stamp-badge" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" fill="#123240" stroke="#F2A93B" strokeWidth="2.5" />
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="#F2A93B"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <path
                d="M33 51l11 11 23-23"
                stroke="#3FAE7C"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <text
                x="50"
                y="80"
                textAnchor="middle"
                fontFamily="var(--font-plex-mono), monospace"
                fontSize="7.2"
                fill="#F2A93B"
                letterSpacing="1"
              >
                VERIFICADO
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.message}</div>
    </section>
  );
}
