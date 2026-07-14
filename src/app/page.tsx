import HomeLanding from "@/components/HomeLanding";
import { createClient } from "@/lib/supabase/server";
import type { ServiceCategory, TechnicianListItem } from "@/lib/supabase/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon_slug")
    .order("id");

  const { data: technicians } = await supabase
    .from("technician_profiles")
    .select("*, profiles!inner(full_name, city, avatar_url), service_categories(name, icon_slug)")
    .order("featured", { ascending: false })
    .order("rating_avg", { ascending: false })
    .order("completed_count", { ascending: false })
    .limit(3);

  return (
    <HomeLanding
      categories={(categories as ServiceCategory[]) ?? []}
      technicians={(technicians as TechnicianListItem[]) ?? []}
    />
  );
}
