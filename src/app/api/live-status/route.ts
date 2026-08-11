import { NextResponse } from "next/server";
import { getLiveSettings } from "@/lib/queries";

// Polled from the client (LiveStatusWatcher) so anyone already sitting on
// /live sees the admin's on/off toggle take effect within seconds, instead
// of only on their next full page reload.
export async function GET() {
  const settings = await getLiveSettings();
  return NextResponse.json({ isLive: !!settings?.isLive && !!settings.twitchChannel });
}
