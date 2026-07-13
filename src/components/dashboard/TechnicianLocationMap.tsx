"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { createClient } from "@/lib/supabase/client";

const POLL_INTERVAL_MS = 8000;

export default function TechnicianLocationMap({
  requestId,
  initialLat,
  initialLng,
}: {
  requestId: string;
  initialLat: number | null;
  initialLng: number | null;
}) {
  const [position, setPosition] = useState(
    initialLat != null && initialLng != null ? { lat: initialLat, lng: initialLng } : null
  );

  useEffect(() => {
    const supabase = createClient();

    const poll = async () => {
      const { data } = await supabase
        .from("service_requests")
        .select("technician_lat, technician_lng")
        .eq("id", requestId)
        .maybeSingle();

      if (data?.technician_lat != null && data?.technician_lng != null) {
        setPosition({ lat: data.technician_lat, lng: data.technician_lng });
      }
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [requestId]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!position) {
    return (
      <p className="request-card-meta" style={{ marginTop: "14px" }}>
        Esperando a que el técnico comparta su ubicación...
      </p>
    );
  }

  if (!apiKey) {
    return (
      <p className="location-error">
        Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para mostrar el mapa.
      </p>
    );
  }

  return (
    <div className="location-map">
      <APIProvider apiKey={apiKey}>
        <Map center={position} defaultZoom={15} disableDefaultUI gestureHandling="greedy">
          <Marker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
}
