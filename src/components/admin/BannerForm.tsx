"use client";

import { useState } from "react";
import MediaUploader from "./MediaUploader";
import { dateToTashkentInputValue } from "@/lib/utils";

export default function BannerForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: {
    mobileImageUrl?: string;
    desktopImageUrl?: string;
    linkUrl?: string;
    startAt?: Date | string;
    endAt?: Date | string;
    isFallback?: boolean;
  };
}) {
  const [mobileImageUrl, setMobileImageUrl] = useState(initial?.mobileImageUrl ?? "");
  const [desktopImageUrl, setDesktopImageUrl] = useState(initial?.desktopImageUrl ?? "");

  return (
    <form action={action} className="max-w-md space-y-5">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <MediaUploader name="mobileImageUrl" value={mobileImageUrl} onChange={setMobileImageUrl} label="Mobil banner — rasm yoki video" />
        <p className="mt-2 text-xs text-ink-soft/70">
          Joy nisbati doim 5:1 (keng, past chiziq) — rasm/video shu ichiga <b>butunligicha</b> sig&apos;adi
          (kesilmaydi). Telefonlarda header ostida ko&apos;rinadi. Video bo&apos;lsa avtomatik, tugmasiz,
          tinch (ovozsiz) va uzluksiz aylanib turadi.
        </p>
      </div>

      <div className="rounded-card border border-ink/10 bg-white p-5">
        <MediaUploader name="desktopImageUrl" value={desktopImageUrl} onChange={setDesktopImageUrl} label="Kompyuter/planshet banner — rasm yoki video" />
        <p className="mt-2 text-xs text-ink-soft/70">
          Joy nisbati doim 3:2 — rasm/video shu ichiga <b>butunligicha</b> sig&apos;adi (kesilmaydi). Kompyuter va
          planshetlarda o&apos;ng tomonda, o&apos;yinlar ustida ko&apos;rinadi.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Havola (bosilganda ochiladigan link)</span>
        <input type="url" name="linkUrl" required defaultValue={initial?.linkUrl} placeholder="https://..." className="input" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Boshlanish vaqti (Toshkent)</span>
          <input
            type="datetime-local"
            name="startAt"
            required
            defaultValue={initial?.startAt ? dateToTashkentInputValue(initial.startAt) : ""}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Tugash vaqti (Toshkent)</span>
          <input
            type="datetime-local"
            name="endAt"
            required
            defaultValue={initial?.endAt ? dateToTashkentInputValue(initial.endAt) : ""}
            className="input"
          />
        </label>
      </div>
      <p className="text-xs text-ink-soft/70">
        Shu vaqt oralig&apos;ida banner saytda ko&apos;rinadi. Bir vaqtning o&apos;zida bir nechta banner faol bo&apos;lsa,
        ular 5 daqiqada bir almashib turadi.
      </p>

      <label className="flex items-start gap-2.5 rounded-card border border-ink/10 bg-white p-4">
        <input
          type="checkbox"
          name="isFallback"
          defaultChecked={initial?.isFallback}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm text-ink">
          <span className="font-medium">Standart banner</span> — hech qanday boshqa banner faol bo&apos;lmagan
          vaqtlarda shu banner ko&apos;rsatiladi (vaqt oralig&apos;idan qat&apos;i nazar).
        </span>
      </label>

      <button type="submit" className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
        Saqlash
      </button>
    </form>
  );
}
