"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OTHER_CATEGORY_VALUE, resolveCategoryId } from "@/lib/resolveCategory";
import type { ServiceCategory } from "@/lib/supabase/types";

export default function CompleteTechnicianProfileForm({
  profileId,
  categories,
}: {
  profileId: string;
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<number | typeof OTHER_CATEGORY_VALUE>(
    categories[0]?.id ?? OTHER_CATEGORY_VALUE
  );
  const [customCategory, setCustomCategory] = useState("");
  const [bio, setBio] = useState("");
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

    const { error: profileError } = await supabase.from("technician_profiles").insert({
      profile_id: profileId,
      category_id: resolvedCategoryId,
      bio,
    });

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    router.push(`/tecnico/${profileId}`);
    router.refresh();
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Completa tu perfil de técnico</h1>
      <p className="form-subtitle">
        Ya confirmaste tu cuenta. Cuéntanos tu oficio y experiencia para aparecer en las
        búsquedas de ConfiaTec.
      </p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
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
          {loading ? "Guardando..." : "Completar perfil"}
        </button>
      </form>
    </div>
  );
}
