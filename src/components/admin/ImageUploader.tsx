"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImageToS3 } from "@/lib/upload-client";
import { useToast } from "@/components/Toast";
import UploadProgress from "./UploadProgress";

export default function ImageUploader({
  name,
  value,
  onChange,
  label = "Rasm",
}: {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const url = await uploadImageToS3(file, setProgress);
      onChange(url);
      toast.show("Rasm yuklandi ✓");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xatolik yuz berdi";
      setError(message);
      toast.show(message, "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="relative mb-2 h-40 w-full max-w-sm overflow-hidden rounded-card border border-ink/10">
          <Image src={value} alt="" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-xs text-white"
          >
            O&apos;chirish
          </button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary disabled:opacity-50"
      >
        {loading ? "Yuklanmoqda…" : value ? "Rasmni almashtirish" : "Rasm yuklash"}
      </button>
      {loading && <UploadProgress percent={progress} />}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
