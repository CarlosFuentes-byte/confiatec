import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/cities";
import TechnicianCard from "@/components/TechnicianCard";
import type { ServiceCategory, TechnicianListItem } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Buscar técnico verificado — ConfiaTec",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string }>;
}) {
  const { category, city } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon_slug")
    .order("name");

  let query = supabase
    .from("technician_profiles")
    .select(
      "*, profiles!inner(full_name, city), service_categories(name, icon_slug)"
    )
    .order("featured", { ascending: false })
    .order("rating_avg", { ascending: false })
    .order("completed_count", { ascending: false });

  if (category) query = query.eq("category_id", category);
  if (city) query = query.eq("profiles.city", city);

  const { data: technicians } = await query;

  return (
    <section className="auth-page">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Buscar técnico</span>
          <h2>Encuentra tu técnico verificado</h2>
        </div>

        <form className="search-filters" method="get">
          <select name="category" className="form-select" defaultValue={category ?? ""}>
            <option value="">Todos los oficios</option>
            {((categories as ServiceCategory[]) ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="city" className="form-select" defaultValue={city ?? ""}>
            <option value="">Todas las ciudades</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">
            Filtrar
          </button>
        </form>

        {technicians && technicians.length > 0 ? (
          <div className="tech-grid">
            {(technicians as TechnicianListItem[]).map((t) => (
              <TechnicianCard key={t.profile_id} technician={t} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            Todavía no hay técnicos que coincidan con esta búsqueda.
          </p>
        )}
      </div>
    </section>
  );
}
