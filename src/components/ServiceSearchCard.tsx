"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LocationStatus } from "@/lib/useUserLocation";
import type { ServiceCategory } from "@/lib/supabase/types";

export default function ServiceSearchCard({
  categories,
  hasLocation,
  locationStatus,
  onActivateLocation,
}: {
  categories: ServiceCategory[];
  hasLocation: boolean;
  locationStatus: LocationStatus;
  onActivateLocation: () => Promise<{ lat: number; lng: number } | null>;
}) {
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

  const goToBuscar = () => {
    const query = activeCategoryId ? `?category=${activeCategoryId}` : "";
    router.push(`/buscar${query}`);
  };

  const handleSearch = async () => {
    if (hasLocation || address.trim()) {
      goToBuscar();
      return;
    }

    const coords = await onActivateLocation();
    if (coords) {
      goToBuscar();
    } else {
      showToast("No pudimos detectar tu ubicación. Escribe tu dirección para buscar.");
    }
  };

  return (
    <>
      <div className="b-card">
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
        {hasLocation ? (
          <p style={{ fontSize: "12.5px", color: "var(--green)", marginBottom: "12px" }}>
            ✓ Usando tu ubicación actual
          </p>
        ) : (
          <div className="b-field">
            <input
              type="text"
              placeholder="Tu colonia o dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}
        <button
          className="btn btn-primary btn-block"
          onClick={handleSearch}
          disabled={locationStatus === "locating"}
        >
          {locationStatus === "locating" ? "Buscando tu ubicación..." : "Buscar"}
        </button>
      </div>
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.message}</div>
    </>
  );
}
