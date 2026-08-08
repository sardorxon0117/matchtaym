"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

type ArticleOption = { id: string; title: string };

export default function TransferForm({
  action,
  articles,
  initial,
}: {
  action: (formData: FormData) => void;
  articles: ArticleOption[];
  initial?: {
    playerName?: string;
    playerImage?: string;
    fromClub?: string;
    toClub?: string;
    fee?: string;
    status?: string;
    date?: string;
    league?: string;
    relatedArticleId?: string;
  };
}) {
  const [playerImage, setPlayerImage] = useState(initial?.playerImage ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <ImageUploader name="playerImage" value={playerImage} onChange={setPlayerImage} label="O'yinchi rasmi (ixtiyoriy)" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="O'yinchi ismi">
          <input name="playerName" required defaultValue={initial?.playerName} className="input" />
        </Field>
        <Field label="Liga (ixtiyoriy)">
          <input name="league" defaultValue={initial?.league} className="input" placeholder="Masalan: La Liga" />
        </Field>
        <Field label="Qaysi klubdan">
          <input name="fromClub" required defaultValue={initial?.fromClub} className="input" />
        </Field>
        <Field label="Qaysi klubga">
          <input name="toClub" required defaultValue={initial?.toClub} className="input" />
        </Field>
        <Field label="Summa (ixtiyoriy)">
          <input name="fee" defaultValue={initial?.fee} className="input" placeholder="€20m / bepul / ijara" />
        </Field>
        <Field label="Sana">
          <input
            type="date"
            name="date"
            required
            defaultValue={initial?.date ?? new Date().toISOString().slice(0, 10)}
            className="input"
          />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={initial?.status ?? "RUMOR"} className="input">
            <option value="RUMOR">Mish-mish</option>
            <option value="CONFIRMED">Tasdiqlangan</option>
            <option value="OFFICIAL">Rasmiy</option>
          </select>
        </Field>
        <Field label="Bog'liq maqola (ixtiyoriy)">
          <select name="relatedArticleId" defaultValue={initial?.relatedArticleId ?? ""} className="input">
            <option value="">— tanlanmagan —</option>
            {articles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button type="submit" className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
        Saqlash
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
