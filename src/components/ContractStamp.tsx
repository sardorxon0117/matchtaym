/**
 * The confirmation "muhr" — a round glowing mark, tilted and semi-transparent
 * like a real stamped ink impression. Rendered only once a contract's
 * payment is confirmed, overlaid on the IJROCHI signature area.
 */
export default function ContractStamp({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny decorative mark, not worth an image-optimization proxy
    <img
      src="/stamp-mark.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{ transform: "rotate(-9deg)", opacity: 0.6 }}
    />
  );
}
