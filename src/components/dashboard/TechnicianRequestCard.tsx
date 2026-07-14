"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/initials";
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
    <>
      <div className="dp-dhead">
        <div className="dp-who">
          <div className="dp-davatar">{getInitials(request.client.full_name)}</div>
          <div>
            <div className="dp-dname">{request.client.full_name}</div>
            <div className="dp-dmeta">{request.service_categories.name}</div>
          </div>
        </div>
        <span className={`status-badge status-${request.status}`}>
          {STATUS_LABEL[request.status]}
        </span>
      </div>

      <div className="dp-addr">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {request.address_text}
      </div>

      {request.status === "pending" && (
        <>
          <div className="dp-empty-detail">Nueva solicitud esperando tu respuesta.</div>
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
        </>
      )}

      {request.status === "accepted" && (
        <>
          {sharingLocation && (
            <div className="location-status">Compartiendo tu ubicación en vivo con el cliente</div>
          )}
          {locationError && <div className="location-error">{locationError}</div>}

          {request.client_lat != null && request.client_lng != null ? (
            <div className="request-interaction" style={{ marginTop: "16px" }}>
              <StaticLocationMap lat={request.client_lat} lng={request.client_lng} />
              <ConversationView
                requestId={request.id}
                currentUserId={request.technician_id!}
                compact
              />
            </div>
          ) : (
            <div style={{ marginTop: "16px" }}>
              <ConversationView
                requestId={request.id}
                currentUserId={request.technician_id!}
                compact
              />
            </div>
          )}

          <p className="dp-li-sub" style={{ marginTop: "14px" }}>
            Esperando a que el cliente confirme que el trabajo fue completado.
          </p>
        </>
      )}

      {request.status === "completed" && (
        <>
          <div className="dp-empty-detail">
            Servicio completado el {new Date(request.created_at).toLocaleDateString("es-HN")}. Buen
            trabajo.
          </div>
          <Link
            className="panel-action-link"
            href={`/dashboard/recibo/${request.id}`}
            style={{ display: "block", textAlign: "center" }}
          >
            Ver recibo de pago →
          </Link>
        </>
      )}

      {request.status === "cancelled" && (
        <div className="dp-empty-detail">Esta solicitud fue rechazada.</div>
      )}
    </>
  );
}
