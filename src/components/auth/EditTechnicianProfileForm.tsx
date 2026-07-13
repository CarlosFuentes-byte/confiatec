"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";
import { OTHER_CATEGORY_VALUE, resolveCategoryId } from "@/lib/resolveCategory";
import AvatarUploader from "@/components/AvatarUploader";
import type { Profile, ServiceCategory, TechnicianProfile } from "@/lib/supabase/types";

export default function EditTechnicianProfileForm({
  profile,
  technicianProfile,
  categories,
}: {
  profile: Profile;
  technicianProfile: TechnicianProfile;
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [city, setCity] = useState(profile.city ?? CITIES[0]);
  const [categoryId, setCategoryId] = useState<number | typeof OTHER_CATEGORY_VALUE>(
    technicianProfile.category_id
  );
  const [customCategory, setCustomCategory] = useState("");
  const [bio, setBio] = useState(technicianProfile.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    let resolvedCategoryId: number;
    try {
      resolvedCategoryId = await resolveCategoryId(supabase, categoryId, customCategory);
    } catch (categoryError) {
      setLoading(false);
      setError(
        categoryError instanceof Error
          ? categoryError.message
          : "No se pudo guardar el oficio nuevo."
      );
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, city })
      .eq("id", profile.id);

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    const { error: technicianError } = await supabase
      .from("technician_profiles")
      .update({ category_id: resolvedCategoryId, bio })
      .eq("profile_id", profile.id);

    setLoading(false);

    if (technicianError) {
      setError(technicianError.message);
      return;
    }

    router.push(`/tecnico/${profile.id}`);
    router.refresh();
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Editar mi perfil</h1>
      <p className="form-subtitle">Actualiza tus datos y cómo apareces en las búsquedas.</p>

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

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Oficio
          </label>
          <select
            id="category"
            className="form-select"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value === OTHER_CATEGORY_VALUE
                  ? OTHER_CATEGORY_VALUE
                  : Number(e.target.value)
              )
            }
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value={OTHER_CATEGORY_VALUE}>Otro (especifica)</option>
          </select>
        </div>

        {categoryId === OTHER_CATEGORY_VALUE && (
          <div className="form-group">
            <label className="form-label" htmlFor="customCategory">
              ¿Cuál es tu oficio?
            </label>
            <input
              id="customCategory"
              className="form-input"
              type="text"
              required
              placeholder="Ej. Aire acondicionado"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="bio">
            Cuéntanos sobre tu experiencia
          </label>
          <textarea
            id="bio"
            className="form-textarea"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
