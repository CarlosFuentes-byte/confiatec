"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Solicitudes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/dashboard/wallet",
    label: "Wallet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    href: "/dashboard/resenas",
    label: "Reseñas",
    clientOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 17.3 6.2 20l1.1-6.5L2.6 9l6.5-1L12 2l2.9 6 6.5 1-4.7 4.5 1.1 6.5z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/perfil",
    label: "Perfil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

export default function DashboardShell({
  role,
  children,
}: {
  role: "client" | "technician";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => !item.clientOnly || role === "client");

  return (
    <section className="dp-shell-page">
      <div className="dp-body">
        <nav className="dp-side">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`item ${pathname === item.href ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="dp-main">{children}</div>
      </div>
    </section>
  );
}
