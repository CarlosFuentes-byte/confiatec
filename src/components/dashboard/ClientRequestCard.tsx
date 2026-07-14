"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/initials";
import ReviewForm from "./ReviewForm";
import TechnicianLocationMap from "./TechnicianLocationMap";
import ConversationView from "./ConversationView";
import type { ClientRequestRow } from "@/lib/supabase/types";

const STEP_INDEX: Record<string, number> = { pending: 0, accepted: 1, completed: 2 };

function stepClass(stepIdx: number, current: number) {
  if (stepIdx < current) return "dp-step done";
  if (stepIdx === current) return "dp-step current";
  return "dp-step";
}

export default function ClientRequestCard({ request }: { request: ClientRequestRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

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

  const completeAndPay = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;

    setLoading(true);
    setPayError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("complete_and_pay", {
      p_request_id: request.id,
      p_amount: value,
    });
    setLoading(false);

    if (error) {
      setPayError(error.message);
      return;
    }

    router.refresh();
  };

  const review = request.reviews;
  const current = STEP_INDEX[request.status] ?? 0;
  const techName = request.technician?.full_name ?? "Sin asignar";

  return (
    <>
      <div className="dp-dhead">
        <div className="dp-who">
          <div className="dp-davatar">{getInitials(techName)}</div>
          <div>
            <div className="dp-dname">{techName}</div>
            <div className="dp-dmeta">{request.service_categories.name}</div>
          </div>
        </div>
        {request.status !== "cancelled" && (
          <div className="dp-stepper">
            <div className={stepClass(0, current)}>
              <span className="dot" />
              Pedido
            </div>
            <div className="dp-stepline" />
            <div className={stepClass(1, current)}>
              <span className="dot" />
              En camino
            </div>
            <div className="dp-stepline" />
            <div className={stepClass(2, current)}>
              <span className="dot" />
              Completado
            </div>
          </div>
        )}
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
          <div className="dp-empty-detail">
            Buscando el técnico ideal cerca de ti — te avisaremos apenas alguien acepte.
          </div>
          <div className="request-actions">
            <button className="btn btn-danger btn-sm" disabled={loading} onClick={cancel}>
              Cancelar solicitud
            </button>
          </div>
        </>
      )}

      {request.status === "accepted" && (
        <>
          <div className="request-interaction">
            <TechnicianLocationMap
              requestId={request.id}
              initialLat={request.technician_lat}
              initialLng={request.technician_lng}
            />
            <ConversationView requestId={request.id} currentUserId={request.client_id} compact />
          </div>

          {payError && (
            <div className="form-error" style={{ marginTop: "14px" }}>
              {payError} — <a href="/dashboard/wallet">recarga tu wallet</a>.
            </div>
          )}

          <form onSubmit={completeAndPay} className="dp-pay-row">
            <input
              className="form-input"
              type="number"
              min="1"
              step="1"
              required
              placeholder="Monto a pagar (L.)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              Pagar y completar
            </button>
          </form>
        </>
      )}

      {request.status === "completed" && (
        <>
          <ConversationView requestId={request.id} currentUserId={request.client_id} compact />
          <Link
            className="panel-action-link"
            href={`/dashboard/recibo/${request.id}`}
            style={{ display: "block", marginTop: "14px" }}
          >
            Ver recibo de pago →
          </Link>
          {request.technician_id &&
            (review ? (
              <div className="form-notice" style={{ marginTop: "16px" }}>
                ✓ Ya calificaste este servicio — gracias por tu reseña.
              </div>
            ) : (
              <ReviewForm
                requestId={request.id}
                clientId={request.client_id}
                technicianId={request.technician_id}
              />
            ))}
        </>
      )}

      {request.status === "cancelled" && (
        <div className="dp-empty-detail">Esta solicitud fue cancelada.</div>
      )}
    </>
  );
}
