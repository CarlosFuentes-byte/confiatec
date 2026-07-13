import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TechnicianRequestCard from "@/components/dashboard/TechnicianRequestCard";
import PremiumToggle from "@/components/dashboard/PremiumToggle";
import HowItWorks from "@/components/HowItWorks";
import Trust from "@/components/Trust";
import type { TechnicianRequestRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Mi panel — ConfiaTec",
};

type MiniReview = {
  id: string;
  rating: number;
  comment: string | null;
  technician: { full_name: string };
};

const linkCardStyle = { textDecoration: "none", display: "block" } as const;

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
      .select("profile_id, featured, verified")
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
            </a>{" "}
            <a className="panel-action-link" href="/dashboard/wallet">
              Mi wallet →
            </a>
          </div>
          {technicianProfile.verified ? (
            <div className="form-notice">✓ Cuenta verificada</div>
          ) : (
            <div className="form-notice" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
              Verificación en proceso — estamos revisando tus documentos.
            </div>
          )}
          <PremiumToggle profileId={user.id} featured={technicianProfile.featured} />
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

  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, technician:profiles!reviews_technician_id_fkey(full_name)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2);

  const reviews = (recentReviews as unknown as MiniReview[]) ?? [];

  return (
    <>
      <section className="auth-page">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Mi panel</span>
            <h2>¿Qué necesitas hoy?</h2>
          </div>

          <div className="trust-card" style={{ marginBottom: "32px" }}>
            <h3>Buscar técnico verificado</h3>
            <p>Electricistas, fontaneros, barberos y más — con antecedentes revisados.</p>
            <a className="btn btn-primary" href="/buscar" style={{ marginTop: "16px" }}>
              Buscar técnico
            </a>
          </div>

          <div className="services-grid" style={{ marginBottom: "40px" }}>
            <Link className="service-card" href="/dashboard/solicitudes" style={linkCardStyle}>
              <h4>Mis solicitudes</h4>
              <p>Estado, ubicación, chat y pago de tus servicios.</p>
            </Link>
            <Link className="service-card" href="/dashboard/perfil" style={linkCardStyle}>
              <h4>Editar mi perfil</h4>
              <p>Actualiza tus datos y tu foto.</p>
            </Link>
            <Link className="service-card" href="/dashboard/wallet" style={linkCardStyle}>
              <h4>Mi wallet</h4>
              <p>Saldo y movimientos de pago.</p>
            </Link>
            <Link className="service-card" href="/dashboard/resenas" style={linkCardStyle}>
              <h4>Mis reseñas</h4>
              <p>Calificaciones que has dejado.</p>
            </Link>
          </div>

          {reviews.length > 0 && (
            <>
              <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Tus últimas reseñas</h3>
              <div className="mini-review-grid">
                {reviews.map((review) => (
                  <div className="mini-review-card" key={review.id}>
                    <div className="review-rating">{"★".repeat(review.rating)}</div>
                    <div className="tech-card-meta">{review.technician.full_name}</div>
                    {review.comment && <p className="mini-review-snippet">{review.comment}</p>}
                  </div>
                ))}
              </div>
              <a className="panel-action-link" href="/dashboard/resenas">
                Ver todas →
              </a>
            </>
          )}
        </div>
      </section>

      <HowItWorks />
      <Trust />
    </>
  );
}
