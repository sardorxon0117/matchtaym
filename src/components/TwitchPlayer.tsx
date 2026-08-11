"use client";

import { useEffect, useRef } from "react";

// Twitch's embed needs no client JS of its own to just play — the "use
// client" here is only for the fullscreen/orientation handling below.
// `parent` must list every hostname the player will ever be embedded from,
// or Twitch refuses to load it (a CORS-like allowlist, not our own auth).
const PARENT_HOSTS = ["matchtaym.sardorkhon.me", "matchtaym.vercel.app", "localhost"];

export default function TwitchPlayer({ channel }: { channel: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // The video itself is landscape, but a phone defaults to portrait — so
    // going fullscreen without rotating leaves black bars above/below
    // instead of actually filling the screen. Since the fullscreen state
    // change is visible on the parent document even for a cross-origin
    // iframe (we can't reach inside Twitch's player itself), we can lock
    // the orientation to landscape for the duration.
    //
    // Not supported on iOS/Safari (no screen.orientation.lock at all) —
    // this is a platform gap, nothing to work around from here. It works
    // on Android Chrome/Firefox.
    function handleFullscreenChange() {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      if (document.fullscreenElement === iframeRef.current) {
        orientation.lock?.("landscape").catch(() => {});
      } else if (!document.fullscreenElement) {
        orientation.unlock?.();
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const params = new URLSearchParams({ channel, autoplay: "true", muted: "false" });
  for (const host of PARENT_HOSTS) params.append("parent", host);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-black">
      <iframe
        ref={iframeRef}
        src={`https://player.twitch.tv/?${params.toString()}`}
        className="h-full w-full"
        allowFullScreen
        title="MatchTaym Live"
      />
    </div>
  );
}
