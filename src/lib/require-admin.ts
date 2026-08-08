import "server-only";
import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Ruxsat berilmagan: tizimga kiring");
  }
  return session.user;
}
