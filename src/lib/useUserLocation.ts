"use client";

import { useCallback, useState } from "react";

export type LocationStatus = "idle" | "locating" | "error" | "ready";

export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const activar = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        setStatus("error");
        setError("Tu navegador no soporta geolocalización.");
        resolve(null);
        return;
      }
      setStatus("locating");
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(coords);
          setStatus("ready");
          resolve(coords);
        },
        () => {
          setStatus("error");
          setError("No pudimos acceder a tu ubicación. Actívala en tu navegador e intenta de nuevo.");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  return { status, error, position, activar };
}
