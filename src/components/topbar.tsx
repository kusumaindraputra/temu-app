import Link from "next/link";
import type { Sesi } from "@/lib/session";
import { aksiLogout } from "@/lib/auth-actions";
import { LogoMark, Wordmark } from "@/components/logo";

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

  const inisial = sesi.nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-6">
          <Link
            href={sesi.tipe === "BIDANG" ? "/bidang" : "/pengelola"}
            className="flex items-center gap-2.5"
          >
            <LogoMark size={28} />
            <Wordmark className="hidden text-base text-stone-900 sm:block" />
          </Link>

          <nav className="hidden items-center gap-0.5 sm:flex">
            {nav.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-md px-2.5 py-1.5 text-sm text-stone-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: bell + user + logout */}
        <div className="flex items-center gap-1">
          {sesi.tipe === "BIDANG" && (
            <Link
              href="/bidang/notifikasi"
              aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              className="relative rounded-md p-2.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
                <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}

          <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
              {inisial}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium leading-tight text-stone-900">{sesi.nama}</p>
              <p className="text-[10px] leading-tight text-stone-400">{labelPeran}</p>
            </div>
          </div>

          <form action={aksiLogout}>
            <button
              type="submit"
              className="rounded-md border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
