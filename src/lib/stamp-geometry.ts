// Pure math for laying individual glyphs along a circular arc — used to draw
// the "MATCHTAYM" text curving around the confirmation stamp. Shared between
// the HTML/SVG version (ContractStamp.tsx) and the PDF version
// (contract-pdf.tsx) so both render the exact same geometry; no SVG
// <textPath> involved (react-pdf doesn't support it), just per-character
// x/y + rotation, which both a browser <svg> and @react-pdf/renderer's <Svg>
// understand via the identical `rotate(deg, cx, cy)` transform syntax.

export type StampGlyph = { char: string; x: number; y: number; rotationDeg: number };

/**
 * `position: "top"` reads left-to-right arcing over the top (letters point
 * outward, upright at the apex). `position: "bottom"` reads left-to-right
 * arcing under the bottom (letters point inward, upright at the bottom) —
 * exactly how text sits on a real two-line circular stamp.
 */
export function layoutArcText(
  text: string,
  cx: number,
  cy: number,
  radius: number,
  position: "top" | "bottom",
  spanDeg = 130
): StampGlyph[] {
  const chars = text.split("");
  const n = chars.length;
  const apex = position === "top" ? 270 : 90; // "0=east, clockwise" degrees; 270=north, 90=south
  const start = position === "top" ? apex - spanDeg / 2 : apex + spanDeg / 2;
  const end = position === "top" ? apex + spanDeg / 2 : apex - spanDeg / 2;

  return chars.map((char, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const angleDeg = start + t * (end - start);
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);
    const rotationDeg = position === "top" ? angleDeg + 90 : angleDeg - 90;
    return { char, x, y, rotationDeg };
  });
}

// Shared layout constants for the stamp, plus the flame-mark logo path
// (same artwork as /public/logo-mark.svg, originally in a 1000x1000
// viewBox), scaled/centered to sit inside the inner ring.
export const STAMP = {
  size: 200,
  cx: 100,
  cy: 100,
  outerRadius: 92,
  outerStrokeWidth: 3,
  innerRadius: 74,
  innerStrokeWidth: 1.5,
  textRadius: 83,
  fontSize: 15,
  color: "#1d4ed8",
  topText: "MATCHTAYM",
  bottomText: "MATCHTAYM",
  logoPath:
    "m 523.25973,148.87615 c 139.46189,224.07662 22.20698,299.45951 2.03476,225.85988 C 371.31973,-199.92792 -88.605975,200.35445 15.062445,625.3402 35.069198,707.3573 79.990488,788.93728 147.86645,866.08972 210.38796,937.15588 297.3711,920.05957 334.33781,829.45687 337.30099,821.23069 357.06457,780.87643 326.57383,701.741 275.36577,568.89052 170.67338,565.16047 178.74476,433.92648 c 2.32428,-37.79123 35.55234,-77.84658 65.95979,-87.16484 29.51386,-11.89461 94.92913,17.39753 139.89718,105.73489 65.08787,138.24889 9.71113,157.6974 68.03427,237.6408 16.37001,16.85693 33.38678,23.67622 56.92533,24.07984 23.25952,-0.33174 40.48023,-9.87051 58.03539,-25.55523 101.94816,-91.08589 76.36611,-203.00351 85.30309,-228.78759 35.13651,-72.09923 150.85554,158.43601 -85.83818,342.77366 -42.02627,37.81819 -48.53614,59.3886 -48.55638,97.68207 12.4742,146.53302 138.44109,102.71652 225.92442,49.48963 82.59428,-50.25221 149.06517,-118.45283 195.05825,-202.43379 22.74222,-41.52609 40.81979,-85.02783 49.63219,-138.10581 3.84743,-23.17338 7.90565,-46.58695 9.54949,-69.71922 3.2791,-46.1434 0.4711,-91.58043 -8.14172,-134.65009 C 974.31818,323.85179 940.35019,248.36463 891.47352,185.38363 818.21242,90.981603 712.32992,23.773538 589.54477,0.78026004 l 9.4e-4,-9.9305e-4 C 518.01301,-6.9619571 455.24118,43.013646 523.25973,148.87615 Z",
  // Original path's rough bounding box is ~ [0,1000] x [-7,937] — this
  // scale + translate centers it inside the inner ring at (cx,cy).
  logoTransform: "translate(100,102) scale(0.052) translate(-500,-465)",
} as const;
