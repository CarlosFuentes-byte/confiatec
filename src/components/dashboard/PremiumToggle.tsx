"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PremiumToggle({
  profileId,
  featured,
}: {
  profileId: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("technician_profiles")
      .update({ featured: !featured })
      .eq("profile_id", profileId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="request-card" style={{ marginBottom: "20px" }}>
      <div className="request-card-head">
        <div>
          <div className="request-card-title">
            {featured ? "Premium activo" : "Todavía no eres Premium"}
          </div>
          <div className="request-card-meta">
            {featured
              ? "Apareces destacado en las búsquedas."
              : "L. 300/mes para aparecer destacado en las búsquedas."}
          </div>
        </div>
        {featured && <span className="badge-featured">Destacado</span>}
      </div>
      <div className="request-actions">
        {featured ? (
          <button className="btn btn-danger btn-sm" disabled={loading} onClick={toggle}>
            Cancelar Premium
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" disabled={loading} onClick={toggle}>
            Hazte Premium — L. 300/mes
          </button>
        )}
      </div>
    </div>
  );
}
