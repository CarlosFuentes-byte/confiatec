import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión — ConfiaTec",
};

export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="wrap">
        <LoginForm />
      </div>
    </section>
  );
}
