"use client";

import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { createClient } from "@/lib/supabase/client";
import type { TechnicianListItem } from "@/lib/supabase/types";

type NearbyTechnician = TechnicianListItem & { distanceKm: number };

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export default function NearbyTechniciansMap() {
  const [status, setStatus] = useState<"idle" | "locating" | "error" | "ready">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [nearby, setNearby] = useState<NearbyTechnician[]>([]);

  const activar = () => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setErrorMsg("Tu navegador no soporta geolocalización.");
      return;
    }
    setStatus("locating");
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };

        const supabase = createClient();
        const { data } = await supabase
          .from("technician_profiles")
          .select(
            "*, profiles!inner(full_name, city, avatar_url), service_categories(name, icon_slug)"
          )
          .not("lat", "is", null)
          .not("lng", "is", null);

        const withDistance = ((data as TechnicianListItem[]) ?? [])
          .map((t) => ({
            ...t,
            distanceKm: haversineKm(here.lat, here.lng, t.lat!, t.lng!),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 6);

        setPosition(here);
        setNearby(withDistance);
        setStatus("ready");
      },
      () => {
        setStatus("error");
        setErrorMsg("No pudimos acceder a tu ubicación. Actívala en tu navegador e intenta de nuevo.");
      },
      { enableHighAccuracy: true }
    );
  };

  if (status === "ready" && position) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return <p className="location-error">Falta configurar el mapa.</p>;
    }
    return (
      <div>
        <div className="b-map-box">
          <APIProvider apiKey={apiKey}>
            <Map center={position} defaultZoom={12} disableDefaultUI gestureHandling="greedy">
              <Marker position={position} title="Tu ubicación" />
              {nearby.map((t) => (
                <Marker
                  key={t.profile_id}
                  position={{ lat: t.lat!, lng: t.lng! }}
                  title={`${t.profiles.full_name} · ${t.service_categories.name}`}
                />
              ))}
            </Map>
          </APIProvider>
        </div>
        {nearby.length === 0 && (
          <p style={{ fontSize: "12.5px", color: "var(--text-muted-2)", marginTop: "8px" }}>
            Todavía no hay técnicos con ubicación registrada cerca de ti.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="b-imgph">
      <button className="btn btn-primary" onClick={activar} disabled={status === "locating"}>
        {status === "locating" ? "Buscando tu ubicación..." : "Activar mi ubicación"}
      </button>
      {status === "error" && (
        <p className="location-error" style={{ marginTop: "10px" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
