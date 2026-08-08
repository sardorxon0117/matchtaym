"use client";

import { useActionState, useEffect, useRef } from "react";
import { createComment } from "@/actions/comments";

export default function CommentForm({
  articleId,
  parentId = null,
  placeholder = "Fikringizni yozing…",
  submitLabel = "Yuborish",
  autoFocus = false,
  onDone,
}: {
  articleId: string;
  parentId?: string | null;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const action = createComment.bind(null, articleId, parentId);
  const [error, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !error) {
      formRef.current?.reset();
      onDone?.();
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <textarea
        name="content"
        required
        minLength={2}
        maxLength={2000}
        rows={parentId ? 2 : 3}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input resize-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda…" : submitLabel}
      </button>
    </form>
  );
}
