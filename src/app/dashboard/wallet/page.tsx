import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WalletTopUpForm from "@/components/dashboard/WalletTopUpForm";
import TechnicianCardForm from "@/components/dashboard/TechnicianCardForm";
import type { WalletTransaction } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mi wallet — ConfiaTec",
};

const TYPE_LABEL: Record<string, string> = {
  topup: "Recarga",
  payment_sent: "Pago enviado",
  payment_received: "Pago recibido",
  premium: "Suscripción Premium",
};

export default async function WalletPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, wallet_balance")
    .eq("id", user.id)
    .single();

  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div style={{ maxWidth: "640px" }}>
      <div className="sec-head" style={{ marginBottom: "24px" }}>
        <span className="eyebrow">Mi wallet</span>
        <h2>Saldo y movimientos</h2>
      </div>

        <div className="wallet-balance-card">
          <div className="wallet-balance-label">Saldo disponible</div>
          <div className="wallet-balance-amount">
            L. {(profile?.wallet_balance ?? 0).toFixed(2)}
          </div>
        </div>

        {profile?.role === "client" ? (
          <WalletTopUpForm />
        ) : (
          <>
            <p className="empty-state-small" style={{ marginBottom: "16px" }}>
              Tu wallet es un registro de tus pagos recibidos y gastos en ConfiaTec — el saldo
              crece con los servicios que completas, no se puede recargar manualmente.
            </p>
            <TechnicianCardForm />
          </>
        )}

        <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Historial</h3>
        {transactions && transactions.length > 0 ? (
          <div className="form-card" style={{ maxWidth: "100%" }}>
            {(transactions as WalletTransaction[]).map((tx) => (
              <div className="wallet-tx-row" key={tx.id}>
                <div>
                  <div className="wallet-tx-desc">
                    {tx.description ?? TYPE_LABEL[tx.type] ?? tx.type}
                  </div>
                  <div className="wallet-tx-date">
                    {new Date(tx.created_at).toLocaleString("es-HN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`wallet-tx-amount ${tx.amount >= 0 ? "positive" : "negative"}`}>
                    {tx.amount >= 0 ? "+" : ""}
                    L. {tx.amount.toFixed(2)}
                  </div>
                  {tx.service_request_id && (
                    <Link
                      className="panel-action-link"
                      style={{ fontSize: "12.5px", marginTop: "4px" }}
                      href={`/dashboard/recibo/${tx.service_request_id}`}
                    >
                      Ver recibo →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state-small">Todavía no tienes movimientos.</p>
        )}
    </div>
  );
}
