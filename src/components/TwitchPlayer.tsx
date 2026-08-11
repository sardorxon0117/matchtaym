// Plain iframe — Twitch's embed needs no client JS of its own. `parent` must
// list every hostname the player will ever be embedded from, or Twitch
// refuses to load it (a CORS-like allowlist, not related to our own auth).
const PARENT_HOSTS = ["matchtaym.sardorkhon.me", "matchtaym.vercel.app", "localhost"];

export default function TwitchPlayer({ channel }: { channel: string }) {
  const params = new URLSearchParams({ channel, autoplay: "true", muted: "false" });
  for (const host of PARENT_HOSTS) params.append("parent", host);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-card bg-black">
      <iframe
        src={`https://player.twitch.tv/?${params.toString()}`}
        className="h-full w-full"
        allowFullScreen
        title="MatchTaym Live"
      />
    </div>
  );
}
