"use client";

import { useRef, useState } from "react";
import { marked } from "marked";
import { uploadImageToS3 } from "@/lib/upload-client";
import { useToast } from "@/components/Toast";
import UploadProgress from "./UploadProgress";

const TOOLBAR: { label: string; wrap: [string, string] }[] = [
  { label: "B", wrap: ["**", "**"] },
  { label: "I", wrap: ["*", "*"] },
  { label: "H2", wrap: ["\n## ", ""] },
  { label: "H3", wrap: ["\n### ", ""] },
  { label: "”", wrap: ["\n> ", ""] },
  { label: "•", wrap: ["\n- ", ""] },
  { label: "Link", wrap: ["[", "](https://)"] },
];

export default function MarkdownEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function applyWrap(prefix: string, suffix: string) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    const selected = value.slice(selectionStart, selectionEnd) || "matn";
    const next =
      value.slice(0, selectionStart) +
      prefix +
      selected +
      suffix +
      value.slice(selectionEnd);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = selectionStart + prefix.length + selected.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadImageToS3(file, setUploadProgress);
      applyWrap(`\n![rasm](${url})\n`, "");
      toast.show("Rasm qo'shildi ✓");
    } catch (err) {
      toast.show(err instanceof Error ? err.message : "Rasm yuklanmadi", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-ink/10 bg-white/60 p-1.5">
        {TOOLBAR.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => applyWrap(t.wrap[0], t.wrap[1])}
            className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink-soft hover:bg-cream"
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-ink-soft hover:bg-cream disabled:opacity-50"
        >
          {uploading ? `🖼 ${uploadProgress}%` : "🖼 Rasm"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />

        <div className="ml-auto flex overflow-hidden rounded-md border border-ink/10 text-xs">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-3 py-1.5 font-medium ${tab === "write" ? "bg-primary text-white" : "text-ink-soft"}`}
          >
            Yozish
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1.5 font-medium ${tab === "preview" ? "bg-primary text-white" : "text-ink-soft"}`}
          >
            Ko&apos;rish
          </button>
        </div>
      </div>

      {uploading && <UploadProgress percent={uploadProgress} />}

      <input type="hidden" name={name} value={value} />

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={16}
          placeholder="Maqola matnini shu yerga yozing (Markdown qo'llab-quvvatlanadi: **qalin**, *kursiv*, > sitata, ## sarlavha)…"
          className="w-full rounded-b-xl border border-ink/10 bg-white p-4 text-sm leading-relaxed text-ink outline-none focus:border-primary"
        />
      ) : (
        <div
          className="prose-article min-h-[20rem] w-full rounded-b-xl border border-ink/10 bg-white p-4"
          dangerouslySetInnerHTML={{ __html: marked.parse(value || "*Matn yo'q*") as string }}
        />
      )}
    </div>
  );
}
