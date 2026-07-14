import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Recibo de pago — ConfiaTec",
};

type ReceiptRequest = {
  id: string;
  address_text: string;
  service_categories: { name: string };
  client: { full_name: string } | null;
  technician: { full_name: string } | null;
};

export default async function ReciboPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: transaction } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("service_request_id", requestId)
    .eq("profile_id", user.id)
    .in("type", ["payment_sent", "payment_received"])
    .maybeSingle();

  if (!transaction) notFound();

  const { data: request } = await supabase
    .from("service_requests")
    .select(
      "id, address_text, service_categories(name), client:profiles!service_requests_client_id_fkey(full_name), technician:profiles!service_requests_technician_id_fkey(full_name)"
    )
    .eq("id", requestId)
    .single();

  if (!request) notFound();

  const req = request as unknown as ReceiptRequest;
  const isClientView = transaction.type === "payment_sent";
  const amount = Math.abs(transaction.amount);

  return (
    <div className="receipt-page">
      <div className="receipt-card">
        <div className="receipt-head">
          <div className="logo">
            <svg className="logo-mark" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#F2A93B" strokeWidth="2" />
              <path
                d="M9 16.5L13.5 21L23 10"
                stroke="#F2A93B"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            ConfiaTec
          </div>
          <span className="status-badge status-completed">Pagado</span>
        </div>

        <h2 style={{ fontSize: "20px", marginBottom: "4px" }}>Constancia de pago</h2>
        <p className="receipt-id mono">Recibo #{transaction.id.slice(0, 8).toUpperCase()}</p>

        <div className="receipt-rows">
          <div className="receipt-row">
            <span>Fecha</span>
            <span>
              {new Date(transaction.created_at).toLocaleString("es-HN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="receipt-row">
            <span>Servicio</span>
            <span>{req.service_categories.name}</span>
          </div>
          <div className="receipt-row">
            <span>Dirección</span>
            <span>{req.address_text}</span>
          </div>
          <div className="receipt-row">
            <span>Cliente</span>
            <span>{req.client?.full_name ?? "—"}</span>
          </div>
          <div className="receipt-row">
            <span>Técnico</span>
            <span>{req.technician?.full_name ?? "—"}</span>
          </div>
          <div className="receipt-row">
            <span>Solicitud</span>
            <span className="mono">{req.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="receipt-total">
          <span>{isClientView ? "Total pagado" : "Total recibido"}</span>
          <span>L. {amount.toFixed(2)}</span>
        </div>
        {!isClientView && transaction.description && (
          <p className="receipt-note">{transaction.description}</p>
        )}

        <div className="receipt-actions no-print">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}
