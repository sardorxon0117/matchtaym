import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-heading font-bold ${className}`}
      aria-label="MatchTaym — bosh sahifa"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white text-lg shadow-sm">
        M
      </span>
      <span className="text-xl tracking-tight text-ink">
        Match<span className="text-primary">Taym</span>
      </span>
    </Link>
  );
}
