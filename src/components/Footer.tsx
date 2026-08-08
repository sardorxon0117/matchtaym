import Link from "next/link";
import Logo from "./Logo";
import { CATEGORY_SEED } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="[&_a]:text-cream [&_span]:text-cream">
            <Logo />
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/70">
            Futbol bo&apos;yicha so&apos;nggi yangiliklar, transferlar va
            tahliliy maqolalar bir joyda.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream/50">
            Bo&apos;limlar
          </h3>
          <ul className="space-y-2 text-sm">
            {CATEGORY_SEED.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategoriya/${c.slug}`} className="text-cream/80 hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream/50">
            Ijtimoiy tarmoqlar
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://t.me/matchtaym"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/80 hover:text-accent"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/matchtaym"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/80 hover:text-accent"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/50 sm:px-6">
        &copy; {year} MatchTaym. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
}
