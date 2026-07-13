"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#servicios", label: "Servicios" },
  { href: "#tecnicos", label: "Para técnicos" },
  { href: "#confianza", label: "Seguridad" },
  { href: "/precios", label: "Precios" },
];

type HeaderUser = { id: string; role: "client" | "technician" | null } | null;

export default function Header({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header>
        <nav className="nav">
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
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-cta">
            {user ? (
              <>
                <a className="btn btn-ghost" href="/dashboard">
                  Mi panel
                </a>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a className="btn btn-ghost" href="/login">
                  Iniciar sesión
                </a>
                <a className="btn btn-ghost" href="#tecnicos">
                  Soy técnico
                </a>
              </>
            )}
            <a className="btn btn-primary" href="/buscar">
              Buscar técnico
            </a>
            <button
              className="burger"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      <div className={`scrim ${menuOpen ? "show" : ""}`} onClick={closeMenu}></div>
      <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a className="btn btn-primary btn-block" href="/buscar" onClick={closeMenu}>
          Buscar técnico
        </a>
        {user ? (
          <>
            <a className="btn btn-ghost btn-block" href="/dashboard" onClick={closeMenu}>
              Mi panel
            </a>
            <button className="btn btn-ghost btn-block" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <a className="btn btn-ghost btn-block" href="/login" onClick={closeMenu}>
            Iniciar sesión
          </a>
        )}
      </div>
    </>
  );
}
