export default function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className="mt-2 w-full max-w-sm">
      <div className="h-2 w-full overflow-hidden rounded-pill bg-ink/10">
        <div
          className="h-full rounded-pill bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${Math.max(percent, 4)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-ink-soft">
        {percent > 0 ? `${percent}%` : "Tayyorlanmoqda…"}
      </p>
    </div>
  );
}
