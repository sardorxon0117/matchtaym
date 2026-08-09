import { layoutArcText, STAMP } from "@/lib/stamp-geometry";

/**
 * The "muhr" — a classic round double-ring ink stamp with the MatchTaym
 * mark centered and "MATCHTAYM" curving along the top and bottom. Rendered
 * only once a contract's payment is confirmed, tilted slightly and
 * semi-transparent to read as a real stamped impression rather than a
 * clean logo.
 */
export default function ContractStamp({ className = "" }: { className?: string }) {
  const topGlyphs = layoutArcText(STAMP.topText, STAMP.cx, STAMP.cy, STAMP.textRadius, "top");
  const bottomGlyphs = layoutArcText(STAMP.bottomText, STAMP.cx, STAMP.cy, STAMP.textRadius, "bottom");

  return (
    <svg
      viewBox={`0 0 ${STAMP.size} ${STAMP.size}`}
      className={className}
      style={{ transform: "rotate(-9deg)", opacity: 0.82 }}
      aria-hidden="true"
    >
      <circle
        cx={STAMP.cx}
        cy={STAMP.cy}
        r={STAMP.outerRadius}
        fill="none"
        stroke={STAMP.color}
        strokeWidth={STAMP.outerStrokeWidth}
      />
      <circle
        cx={STAMP.cx}
        cy={STAMP.cy}
        r={STAMP.innerRadius}
        fill="none"
        stroke={STAMP.color}
        strokeWidth={STAMP.innerStrokeWidth}
      />
      <path d={STAMP.logoPath} transform={STAMP.logoTransform} fill={STAMP.color} />

      {topGlyphs.map((g, i) => (
        <text
          key={`t${i}`}
          x={g.x}
          y={g.y}
          transform={`rotate(${g.rotationDeg}, ${g.x}, ${g.y})`}
          fill={STAMP.color}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: STAMP.fontSize, fontWeight: 700, fontFamily: "var(--font-heading)" }}
        >
          {g.char}
        </text>
      ))}
      {bottomGlyphs.map((g, i) => (
        <text
          key={`b${i}`}
          x={g.x}
          y={g.y}
          transform={`rotate(${g.rotationDeg}, ${g.x}, ${g.y})`}
          fill={STAMP.color}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: STAMP.fontSize, fontWeight: 700, fontFamily: "var(--font-heading)" }}
        >
          {g.char}
        </text>
      ))}

      {/* Small separator dots where the top/bottom text arcs meet, left and right. */}
      <circle cx={STAMP.cx - STAMP.textRadius} cy={STAMP.cy} r={2} fill={STAMP.color} />
      <circle cx={STAMP.cx + STAMP.textRadius} cy={STAMP.cy} r={2} fill={STAMP.color} />
    </svg>
  );
}
