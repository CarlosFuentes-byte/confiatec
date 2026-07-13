import { getInitials } from "@/lib/initials";
import type { TechnicianListItem } from "@/lib/supabase/types";

export default function TopTechniciansRanking({
  technicians,
}: {
  technicians: TechnicianListItem[];
}) {
  if (technicians.length === 0) return null;

  return (
    <div className="pro-visual" style={{ marginBottom: "40px" }}>
      <h3
        style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          marginBottom: "16px",
          fontWeight: 500,
        }}
      >
        Ranking de técnicos mejor calificados
      </h3>
      {technicians.map((t, i) => (
        <div className="rank-row" key={t.profile_id}>
          <span className="rank-pos">{String(i + 1).padStart(2, "0")}</span>
          {t.profiles.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.profiles.avatar_url}
              alt={t.profiles.full_name}
              className="rank-avatar avatar-img"
            />
          ) : (
            <div className="rank-avatar">{getInitials(t.profiles.full_name)}</div>
          )}
          <div className="rank-name">
            {t.profiles.full_name}
            <span>
              {t.service_categories.name} · {t.rating_avg > 0 ? `${t.rating_avg} ★` : "Nuevo"} ·{" "}
              {t.completed_count} servicios
            </span>
          </div>
          {t.featured && <span className="rank-badge">Destacado</span>}
        </div>
      ))}
    </div>
  );
}
