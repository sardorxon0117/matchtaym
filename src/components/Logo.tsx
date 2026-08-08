import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-heading font-bold ${className}`}
      aria-label="MatchTaym — bosh sahifa"
    >
      <Image src="/logo-mark.svg" alt="" width={36} height={36} className="h-9 w-9" priority />
      <span className="text-xl tracking-tight text-ink">
        Match<span className="text-primary">Taym</span>
      </span>
    </Link>
  );
}
