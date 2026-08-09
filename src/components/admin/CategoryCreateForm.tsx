"use client";

import { useRef, useTransition } from "react";
import { createCategory } from "@/actions/categories";
import { useToast } from "@/components/Toast";

export default function CategoryCreateForm() {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCategory(formData);
        toast.show("Kategoriya qo'shildi ✓");
        formRef.current?.reset();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input name="name" required placeholder="Yangi kategoriya nomi" className="input" />
      <button
        type="submit"
        disabled={pending}
        className="whitespace-nowrap rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Qo'shilmoqda…" : "Qo'shish"}
      </button>
    </form>
  );
}
