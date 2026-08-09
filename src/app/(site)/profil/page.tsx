import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/kirish?callbackUrl=/profil");

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <h1 className="mb-1 font-heading text-2xl font-bold text-ink sm:text-3xl">Profil</h1>
      <p className="mb-6 text-ink-soft">{session.user.email}</p>
      <ProfileForm initialName={session.user.name ?? ""} initialImage={session.user.image ?? ""} />
    </div>
  );
}
