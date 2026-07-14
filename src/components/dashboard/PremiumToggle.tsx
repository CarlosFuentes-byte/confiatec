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
  const [error, setError] = useState<string | null>(null);

  const activate = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("activate_premium");
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    router.refresh();
  };

  const cancel = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    await supabase.from("technician_profiles").update({ featured: false }).eq("profile_id", profileId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="dp-premium">
      <div>
        <div className="dp-premium-title">
          {featured ? "Premium activo" : "Todavía no eres Premium"}
        </div>
        <div className="dp-premium-sub">
          {featured
            ? "Apareces destacado en las búsquedas."
            : "L. 300/mes para aparecer destacado en las búsquedas."}
        </div>
        {error && (
          <div className="form-error" style={{ marginTop: "12px" }}>
            {error} — <a href="/dashboard/wallet">recarga tu wallet</a>.
          </div>
        )}
      </div>
      {featured && <span className="badge-featured">Destacado</span>}
      {featured ? (
        <button className="btn btn-danger btn-sm" disabled={loading} onClick={cancel}>
          Cancelar Premium
        </button>
      ) : (
        <button className="btn btn-primary btn-sm" disabled={loading} onClick={activate}>
          Hazte Premium
        </button>
      )}
    </div>
  );
}
