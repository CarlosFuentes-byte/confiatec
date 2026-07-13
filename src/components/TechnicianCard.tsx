import Link from "next/link";
import { getInitials } from "@/lib/initials";
import type { TechnicianListItem } from "@/lib/supabase/types";

export default function TechnicianCard({ technician }: { technician: TechnicianListItem }) {
  return (
    <Link className="tech-card" href={`/tecnico/${technician.profile_id}`}>
      <div className="tech-card-head">
        <div className="tech-card-avatar">
          {getInitials(technician.profiles.full_name)}
        </div>
        <div>
          <div className="tech-card-name">{technician.profiles.full_name}</div>
          <div className="tech-card-meta">
            {technician.service_categories.name} · {technician.profiles.city}
            {technician.rating_avg > 0 && ` · ${technician.rating_avg} ★`}
            {` · ${technician.completed_count} servicios`}
          </div>
        </div>
      </div>
      {technician.bio && <p className="tech-card-bio">{technician.bio}</p>}
      {(technician.verified || technician.featured) && (
        <div className="tech-badges">
          {technician.verified && <span className="badge-verified">Verificado</span>}
          {technician.featured && <span className="badge-featured">Destacado</span>}
        </div>
      )}
    </Link>
  );
}
