import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";

const NAV = [
  { href: "/admin", label: "Boshqaruv paneli", icon: "🏠" },
  { href: "/admin/maqolalar", label: "Maqolalar", icon: "📰" },
  { href: "/admin/kategoriyalar", label: "Kategoriyalar", icon: "🏷️" },
  { href: "/admin/transferlar", label: "Transferlar", icon: "🔁" },
  { href: "/admin/izohlar", label: "Izohlar", icon: "💬" },
  { href: "/admin/live", label: "Live", icon: "🔴" },
  { href: "/admin/banner", label: "Reklama banneri", icon: "📣" },
  { href: "/admin/reklama-shartnomalari", label: "Reklama shartnomalari", icon: "📝" },
  { href: "/admin/donatsiyalar", label: "Donatsiyalar", icon: "💚" },
  { href: "/admin/taklif-shikoyat", label: "Taklif va shikoyat", icon: "📩" },
];

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isStaff = !!session?.user && STAFF_ROLES.has((session.user as { role?: string }).role ?? "");

  if (!isStaff) {
    return <div className="min-h-screen bg-ink">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-white md:flex print:hidden">
        <div className="border-b border-ink/10 px-5 py-5">
          <span className="font-heading text-lg font-bold text-ink">
            Match<span className="text-primary">Taym</span>{" "}
            <span className="text-xs font-normal text-ink-soft">admin</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-cream hover:text-primary"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink/10 p-3">
          <p className="truncate px-3 py-1 text-xs text-ink-soft/70">{session!.user.email}</p>
          <form action={logoutAction.bind(null, "/admin/login")}>
            <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink-soft hover:bg-cream hover:text-primary">
              🚪 Chiqish
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:hidden print:hidden">
          <span className="font-heading text-lg font-bold text-ink">
            Match<span className="text-primary">Taym</span>
          </span>
          <form action={logoutAction.bind(null, "/admin/login")}>
            <button className="text-sm font-medium text-ink-soft">Chiqish</button>
          </form>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-white px-3 py-2 md:hidden print:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-cream hover:text-primary"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
