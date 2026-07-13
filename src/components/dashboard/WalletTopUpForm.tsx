"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const QUICK_AMOUNTS = [500, 1000, 2000];

export default function WalletTopUpForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topUp = async (value: number) => {
    if (value <= 0) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("wallet_topup", { p_amount: value });
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setAmount("");
    router.refresh();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    topUp(Number(amount));
  };

  return (
    <div className="form-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
      <h3 className="form-title" style={{ fontSize: "16px" }}>
        Agregar fondos
      </h3>
      <p className="form-subtitle" style={{ fontSize: "13px" }}>
        Recarga simulada — todavía no hay cobro real conectado.
      </p>

      {error && <div className="form-error">{error}</div>}

      <div className="wallet-quick-amounts">
        {QUICK_AMOUNTS.map((value) => (
          <button key={value} type="button" disabled={loading} onClick={() => topUp(value)}>
            + L. {value}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          className="form-input"
          type="number"
          min="1"
          step="1"
          placeholder="Otro monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" type="submit" disabled={loading}>
          Agregar
        </button>
      </form>
    </div>
  );
}
