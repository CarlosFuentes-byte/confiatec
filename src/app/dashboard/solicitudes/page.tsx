import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientRequestCard from "@/components/dashboard/ClientRequestCard";
import type { ClientRequestRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mis solicitudes — ConfiaTec",
};

export default async function MySolicitudesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "client") redirect("/dashboard");

  const { data: requests } = await supabase
    .from("service_requests")
    .select(
      "*, technician:profiles!service_requests_technician_id_fkey(full_name), service_categories(name), reviews(id, rating, comment)"
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="auth-page">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Mis solicitudes</span>
          <h2>Tus servicios pedidos</h2>
        </div>
        {requests && requests.length > 0 ? (
          <div className="dash-grid">
            {(requests as ClientRequestRow[]).map((r) => (
              <ClientRequestCard key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <p className="empty-state-small">
            Todavía no has solicitado ningún servicio. <a href="/buscar">Busca un técnico</a>.
          </p>
        )}
      </div>
    </section>
  );
}
