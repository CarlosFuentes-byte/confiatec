import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mis reseñas — ConfiaTec",
};

type MyReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  technician: { full_name: string };
};

export default async function MyReviewsPage() {
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

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, technician:profiles!reviews_technician_id_fkey(full_name)")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div style={{ maxWidth: "640px" }}>
      <div className="sec-head" style={{ marginBottom: "24px" }}>
        <span className="eyebrow">Mis reseñas</span>
        <h2>Técnicos que has calificado</h2>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="form-card" style={{ maxWidth: "100%" }}>
          {(reviews as MyReview[]).map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-rating">{"★".repeat(review.rating)}</div>
              {review.comment && <p className="tech-card-bio">{review.comment}</p>}
              <div className="tech-card-meta">
                {review.technician.full_name} ·{" "}
                {new Date(review.created_at).toLocaleDateString("es-HN")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state-small">
          Todavía no has dejado ninguna reseña. Se te pedirá una cada vez que completes y
          pagues un servicio.
        </p>
      )}
    </div>
  );
}
