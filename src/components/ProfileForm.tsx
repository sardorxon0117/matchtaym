"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { updateProfile } from "@/actions/profile";
import { useToast } from "@/components/Toast";
import ImageUploader from "@/components/admin/ImageUploader";

export default function ProfileForm({ initialName, initialImage }: { initialName: string; initialImage: string }) {
  const [image, setImage] = useState(initialImage);
  const [error, formAction, pending] = useActionState(updateProfile, undefined);
  const { update: updateSession } = useSession();
  const toast = useToast();
  const wasPending = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) {
        toast.show(error, "error");
      } else {
        updateSession({ name: nameRef.current?.value, image });
        toast.show("Profil yangilandi ✓");
      }
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  return (
    <form action={formAction} className="max-w-sm space-y-5">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <ImageUploader name="image" value={image} onChange={setImage} label="Profil rasmi" />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Ism</span>
        <input ref={nameRef} type="text" name="name" required defaultValue={initialName} className="input" />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Saqlanmoqda…" : "Saqlash"}
      </button>
    </form>
  );
}
