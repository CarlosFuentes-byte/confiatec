import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditTechnicianProfileForm from "@/components/auth/EditTechnicianProfileForm";
import EditClientProfileForm from "@/components/auth/EditClientProfileForm";
import type { Profile, ServiceCategory, TechnicianProfile } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Editar mi perfil — ConfiaTec",
};

export default async function EditProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  if (profile.role === "client") {
    return <EditClientProfileForm profile={profile as Profile} />;
  }

  const { data: technicianProfile } = await supabase
    .from("technician_profiles")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!technicianProfile) redirect("/tecnicos/unirse");

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon_slug")
    .order("name");

  return (
    <EditTechnicianProfileForm
      profile={profile as Profile}
      technicianProfile={technicianProfile as TechnicianProfile}
      categories={(categories as ServiceCategory[]) ?? []}
    />
  );
}
