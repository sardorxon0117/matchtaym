"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitPayment } from "@/actions/ad-contract";
import { uploadReceiptToS3 } from "@/lib/receipt-upload-client";
import { useToast } from "@/components/Toast";
import UploadProgress from "@/components/admin/UploadProgress";

export default function ContractPaymentForm({ token }: { token: string }) {
  const action = submitPayment.bind(null, token);
  const [error, formAction, pending] = useActionState(action, undefined);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) {
        toast.show(error, "error");
      } else {
        toast.show("Chek yuborildi ✓");
        router.refresh();
      }
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadReceiptToS3(file, token, setProgress);
      setReceiptUrl(url);
      toast.show("Chek yuklandi ✓");
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <form action={formAction} className="space-y-4 rounded-card border border-ink/10 bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-ink">To&apos;lov chekini yuklang</h2>
      <input type="hidden" name="receiptUrl" value={receiptUrl} />

      {receiptUrl ? (
        <p className="text-sm font-medium text-green-700">✓ Fayl yuklandi</p>
      ) : (
        <input
          type="file"
          accept="image/*,application/pdf"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="block text-sm text-ink-soft"
        />
      )}
      {uploading && <UploadProgress percent={progress} />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending || !receiptUrl}
        className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda…" : "To'lov qildim"}
      </button>
    </form>
  );
}
