import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Sahifa topilmadi" };

// Used whenever a page inside (site) calls notFound() (article/category not
// found, etc.) without its own more specific not-found.tsx. Wraps content in
// SiteChrome explicitly — see the comment in app/not-found.tsx for why.
export default function SiteNotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Sahifa topilmadi</h1>
        <p className="mb-8 text-ink-soft">
          Siz izlagan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
        </p>
        <Link
          href="/"
          className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </SiteChrome>
  );
}
