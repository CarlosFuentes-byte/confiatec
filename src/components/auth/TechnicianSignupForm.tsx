"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";
import { OTHER_CATEGORY_VALUE, resolveCategoryId } from "@/lib/resolveCategory";
import { fileExtension, getPublicFileUrl, uploadFile } from "@/lib/uploadFile";
import type { ServiceCategory } from "@/lib/supabase/types";

export default function TechnicianSignupForm({
  categories,
}: {
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [categoryId, setCategoryId] = useState<number | typeof OTHER_CATEGORY_VALUE>(
    categories[0]?.id ?? OTHER_CATEGORY_VALUE
  );
  const [customCategory, setCustomCategory] = useState("");
  const [bio, setBio] = useState("");
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [policeFile, setPoliceFile] = useState<File | null>(null);
  const [criminalFile, setCriminalFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "technician", full_name: fullName, phone, city },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (!data.session || !data.user) {
      setLoading(false);
      setNotice(
        "Revisa tu correo para confirmar tu cuenta. Luego inicia sesión aquí mismo para terminar de configurar tu perfil de técnico."
      );
      return;
    }

    if (selfieFile) {
      try {
        const path = `${data.user.id}/avatar.${fileExtension(selfieFile)}`;
        await uploadFile(supabase, "avatars", path, selfieFile);
        const avatarUrl = getPublicFileUrl(supabase, "avatars", path);
        await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", data.user.id);
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
        policeRecordPath = `${data.user.id}/policial.${fileExtension(policeFile)}`;
        await uploadFile(supabase, "verification-docs", policeRecordPath, policeFile);
      }
      if (criminalFile) {
        criminalRecordPath = `${data.user.id}/penales.${fileExtension(criminalFile)}`;
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
      profile_id: data.user.id,
      category_id: resolvedCategoryId,
      bio,
      police_record_url: policeRecordPath,
      criminal_record_url: criminalRecordPath,
      verification_submitted_at: new Date().toISOString(),
    });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    await supabase
      .from("profiles")
      .update({ accepted_terms_at: new Date().toISOString() })
      .eq("id", data.user.id);

    setLoading(false);
    router.push(`/tecnico/${data.user.id}`);
    router.refresh();
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Únete como técnico fundador</h1>
      <p className="form-subtitle">
        Onboarding gratuito para los primeros 50 técnicos fundadores.
      </p>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-notice">{notice}</div>}

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

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className="form-checkbox-row">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <span>
            He leído y acepto los{" "}
            <a href="/terminos" target="_blank" rel="noopener noreferrer">
              Términos y Condiciones
            </a>{" "}
            de ConfiaTec, incluyendo la comisión por servicio.
          </span>
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Únete como técnico fundador"}
        </button>
      </form>

      <p className="form-footer-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
}
