"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { updateBanner } from "@/actions/banner";

export default function BannerForm({
  initialMobileImageUrl,
  initialDesktopImageUrl,
  initialLinkUrl,
}: {
  initialMobileImageUrl: string;
  initialDesktopImageUrl: string;
  initialLinkUrl: string;
}) {
  const [mobileImageUrl, setMobileImageUrl] = useState(initialMobileImageUrl);
  const [desktopImageUrl, setDesktopImageUrl] = useState(initialDesktopImageUrl);

  return (
    <form action={updateBanner} className="max-w-md space-y-5">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <ImageUploader name="mobileImageUrl" value={mobileImageUrl} onChange={setMobileImageUrl} label="Mobil banner (ingichka, keng chiziq)" />
        <p className="mt-2 text-xs text-ink-soft/70">
          Tavsiya: keng va past rasm (masalan 1200×300). Telefonlarda header ostida ko&apos;rinadi.
        </p>
      </div>

      <div className="rounded-card border border-ink/10 bg-white p-5">
        <ImageUploader name="desktopImageUrl" value={desktopImageUrl} onChange={setDesktopImageUrl} label="Kompyuter/planshet banner (tik panel)" />
        <p className="mt-2 text-xs text-ink-soft/70">
          Tavsiya: tik (vertikal) rasm (masalan 600×1200). Kompyuter va planshetlarda o&apos;ng tomonda ko&apos;rinadi.
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
