import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClientRequestCard from "@/components/dashboard/ClientRequestCard";
import TechnicianRequestCard from "@/components/dashboard/TechnicianRequestCard";
import type { ClientRequestRow, TechnicianRequestRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mi panel — ConfiaTec",
};

export default async function DashboardPage() {
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

  if (profile?.role === "technician") {
    const { data: technicianProfile } = await supabase
      .from("technician_profiles")
      .select("profile_id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!technicianProfile) redirect("/tecnicos/unirse");

    const { data: requests } = await supabase
      .from("service_requests")
      .select(
        "*, client:profiles!service_requests_client_id_fkey(full_name), service_categories(name)"
      )
      .eq("technician_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <section className="auth-page">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Mi panel</span>
            <h2>Solicitudes recibidas</h2>
            <a className="panel-action-link" href="/dashboard/perfil">
              Editar mi perfil →
            </a>
          </div>
          {requests && requests.length > 0 ? (
            <div className="dash-grid">
              {(requests as TechnicianRequestRow[]).map((r) => (
                <TechnicianRequestCard key={r.id} request={r} />
              ))}
            </div>
          ) : (
            <p className="empty-state-small">Todavía no tienes solicitudes.</p>
          )}
        </div>
      </section>
    );
  }

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
          <span className="eyebrow">Mi panel</span>
          <h2>Mis solicitudes</h2>
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
