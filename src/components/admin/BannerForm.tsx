"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { updateBanner } from "@/actions/banner";

export default function BannerForm({
  initialImageUrl,
  initialLinkUrl,
}: {
  initialImageUrl: string;
  initialLinkUrl: string;
}) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  return (
    <form action={updateBanner} className="max-w-md space-y-5">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <ImageUploader name="imageUrl" value={imageUrl} onChange={setImageUrl} label="Banner rasmi" />
        <p className="mt-2 text-xs text-ink-soft/70">
          Rasm avtomatik ravishda banner o&apos;lchamiga moslashadi (cover). Tavsiya: kvadratga yaqin yoki vertikal
          rasm ishlating.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Havola (bosilganda ochiladigan link)</span>
        <input
          type="url"
          name="linkUrl"
          required
          defaultValue={initialLinkUrl}
          placeholder="https://..."
          className="input"
        />
      </label>

      <button type="submit" className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
        Saqlash
      </button>
    </form>
  );
}
