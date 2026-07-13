"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StaticLocationMap from "./StaticLocationMap";
import ConversationView from "./ConversationView";
import type { RequestStatus, TechnicianRequestRow } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const LOCATION_UPDATE_INTERVAL_MS = 10000;

export default function TechnicianRequestCard({
  request,
}: {
  request: TechnicianRequestRow;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sharingLocation, setSharingLocation] = useState(false);

  const updateStatus = async (status: RequestStatus) => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("service_requests").update({ status }).eq("id", request.id);
    setLoading(false);
    router.refresh();
  };

  useEffect(() => {
    if (request.status !== "accepted") return;
    if (!("geolocation" in navigator)) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    const supabase = createClient();
    const lastSentAt = { current: 0 };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setSharingLocation(true);
        setLocationError(null);

        const now = Date.now();
        if (now - lastSentAt.current < LOCATION_UPDATE_INTERVAL_MS) return;
        lastSentAt.current = now;

        supabase
          .from("service_requests")
          .update({
            technician_lat: position.coords.latitude,
            technician_lng: position.coords.longitude,
            location_updated_at: new Date().toISOString(),
          })
          .eq("id", request.id)
          .then();
      },
      () => {
        setSharingLocation(false);
        setLocationError("No pudimos acceder a tu ubicación. Actívala en tu navegador.");
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setSharingLocation(false);
    };
  }, [request.status, request.id]);

  return (
    <div className="request-card">
      <div className="request-card-head">
        <div>
          <div className="request-card-title">{request.service_categories.name}</div>
          <div className="request-card-meta">
            Cliente: {request.client.full_name} ·{" "}
            {new Date(request.created_at).toLocaleDateString("es-HN")}
          </div>
        </div>
        <span className={`status-badge status-${request.status}`}>
          {STATUS_LABEL[request.status]}
        </span>
      </div>
      <p className="request-card-address">{request.address_text}</p>

      {request.client_lat != null && request.client_lng != null ? (
        <div className="request-interaction">
          <StaticLocationMap lat={request.client_lat} lng={request.client_lng} />
          <ConversationView
            requestId={request.id}
            currentUserId={request.technician_id!}
            compact
          />
        </div>
      ) : (
        <ConversationView
          requestId={request.id}
          currentUserId={request.technician_id!}
          compact
        />
      )}

      {request.status === "accepted" && sharingLocation && (
        <div className="location-status">Compartiendo tu ubicación en vivo</div>
      )}
      {request.status === "accepted" && locationError && (
        <div className="location-error">{locationError}</div>
      )}

      {request.status === "pending" && (
        <div className="request-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={loading}
            onClick={() => updateStatus("accepted")}
          >
            Aceptar
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={loading}
            onClick={() => updateStatus("cancelled")}
          >
            Rechazar
          </button>
        </div>
      )}

      {request.status === "accepted" && (
        <div className="request-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={loading}
            onClick={() => updateStatus("completed")}
          >
            Marcar como completado
          </button>
        </div>
      )}
    </div>
  );
}
