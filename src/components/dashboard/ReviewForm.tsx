"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ReviewForm({
  requestId,
  clientId,
  technicianId,
}: {
  requestId: string;
  clientId: string;
  technicianId: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("reviews").insert({
      service_request_id: requestId,
      client_id: clientId,
      technician_id: technicianId,
      rating,
      comment: comment || null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
      {error && <div className="form-error">{error}</div>}
      <div className="star-select">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star-btn ${n <= rating ? "active" : ""}`}
            onClick={() => setRating(n)}
            aria-label={`${n} estrellas`}
          >
            ★
          </button>
        ))}
      </div>
      <div className="form-group">
        <textarea
          className="form-textarea"
          placeholder="¿Cómo te fue con el servicio? (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Dejar reseña"}
      </button>
    </form>
  );
}
