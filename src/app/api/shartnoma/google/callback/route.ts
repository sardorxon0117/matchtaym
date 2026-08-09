import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GoogleUserInfo = { email?: string; email_verified?: boolean; name?: string };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const token = url.searchParams.get("state");

  if (!token) return NextResponse.redirect(new URL("/", url.origin));
  const back = new URL(`/shartnoma/${token}`, url.origin);

  if (!code) {
    back.searchParams.set("xato", "google_bekor");
    return NextResponse.redirect(back);
  }

  try {
    const redirectUri = `${url.origin}/api/shartnoma/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenRes.ok) throw new Error(`token exchange failed: ${tokenRes.status}`);
    const tokenData: { access_token?: string } = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("no access_token in response");

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!userRes.ok) throw new Error(`userinfo failed: ${userRes.status}`);
    const profile: GoogleUserInfo = await userRes.json();

    if (!profile.email || !profile.email_verified) throw new Error("email not verified by Google");

    const contract = await prisma.adContract.findUnique({ where: { token } });
    if (!contract) return NextResponse.redirect(new URL("/", url.origin));

    // Only ever set this once, on the way into PENDING_SIGNATURE — never
    // overwritten afterwards, so a signed contract's verified email can't
    // change under it.
    if (contract.status === "PENDING_SIGNATURE" && !contract.signerEmail) {
      await prisma.adContract.update({
        where: { id: contract.id },
        data: { signerEmail: profile.email },
      });
    }
  } catch (err) {
    console.error("Shartnoma Google OAuth xatosi:", err);
    back.searchParams.set("xato", "google_xato");
    return NextResponse.redirect(back);
  }

  return NextResponse.redirect(back);
}
