"use client";

import { useState } from "react";
import TechnicianRequestCard from "./TechnicianRequestCard";
import PremiumToggle from "./PremiumToggle";
import type { TechnicianRequestRow } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  completed: "Completada",
  cancelled: "Cancelada",
};

export type TechnicianRequestWithSnippet = TechnicianRequestRow & { snippet: string };

export default function TechnicianRequestsPanel({
  requests,
  profileId,
  featured,
  verified,
}: {
  requests: TechnicianRequestWithSnippet[];
  profileId: string;
  featured: boolean;
  verified: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null);
  const selected = requests.find((r) => r.id === selectedId) ?? null;

  return (
    <>
      <div className="dp-headrow">
        <div>
          <span className="eyebrow">Mi panel</span>
          <h2>Solicitudes recibidas</h2>
        </div>
      </div>

      {verified ? (
        <div className="form-notice">✓ Cuenta verificada</div>
      ) : (
        <div className="form-notice" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
          Verificación en proceso — estamos revisando tus documentos.
        </div>
      )}

      <PremiumToggle profileId={profileId} featured={featured} />

      {requests.length === 0 ? (
        <p className="empty-state-small">Todavía no tienes solicitudes.</p>
      ) : (
        <div className="dp-split">
          <div className="dp-list">
            {requests.map((r) => (
              <div
                key={r.id}
                className={`dp-li ${r.id === selectedId ? "active" : ""}`}
                onClick={() => setSelectedId(r.id)}
              >
                <div className="dp-li-top">
                  <span className="dp-li-title">{r.service_categories.name}</span>
                  <span className={`status-badge status-${r.status}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <div className="dp-li-sub">
                  {r.client.full_name} · {new Date(r.created_at).toLocaleDateString("es-HN")}
                </div>
                <div className="dp-li-snippet">{r.snippet}</div>
              </div>
            ))}
          </div>
          <div className="dp-detail">
            {selected ? (
              <TechnicianRequestCard key={selected.id} request={selected} />
            ) : (
              <div className="dp-empty-detail">Selecciona una solicitud para ver el detalle.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
