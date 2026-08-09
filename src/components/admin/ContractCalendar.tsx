import { formatDateTimeUz } from "@/lib/utils";

const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

type Booking = { id: string; signerName: string | null; startAt: Date; endAt: Date };

/** Simple month-grid calendar — highlights which days already have a booked ad slot. */
export default function ContractCalendar({
  bookings,
  year,
  month, // 0-indexed
}: {
  bookings: Booking[];
  year: number;
  month: number;
}) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (first.getDay() + 6) % 7; // Mon=0 ... Sun=6

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function bookingsForDay(day: number) {
    const dayStart = new Date(year, month, day, 0, 0, 0);
    const dayEnd = new Date(year, month, day, 23, 59, 59, 999);
    return bookings.filter((b) => b.startAt <= dayEnd && b.endAt >= dayStart);
  }

  const monthLabel = first.toLocaleDateString("uz-UZ", { month: "long", year: "numeric" });

  return (
    <div>
      <p className="mb-3 text-sm font-semibold capitalize text-ink">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-ink-soft">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const dayBookings = day ? bookingsForDay(day) : [];
          return (
            <div
              key={i}
              className={`min-h-[72px] rounded-lg border p-1 text-left ${
                day ? "border-ink/10 bg-white" : "border-transparent"
              }`}
            >
              {day && (
                <>
                  <p className="mb-0.5 text-[11px] font-semibold text-ink-soft">{day}</p>
                  {dayBookings.map((b) => (
                    <p
                      key={b.id}
                      title={`${b.signerName ?? "?"} — ${formatDateTimeUz(b.startAt)} — ${formatDateTimeUz(b.endAt)}`}
                      className="mb-0.5 truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {b.signerName ?? "?"}
                    </p>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
