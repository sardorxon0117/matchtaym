import { NextResponse } from "next/server";
import { getLiveSettings } from "@/lib/queries";

// Polled from the client (LiveStage) so anyone already sitting on /live
// sees the admin's on/off toggle take effect within seconds — playing a
// countdown/ended sequence around the switch — instead of only on their
// next full page reload.
export async function GET() {
  const settings = await getLiveSettings();
  return NextResponse.json({ isLive: !!settings?.isLive && !!settings.twitchChannel });
}
