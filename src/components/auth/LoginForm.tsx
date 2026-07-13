"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "technician") {
      const { data: technicianProfile } = await supabase
        .from("technician_profiles")
        .select("profile_id")
        .eq("profile_id", data.user.id)
        .maybeSingle();

      router.push(
        technicianProfile ? `/tecnico/${data.user.id}` : "/tecnicos/unirse"
      );
    } else {
      router.push("/");
    }

    router.refresh();
  };

  return (
    <div className="form-card">
      <h1 className="form-title">Iniciar sesión</h1>
      <p className="form-subtitle">Accede a tu cuenta de ConfiaTec.</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="form-footer-link">
        ¿No tienes cuenta? <a href="/registro">Regístrate</a> ·{" "}
        <a href="/tecnicos/unirse">Únete como técnico</a>
      </p>
    </div>
  );
}
