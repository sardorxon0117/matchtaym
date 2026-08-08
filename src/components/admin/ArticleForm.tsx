"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";

type Category = { id: string; name: string };

export default function ArticleForm({
  action,
  categories,
  initial,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  initial?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    categoryId?: string;
    tags?: string;
    status?: string;
    metaTitle?: string;
    metaDesc?: string;
  };
}) {
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");

  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Field label="Sarlavha">
            <input
              name="title"
              required
              defaultValue={initial?.title}
              className="input"
              placeholder="Masalan: Milliy terma jamoa yig'inini o'tkazdi"
            />
          </Field>

          <Field label="URL manzil (slug) — bo'sh qoldirsa avtomatik">
            <input name="slug" defaultValue={initial?.slug} className="input" placeholder="milliy-terma-yigin" />
          </Field>

          <Field label="Qisqacha tavsif (excerpt)">
            <textarea
              name="excerpt"
              defaultValue={initial?.excerpt}
              rows={2}
              className="input resize-none"
              placeholder="Kartalarda ko'rinadigan qisqa matn"
            />
          </Field>

          <Field label="Maqola matni">
            <MarkdownEditor name="content" defaultValue={initial?.content} />
          </Field>
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-ink/10 bg-white p-4">
            <ImageUploader name="coverImage" value={coverImage} onChange={setCoverImage} label="Asosiy rasm" />
          </div>

          <div className="rounded-card border border-ink/10 bg-white p-4 space-y-4">
            <Field label="Holat">
              <select name="status" defaultValue={initial?.status ?? "DRAFT"} className="input">
                <option value="DRAFT">Qoralama</option>
                <option value="PUBLISHED">Nashr qilish</option>
              </select>
            </Field>

            <Field label="Kategoriya">
              <select name="categoryId" defaultValue={initial?.categoryId ?? ""} className="input">
                <option value="">— tanlanmagan —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Teglar (vergul bilan)">
              <input name="tags" defaultValue={initial?.tags} className="input" placeholder="transfer, terma jamoa" />
            </Field>
          </div>

          <div className="rounded-card border border-ink/10 bg-white p-4 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">SEO</p>
            <Field label="Meta sarlavha">
              <input name="metaTitle" defaultValue={initial?.metaTitle} className="input" />
            </Field>
            <Field label="Meta tavsif">
              <textarea name="metaDesc" defaultValue={initial?.metaDesc} rows={2} className="input resize-none" />
            </Field>
          </div>

          <button type="submit" className="w-full rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
            Saqlash
          </button>
        </div>
      </div>
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
