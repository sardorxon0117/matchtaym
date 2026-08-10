/** A deflated, torn football — used on "not found" states across the site. */
export default function BurstBallIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      {/* deflated (squashed) ball body */}
      <ellipse cx="60" cy="72" rx="44" ry="28" fill="#ffffff" stroke="#1a1a1a" strokeWidth="3" />

      {/* classic football pentagon patches */}
      <polygon points="60,56 72,63 68,76 52,76 48,63" fill="#1a1a1a" />
      <polygon points="22,68 33,61 34,75" fill="#1a1a1a" opacity="0.85" />
      <polygon points="98,68 87,61 86,75" fill="#1a1a1a" opacity="0.85" />

      {/* the tear */}
      <path
        d="M38 52 L51 68 L43 74 L60 94"
        fill="none"
        stroke="#ff6b00"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* air whooshing out */}
      <path d="M66 44 Q79 38 90 42" fill="none" stroke="#c9beae" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M70 34 Q81 27 92 30" fill="none" stroke="#c9beae" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
