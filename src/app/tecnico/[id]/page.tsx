import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/initials";
import RequestServiceForm from "@/components/RequestServiceForm";
import type { Review, TechnicianListItem } from "@/lib/supabase/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("technician_profiles")
    .select("profiles(full_name)")
    .eq("profile_id", id)
    .maybeSingle();

  const fullName = (data as { profiles: { full_name: string } } | null)?.profiles
    ?.full_name;

  return { title: fullName ? `${fullName} — ConfiaTec` : "Técnico — ConfiaTec" };
}

export default async function TecnicoProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: technician } = await supabase
    .from("technician_profiles")
    .select("*, profiles(full_name, city, avatar_url), service_categories(name, icon_slug)")
    .eq("profile_id", id)
    .maybeSingle();

  if (!technician) notFound();

  const tech = technician as TechnicianListItem;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles!reviews_client_id_fkey(full_name)")
    .eq("technician_id", id)
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let viewerRole: string | null = null;
  if (user) {
    const { data: viewerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    viewerRole = viewerProfile?.role ?? null;
  }

  return (
    <section className="auth-page">
      <div className="wrap" style={{ maxWidth: "720px" }}>
        <div className="tech-profile-head">
          {tech.profiles.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tech.profiles.avatar_url}
              alt={tech.profiles.full_name}
              className="tech-profile-avatar avatar-img"
            />
          ) : (
            <div className="tech-profile-avatar">{getInitials(tech.profiles.full_name)}</div>
          )}
          <div>
            <h1>{tech.profiles.full_name}</h1>
            <div className="tech-card-meta">
              {tech.service_categories.name} · {tech.profiles.city}
              {tech.rating_avg > 0 && ` · ${tech.rating_avg} ★`}
              {` · ${tech.completed_count} servicios completados`}
            </div>
          </div>
        </div>

        {(tech.verified || tech.featured) && (
          <div className="tech-badges" style={{ marginBottom: "20px" }}>
            {tech.verified && <span className="badge-verified">Verificado</span>}
            {tech.featured && <span className="badge-featured">Destacado</span>}
          </div>
        )}

        {tech.bio && <p className="tech-card-bio">{tech.bio}</p>}

        {user && viewerRole === "client" && (
          <RequestServiceForm
            clientId={user.id}
            technicianId={tech.profile_id}
            categoryId={tech.category_id}
          />
        )}
        {!user && (
          <p className="form-footer-link" style={{ marginTop: "32px", textAlign: "left" }}>
            <a href="/login">Inicia sesión</a> como cliente para solicitar este servicio.
          </p>
        )}

        <h3 style={{ marginTop: "40px", marginBottom: "8px" }}>Reseñas</h3>
        {reviews && reviews.length > 0 ? (
          (reviews as Review[]).map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-rating">{"★".repeat(review.rating)}</div>
              {review.comment && <p className="tech-card-bio">{review.comment}</p>}
              <div className="tech-card-meta">{review.profiles.full_name}</div>
            </div>
          ))
        ) : (
          <p className="empty-state">Este técnico todavía no tiene reseñas.</p>
        )}
      </div>
    </section>
  );
}
