import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Shartnoma topilmadi" };

// More specific than (site)/not-found.tsx — Next.js picks this one for any
// notFound() called from within /shartnoma/*.
export default function ContractNotFound() {
  return (
    <SiteChrome>
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Shartnoma topilmadi</h1>
        <p className="text-ink-soft">
          Bunday shartnoma mavjud emas — havola noto&apos;g&apos;ri bo&apos;lishi yoki shartnoma o&apos;chirilgan
          bo&apos;lishi mumkin.
        </p>
      </div>
    </SiteChrome>
  );
}
