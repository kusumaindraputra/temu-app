import Link from "next/link";
import type { Sesi } from "@/lib/session";
import { aksiLogout } from "@/lib/auth-actions";

type TautanNav = { href: string; label: string };

export default function TopBar({
  sesi,
  nav = [],
  unreadCount = 0,
}: {
  sesi: Sesi;
  nav?: TautanNav[];
  unreadCount?: number;
}) {
  const labelPeran =
    sesi.tipe === "BIDANG"
      ? "Bidang"
      : sesi.role === "ADMIN"
        ? "Admin"
        : "Pengelola";

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link
            href={sesi.tipe === "BIDANG" ? "/bidang" : "/pengelola"}
            className="flex items-center gap-2 font-semibold text-zinc-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
              DK
            </span>
            <span className="hidden sm:inline">Booking Ruang</span>
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {sesi.tipe === "BIDANG" && (
            <Link
              href="/bidang/notifikasi"
              aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ""}`}
              className="relative rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          <div className="text-right">
            <p className="text-sm font-medium leading-tight text-zinc-900">{sesi.nama}</p>
            <p className="text-xs leading-tight text-zinc-500">{labelPeran}</p>
          </div>
          <form action={aksiLogout}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
