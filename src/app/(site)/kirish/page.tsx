import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import ReaderLoginForm from "@/components/ReaderLoginForm";
import GoogleButton from "@/components/GoogleButton";

export const metadata: Metadata = { title: "Kirish" };

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Bu email allaqachon boshqa usulda ro'yxatdan o'tgan. Email+parol bilan kiring.",
  AccessDenied: "Kirish rad etildi.",
  Configuration: "Server sozlamasida xatolik. Birozdan so'ng qayta urinib ko'ring.",
  OAuthSignin: "Google bilan bog'lanishda xatolik yuz berdi. Qayta urinib ko'ring.",
  OAuthCallback: "Google bilan bog'lanishda xatolik yuz berdi. Qayta urinib ko'ring.",
};

export default async function KirishPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const googleEnabled = !!process.env.GOOGLE_CLIENT_ID;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Kirishda xatolik yuz berdi. Qayta urinib ko'ring.") : null;

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-16 sm:px-6">
      <div className="mb-6">
        <Logo />
      </div>
      <h1 className="mb-1 font-heading text-xl font-semibold text-ink">Tizimga kirish</h1>
      <p className="mb-6 text-sm text-ink-soft">Izoh qoldirish uchun hisobingizga kiring.</p>

      {errorMessage && (
        <p className="mb-5 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {googleEnabled && (
        <div className="mb-5 space-y-3">
          <GoogleButton />
          <div className="flex items-center gap-3 text-xs text-ink-soft/60">
            <div className="h-px flex-1 bg-ink/10" />
            yoki
            <div className="h-px flex-1 bg-ink/10" />
          </div>
        </div>
      )}

      <ReaderLoginForm callbackUrl={callbackUrl} />

      <p className="mt-6 text-center text-xs text-ink-soft/60">
        <Link href="/" className="hover:text-primary">
          ← Bosh sahifaga qaytish
        </Link>
      </p>
    </div>
  );
}
