"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatCardNumber, formatExpiry, isCardComplete } from "@/lib/cardInput";

const QUICK_AMOUNTS = [500, 1000, 2000];

export default function WalletTopUpForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    if (!isCardComplete({ number: cardNumber, name: cardName, expiry, cvc })) {
      setError("Revisa los datos de la tarjeta.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("wallet_topup", { p_amount: value });
    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    setAmount("");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvc("");
    router.refresh();
  };

  return (
    <div className="form-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
      <h3 className="form-title" style={{ fontSize: "16px" }}>
        Agregar fondos
      </h3>
      <p className="form-subtitle" style={{ fontSize: "13px" }}>
        Recarga simulada con tarjeta — todavía no hay cobro real conectado.
      </p>

      {error && <div className="form-error">{error}</div>}

      <div className="wallet-quick-amounts">
        {QUICK_AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            disabled={loading}
            className={amount === String(value) ? "active" : ""}
            onClick={() => setAmount(String(value))}
          >
            L. {value}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="topupAmount">
            Monto a cargar (L.)
          </label>
          <input
            id="topupAmount"
            className="form-input"
            type="number"
            min="1"
            step="1"
            placeholder="Otro monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cardNumber">
            Número de tarjeta
          </label>
          <input
            id="cardNumber"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cardName">
            Nombre en la tarjeta
          </label>
          <input
            id="cardName"
            className="form-input"
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="cardExpiry">
              Vencimiento
            </label>
            <input
              id="cardExpiry"
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cardCvc">
              CVC
            </label>
            <input
              id="cardCvc"
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="123"
              maxLength={4}
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Cargar tarjeta"}
        </button>
      </form>
    </div>
  );
}
