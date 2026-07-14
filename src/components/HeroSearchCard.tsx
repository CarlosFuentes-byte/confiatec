"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceCategory } from "@/lib/supabase/types";

export default function HeroSearchCard({ categories }: { categories: ServiceCategory[] }) {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? null);
  const [address, setAddress] = useState("");
  const [toast, setToast] = useState({ message: "", show: false });
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, show: true });
    toastTimeout.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
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
    <>
      <div className="b-card" id="buscar">
        <h4>¿Qué servicio necesitas hoy?</h4>
        <div className="b-chip-row">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`b-chip ${activeCategoryId === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>
        <div className="b-field">
          <input
            type="text"
            placeholder="Tu colonia o dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-block" onClick={handleSearch}>
          Buscar
        </button>
      </div>
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.message}</div>
    </>
  );
}
