"use client";

import { useState, type FormEvent } from "react";

const SUPPORT_EMAIL = "confiatec0@gmail.com";

export default function SupportContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Soporte ConfiaTec — ${name || "Consulta"}`);
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="form-card" style={{ maxWidth: "100%" }}>
      <h3 className="form-title" style={{ fontSize: "18px" }}>
        Escríbenos
      </h3>
      <p className="form-subtitle" style={{ fontSize: "13px" }}>
        Al enviar, se abrirá tu aplicación de correo con el mensaje ya redactado hacia{" "}
        {SUPPORT_EMAIL}.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="supportName">
            Nombre
          </label>
          <input
            id="supportName"
            className="form-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="supportEmail">
            Correo electrónico
          </label>
          <input
            id="supportEmail"
            className="form-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="supportMessage">
            Mensaje
          </label>
          <textarea
            id="supportMessage"
            className="form-textarea"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
