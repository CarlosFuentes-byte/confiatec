"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OTHER_CATEGORY_VALUE, resolveCategoryId } from "@/lib/resolveCategory";
import { fileExtension, getPublicFileUrl, uploadFile } from "@/lib/uploadFile";
import LocationCaptureButton from "@/components/LocationCaptureButton";
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
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [policeFile, setPoliceFile] = useState<File | null>(null);
  const [criminalFile, setCriminalFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (selfieFile) {
      try {
        const path = `${profileId}/avatar.${fileExtension(selfieFile)}`;
        await uploadFile(supabase, "avatars", path, selfieFile);
        const avatarUrl = getPublicFileUrl(supabase, "avatars", path);
        await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", profileId);
      } catch (avatarError) {
        setLoading(false);
        setError(
          avatarError instanceof Error
            ? avatarError.message
            : "No se pudo subir tu foto de perfil."
        );
        return;
      }
    }

    let policeRecordPath: string | null = null;
    let criminalRecordPath: string | null = null;
    try {
      if (policeFile) {
        policeRecordPath = `${profileId}/policial.${fileExtension(policeFile)}`;
        await uploadFile(supabase, "verification-docs", policeRecordPath, policeFile);
      }
      if (criminalFile) {
        criminalRecordPath = `${profileId}/penales.${fileExtension(criminalFile)}`;
        await uploadFile(supabase, "verification-docs", criminalRecordPath, criminalFile);
      }
    } catch (docError) {
      setLoading(false);
      setError(
        docError instanceof Error
          ? docError.message
          : "No se pudieron subir tus documentos de verificación."
      );
      return;
    }

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
      lat,
      lng,
      police_record_url: policeRecordPath,
      criminal_record_url: criminalRecordPath,
      verification_submitted_at: new Date().toISOString(),
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

        <div style={{ margin: "24px 0 16px" }}>
          <span className="eyebrow">Verificación de identidad</span>
          <p style={{ marginTop: "8px", fontSize: "13.5px", color: "var(--text-muted)" }}>
            Revisamos estos documentos manualmente antes de activar tu insignia
            &ldquo;Verificado&rdquo; — le da más confianza a los clientes.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="selfie">
            Foto de perfil (selfie)
          </label>
          <input
            id="selfie"
            className="form-input"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="policeRecord">
            Hoja de Antecedentes Policiales
          </label>
          <input
            id="policeRecord"
            className="form-input"
            type="file"
            accept="image/*,application/pdf"
            required
            onChange={(e) => setPoliceFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="criminalRecord">
            Certificado de Antecedentes Penales
          </label>
          <input
            id="criminalRecord"
            className="form-input"
            type="file"
            accept="image/*,application/pdf"
            required
            onChange={(e) => setCriminalFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <LocationCaptureButton onCapture={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Completar perfil"}
        </button>
      </form>
    </div>
  );
}
