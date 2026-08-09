export default function PromoBoxSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-card border border-ink/10 bg-white">
      <div className="h-52 w-full bg-ink/5" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 rounded bg-ink/10" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5 py-1">
            <div className="h-2.5 w-16 rounded bg-ink/10" />
            <div className="h-3.5 w-32 rounded bg-ink/10" />
            <div className="h-3.5 w-28 rounded bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
