"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";
import AvatarUploader from "@/components/AvatarUploader";
import type { Profile } from "@/lib/supabase/types";

export default function EditClientProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [city, setCity] = useState(profile.city ?? CITIES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, city })
      .eq("id", profile.id);

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Editar mi perfil</h1>
      <p className="form-subtitle">Actualiza tus datos de contacto.</p>

      {error && <div className="form-error">{error}</div>}

      <AvatarUploader userId={profile.id} fullName={profile.full_name} avatarUrl={profile.avatar_url} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            id="fullName"
            className="form-input"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              className="form-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="city">
              Ciudad
            </label>
            <select
              id="city"
              className="form-select"
              value={city}
              onChange={(e) => setCity(e.target.value as (typeof CITIES)[number])}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
