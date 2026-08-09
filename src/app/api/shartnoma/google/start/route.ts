import { NextResponse } from "next/server";

// A standalone OAuth 2.0 handshake — deliberately NOT next-auth's Google
// provider, and it never creates a MatchTaym reader account. It exists only
// to prove the advertiser controls the email they're about to sign a
// contract with, without ever seeing their password (Google authenticates
// them on Google's own page).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/", url.origin));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    const back = new URL(`/shartnoma/${token}`, url.origin);
    back.searchParams.set("xato", "google_sozlanmagan");
    return NextResponse.redirect(back);
  }

  const redirectUri = `${url.origin}/api/shartnoma/google/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", token);
  authUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(authUrl);
}
