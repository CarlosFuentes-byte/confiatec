import Link from "next/link";
import TechnicianCard from "@/components/TechnicianCard";
import TechAvatar from "@/components/TechAvatar";
import type { TechnicianListItem } from "@/lib/supabase/types";

export default function ClientDiscoverySection({
  nearby,
  ranking,
}: {
  nearby: TechnicianListItem[];
  ranking: TechnicianListItem[];
}) {
  return (
    <>
      <div className="dp-headrow" style={{ marginTop: "48px" }}>
        <div>
          <span className="eyebrow">Cerca de ti</span>
          <h2>Técnicos disponibles en tu zona</h2>
        </div>
        <Link className="panel-action-link" href="/buscar">
          Ver todos →
        </Link>
      </div>
      {nearby.length > 0 ? (
        <div className="tech-grid" style={{ marginBottom: "16px" }}>
          {nearby.map((t) => (
            <TechnicianCard key={t.profile_id} technician={t} />
          ))}
        </div>
      ) : (
        <p className="empty-state-small">Todavía no hay técnicos verificados en tu zona.</p>
      )}

      <div className="dp-headrow" style={{ marginTop: "40px" }}>
        <div>
          <span className="eyebrow">Lo mejor de ConfiaTec</span>
          <h2>Ranking de los mejores técnicos</h2>
        </div>
      </div>
      {ranking.length > 0 ? (
        <div className="b-rankcard" style={{ maxWidth: "560px" }}>
          {ranking.map((t, i) => (
            <div className="rank-row" key={t.profile_id}>
              <span className="rank-pos">{String(i + 1).padStart(2, "0")}</span>
              <TechAvatar tech={t} className="rank-avatar" />
              <div className="rank-name">
                {t.profiles.full_name}
                <span>
                  {t.service_categories.name} ·{" "}
                  {t.rating_avg > 0 ? `${t.rating_avg}★` : "Nuevo"}
                </span>
              </div>
              {t.featured && <span className="rank-badge">Destacado</span>}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state-small">Todavía no hay técnicos verificados.</p>
      )}
    </>
  );
}
