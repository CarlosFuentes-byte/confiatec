"use client";

import { useState } from "react";

export default function LocationCaptureButton({
  hasLocation = false,
  onCapture,
}: {
  hasLocation?: boolean;
  onCapture: (lat: number, lng: number) => void;
}) {
  const [locating, setLocating] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = () => {
    if (!("geolocation" in navigator)) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onCapture(position.coords.latitude, position.coords.longitude);
        setCaptured(true);
        setLocating(false);
      },
      () => {
        setError("No pudimos acceder a tu ubicación. Actívala en tu navegador e intenta de nuevo.");
        setLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const showSaved = captured || hasLocation;

  return (
    <div className="form-group">
      <button type="button" className="btn btn-ghost btn-sm" onClick={capture} disabled={locating}>
        {locating ? "Ubicando..." : showSaved ? "Ubicación guardada ✓" : "Usar mi ubicación actual"}
      </button>
      <p style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--text-muted-2)" }}>
        Así apareces en el mapa de &ldquo;técnicos cerca de ti&rdquo; para los clientes.
      </p>
      {error && (
        <p className="location-error" style={{ marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
