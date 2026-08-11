import { createLiveScheduleEntry } from "@/actions/live";

export default function LiveScheduleForm() {
  return (
    <form action={createLiveScheduleEntry} className="max-w-sm space-y-4 rounded-card border border-ink/10 bg-white p-5">
      <p className="font-medium text-ink">Yangi translatsiya qo&apos;shish</p>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Sarlavha</span>
        <input name="title" required placeholder="masalan: Barcelona - Real Madrid" className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Vaqti (Toshkent)</span>
        <input type="datetime-local" name="startAt" required className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Izoh (ixtiyoriy)</span>
        <input name="note" placeholder="masalan: LaLiga, 3-tur" className="input" />
      </label>
      <button
        type="submit"
        className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Qo&apos;shish
      </button>
    </form>
  );
}
