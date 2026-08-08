import type { Metadata } from "next";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin panelga kirish" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-card border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-6 [&_span]:text-cream">
          <Logo />
        </div>
        <h1 className="mb-1 font-heading text-xl font-semibold text-cream">Admin panel</h1>
        <p className="mb-6 text-sm text-cream/60">Kontentni boshqarish uchun tizimga kiring.</p>
        <LoginForm />
      </div>
    </div>
  );
}
