"use client";

import { useEffect, useId, useRef } from "react";

// `parent` must list every hostname the player will ever be embedded from,
// or Twitch refuses to load it (a CORS-like allowlist, not our own auth).
const PARENT_HOSTS = ["matchtaym.sardorkhon.me", "matchtaym.vercel.app", "localhost"];
const EMBED_SCRIPT_SRC = "https://player.twitch.tv/js/embed/v1.js";

type TwitchPlayerInstance = {
  play: () => void;
  addEventListener: (event: string, cb: () => void) => void;
  removeEventListener: (event: string, cb: () => void) => void;
};

type TwitchGlobal = {
  Player: new (
    elementId: string,
    options: {
      width: string | number;
      height: string | number;
      channel: string;
      parent: string[];
      autoplay?: boolean;
      muted?: boolean;
    }
  ) => TwitchPlayerInstance;
};

declare global {
  interface Window {
    Twitch?: TwitchGlobal;
  }
}

// Loaded once and reused — every TwitchPlayer instance on the page shares it.
let scriptLoadPromise: Promise<void> | null = null;
function loadTwitchEmbedScript(): Promise<void> {
  if (window.Twitch?.Player) return Promise.resolve();
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Twitch embed script failed to load"));
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

/**
 * Uses Twitch's Interactive JS Embed (not a raw iframe) specifically so we
 * can listen for its PAUSE event: locking the screen to landscape on
 * fullscreen entry makes some mobile browsers briefly pause the embedded
 * player as a side effect of the rotation, and a plain iframe gives no way
 * to detect or undo that (cross-origin). With the JS player we can just
 * resume it.
 */
export default function TwitchPlayer({ channel }: { channel: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const justRotatedRef = useRef(false);
  const containerId = useId();

  useEffect(() => {
    let cancelled = false;
    let cleanupListener: (() => void) | undefined;

    loadTwitchEmbedScript().then(() => {
      if (cancelled || !window.Twitch) return;
      const player = new window.Twitch.Player(containerId, {
        width: "100%",
        height: "100%",
        channel,
        parent: PARENT_HOSTS,
        autoplay: true,
        muted: false,
      });

      function handlePause() {
        // Only auto-resume pauses that happen right after we rotated the
        // screen — a real tap on the pause button shouldn't be overridden.
        if (justRotatedRef.current) player.play();
      }
      player.addEventListener("pause", handlePause);
      cleanupListener = () => player.removeEventListener("pause", handlePause);
    });

    return () => {
      cancelled = true;
      cleanupListener?.();
    };
  }, [channel, containerId]);

  useEffect(() => {
    // Not supported on iOS/Safari (no screen.orientation.lock at all) —
    // that's a platform gap, nothing to work around from here. Works on
    // Android Chrome/Firefox.
    function handleFullscreenChange() {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
      const inFullscreen = !!document.fullscreenElement && !!wrapperRef.current?.contains(document.fullscreenElement);

      if (inFullscreen) {
        justRotatedRef.current = true;
        orientation.lock?.("landscape").catch(() => {});
        setTimeout(() => {
          justRotatedRef.current = false;
        }, 2000);
      } else if (!document.fullscreenElement) {
        orientation.unlock?.();
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div ref={wrapperRef} className="aspect-video w-full overflow-hidden rounded-card bg-black">
      <div id={containerId} className="h-full w-full" />
    </div>
  );
}
