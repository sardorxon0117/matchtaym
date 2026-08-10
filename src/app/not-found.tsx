import Link from "next/link";
import Logo from "@/components/Logo";

// Root-level not-found — catches both genuinely unmatched URLs and any
// explicit notFound() call from a page (article/category/etc.) that
// doesn't define its own not-found boundary. Standalone (no Header/Footer)
// since a truly unmatched route doesn't belong to any route group's layout.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="mb-6 animate-bounce text-8xl" aria-hidden="true">
        ⚽
      </div>
      <p className="mb-1 font-heading text-lg font-semibold text-primary">404</p>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">Sahifa topilmadi</h1>
      <p className="mb-8 max-w-sm text-ink-soft">
        Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
      </p>
      <Link
        href="/"
        className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
