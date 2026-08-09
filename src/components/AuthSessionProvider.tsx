"use client";

import { SessionProvider } from "next-auth/react";

// Lets client components (e.g. the profile form) call `useSession().update()`
// to refresh the JWT-backed session (name/avatar) right after a change,
// without forcing a full sign-out/sign-in.
export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
