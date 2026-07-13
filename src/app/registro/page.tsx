import type { Metadata } from "next";
import ClientSignupForm from "@/components/auth/ClientSignupForm";

export const metadata: Metadata = {
  title: "Crear cuenta — ConfiaTec",
};

export default function RegistroPage() {
  return (
    <section className="auth-page">
      <div className="wrap">
        <ClientSignupForm />
      </div>
    </section>
  );
}
