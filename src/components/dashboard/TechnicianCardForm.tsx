"use client";

import { useState, type FormEvent } from "react";
import { formatCardNumber, formatExpiry, isCardComplete } from "@/lib/cardInput";

export default function TechnicianCardForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [savedLast4, setSavedLast4] = useState<string | null>(null);

  const cardValid = isCardComplete({ number: cardNumber, name: cardName, expiry, cvc });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!cardValid) return;
    setSavedLast4(cardNumber.replace(/\s/g, "").slice(-4));
  };

  if (savedLast4) {
    return (
      <div className="form-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
        <h3 className="form-title" style={{ fontSize: "16px" }}>
          Tarjeta para tus cobros
        </h3>
        <div className="form-notice" style={{ marginBottom: 0 }}>
          ✓ Tarjeta terminada en {savedLast4} guardada (simulada) para recibir tus pagos.
        </div>
        <button
          type="button"
          className="panel-action-link"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          onClick={() => setSavedLast4(null)}
        >
          Cambiar tarjeta
        </button>
      </div>
    );
  }

  return (
    <div className="form-card" style={{ maxWidth: "100%", marginBottom: "32px" }}>
      <h3 className="form-title" style={{ fontSize: "16px" }}>
        Tarjeta para tus cobros
      </h3>
      <p className="form-subtitle" style={{ fontSize: "13px" }}>
        Registro simulado — todavía no hay depósito real conectado.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="techCardNumber">
            Número de tarjeta
          </label>
          <input
            id="techCardNumber"
            className="form-input"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="techCardName">
            Nombre en la tarjeta
          </label>
          <input
            id="techCardName"
            className="form-input"
            type="text"
            placeholder="Como aparece en la tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="techCardExpiry">
              Vencimiento
            </label>
            <input
              id="techCardExpiry"
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="techCardCvc">
              CVC
            </label>
            <input
              id="techCardCvc"
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

        <button className="btn btn-primary btn-block" type="submit" disabled={!cardValid}>
          Guardar tarjeta
        </button>
      </form>
    </div>
  );
}
