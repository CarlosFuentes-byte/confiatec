"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/cities";

export default function ClientSignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITIES[0]);
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
        data: { role: "client", full_name: fullName, phone, city },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.session && data.user) {
      await supabase
        .from("profiles")
        .update({ accepted_terms_at: new Date().toISOString() })
        .eq("id", data.user.id);
      setLoading(false);
      router.push("/");
      router.refresh();
    } else {
      setLoading(false);
      setNotice("Revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
    }
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Crear cuenta</h1>
      <p className="form-subtitle">
        Regístrate para buscar y contactar técnicos verificados.
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
            de ConfiaTec.
          </span>
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="form-footer-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
}
