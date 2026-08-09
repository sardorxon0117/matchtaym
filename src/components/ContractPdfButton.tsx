"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import type { ContractDocumentData } from "@/components/ContractDocument";

export default function ContractPdfButton({ contract }: { contract: ContractDocumentData }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleClick() {
    setLoading(true);
    try {
      // Dynamically imported so @react-pdf/renderer never ships in the
      // page's initial bundle — only loaded once someone actually clicks.
      const { buildContractPdfBlob } = await import("@/lib/contract-pdf");
      const blob = await buildContractPdfBlob(contract);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shartnoma-${contract.id.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Shartnoma PDF yaratishda xatolik:", err);
      toast.show("PDF yaratishda xatolik yuz berdi", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary disabled:opacity-60 print:hidden"
    >
      {loading ? "Tayyorlanmoqda…" : "📄 PDF sifatida yuklab olish"}
    </button>
  );
}
