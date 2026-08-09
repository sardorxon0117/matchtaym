"use client";

// Browsers already offer a free, reliable "Save as PDF" via their print
// dialog — no server-side PDF library needed. The (site) and admin layouts
// hide their chrome (`print:hidden`) and ContractDocument prints borderless,
// so what comes out is just the contract itself.
export default function PrintContractButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary print:hidden"
    >
      📄 PDF sifatida yuklab olish
    </button>
  );
}
