"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RequestServiceForm({
  clientId,
  technicianId,
  categoryId,
}: {
  clientId: string;
  technicianId: string;
  categoryId: number;
}) {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("service_requests").insert({
      client_id: clientId,
      technician_id: technicianId,
      category_id: categoryId,
      address_text: address,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDone(true);
    router.refresh();
  };

  if (done) {
    return (
      <div className="form-notice" style={{ marginTop: "32px" }}>
        Solicitud enviada. Sigue su estado en{" "}
        <a href="/dashboard" style={{ color: "var(--green)", fontWeight: 600 }}>
          tu panel
        </a>
        .
      </div>
    );
  }

  return (
    <div className="form-card" style={{ margin: "32px 0 0", maxWidth: "100%", padding: "24px" }}>
      <h3 className="form-title" style={{ fontSize: "18px" }}>
        Solicitar este servicio
      </h3>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Tu colonia o dirección
          </label>
          <input
            id="address"
            className="form-input"
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </div>
  );
}
