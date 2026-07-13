import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TechnicianSignupForm from "@/components/auth/TechnicianSignupForm";
import CompleteTechnicianProfileForm from "@/components/auth/CompleteTechnicianProfileForm";
import type { ServiceCategory } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Únete como técnico — ConfiaTec",
};

export default async function TecnicosUnirsePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon_slug")
    .order("name");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="auth-page">
        <div className="wrap">
          <TechnicianSignupForm categories={(categories as ServiceCategory[]) ?? []} />
        </div>
      </section>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "technician") {
    return (
      <section className="auth-page">
        <div className="wrap">
          <div className="form-card">
            <h1 className="form-title">Esta cuenta ya está registrada</h1>
            <p className="form-subtitle">
              Tu cuenta está registrada como cliente. Para ofrecer tus servicios como
              técnico necesitas crear una cuenta nueva con otro correo.
            </p>
            <a className="btn btn-primary btn-block" href="/tecnicos/unirse?nuevo=1">
              Crear cuenta de técnico
            </a>
          </div>
        </div>
      </section>
    );
  }

  const { data: technicianProfile } = await supabase
    .from("technician_profiles")
    .select("profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (technicianProfile) {
    return (
      <section className="auth-page">
        <div className="wrap">
          <div className="form-card">
            <h1 className="form-title">Ya eres técnico fundador</h1>
            <p className="form-subtitle">Tu perfil ya está activo en ConfiaTec.</p>
            <a className="btn btn-primary btn-block" href={`/tecnico/${user.id}`}>
              Ver mi perfil
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="wrap">
        <CompleteTechnicianProfileForm
          profileId={user.id}
          categories={(categories as ServiceCategory[]) ?? []}
        />
      </div>
    </section>
  );
}
