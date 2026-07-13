"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RequestServiceForm({
  clientId,
  technicianId,
  categoryId,
}: {
  clientId: string;
  technicianId: string;
  categoryId: number;
}) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const captureLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("No pudimos acceder a tu ubicación. Puedes seguir con solo la dirección.");
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("service_requests").insert({
      client_id: clientId,
      technician_id: technicianId,
      category_id: categoryId,
      address_text: address,
      client_lat: coords?.lat ?? null,
      client_lng: coords?.lng ?? null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDone(true);
    router.refresh();
  };

  if (done) {
    return (
      <div className="form-notice" style={{ marginTop: "32px" }}>
        Solicitud enviada. Sigue su estado en{" "}
        <a href="/dashboard" style={{ color: "var(--green)", fontWeight: 600 }}>
          tu panel
        </a>
        .
      </div>
    );
  }

  return (
    <div className="form-card" style={{ margin: "32px 0 0", maxWidth: "100%", padding: "24px" }}>
      <h3 className="form-title" style={{ fontSize: "18px" }}>
        Solicitar este servicio
      </h3>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Tu colonia o dirección
          </label>
          <input
            id="address"
            className="form-input"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={captureLocation}
            disabled={locating}
          >
            {locating
              ? "Ubicando..."
              : coords
                ? "Ubicación capturada ✓"
                : "Usar mi ubicación actual"}
          </button>
          {locationError && (
            <p className="location-error" style={{ marginTop: "8px" }}>
              {locationError}
            </p>
          )}
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}
