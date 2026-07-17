"use client";

import { useState } from "react";
import ClientRequestCard from "./ClientRequestCard";
import ServiceSearchCard from "@/components/ServiceSearchCard";
import { useUserLocation } from "@/lib/useUserLocation";
import type { ClientRequestRow, ServiceCategory } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  completed: "Completada",
  cancelled: "Cancelada",
};

export type ClientRequestWithSnippet = ClientRequestRow & { snippet: string };

export default function ClientRequestsPanel({
  requests,
  categories,
}: {
  requests: ClientRequestWithSnippet[];
  categories: ServiceCategory[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null);
  const selected = requests.find((r) => r.id === selectedId) ?? null;
  const location = useUserLocation();

  return (
    <>
      <div style={{ maxWidth: "420px", marginBottom: "40px" }}>
        <ServiceSearchCard
          categories={categories}
          hasLocation={location.status === "ready" && !!location.position}
          locationStatus={location.status}
          onActivateLocation={location.activar}
        />
      </div>

      <div className="dp-headrow">
        <div>
          <span className="eyebrow">Mi panel</span>
          <h2>Mis solicitudes</h2>
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="empty-state-small">
          Todavía no has solicitado ningún servicio. <a href="/buscar">Busca un técnico</a>.
        </p>
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
                  {r.technician?.full_name ?? "Sin asignar"} ·{" "}
                  {new Date(r.created_at).toLocaleDateString("es-HN")}
                </div>
                <div className="dp-li-snippet">{r.snippet}</div>
              </div>
            ))}
          </div>
          <div className="dp-detail">
            {selected ? (
              <ClientRequestCard key={selected.id} request={selected} />
            ) : (
              <div className="dp-empty-detail">Selecciona una solicitud para ver el detalle.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
