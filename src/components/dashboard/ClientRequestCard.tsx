"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReviewForm from "./ReviewForm";
import TechnicianLocationMap from "./TechnicianLocationMap";
import ConversationView from "./ConversationView";
import type { ClientRequestRow } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  completed: "Completada",
  cancelled: "Cancelada",
};

export default function ClientRequestCard({ request }: { request: ClientRequestRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const cancel = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("service_requests")
      .update({ status: "cancelled" })
      .eq("id", request.id);
    setLoading(false);
    router.refresh();
  };

  const complete = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("service_requests")
      .update({ status: "completed" })
      .eq("id", request.id);
    setLoading(false);
    router.refresh();
  };

  const review = request.reviews?.[0];

  return (
    <div className="request-card">
      <div className="request-card-head">
        <div>
          <div className="request-card-title">{request.service_categories.name}</div>
          <div className="request-card-meta">
            Técnico: {request.technician?.full_name ?? "Sin asignar"} ·{" "}
            {new Date(request.created_at).toLocaleDateString("es-HN")}
          </div>
        </div>
        <span className={`status-badge status-${request.status}`}>
          {STATUS_LABEL[request.status]}
        </span>
      </div>
      <p className="request-card-address">{request.address_text}</p>

      {request.status === "pending" && (
        <div className="request-actions">
          <button className="btn btn-danger btn-sm" disabled={loading} onClick={cancel}>
            Cancelar solicitud
          </button>
        </div>
      )}

      {request.status === "accepted" ? (
        <>
          <div className="request-interaction">
            <TechnicianLocationMap
              requestId={request.id}
              initialLat={request.technician_lat}
              initialLng={request.technician_lng}
            />
            <ConversationView requestId={request.id} currentUserId={request.client_id} compact />
          </div>
          <div className="request-actions">
            <button className="btn btn-primary btn-sm" disabled={loading} onClick={complete}>
              Marcar como completado
            </button>
          </div>
        </>
      ) : (
        <ConversationView requestId={request.id} currentUserId={request.client_id} compact />
      )}

      {request.status === "completed" &&
        request.technician_id &&
        (review ? (
          <p className="request-card-meta" style={{ marginTop: "14px" }}>
            Tu reseña: {"★".repeat(review.rating)} {review.comment}
          </p>
        ) : (
          <ReviewForm
            requestId={request.id}
            clientId={request.client_id}
            technicianId={request.technician_id}
          />
        ))}
    </div>
  );
}
