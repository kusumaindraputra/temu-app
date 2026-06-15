"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type BottomNavItem = {
  href: string;
  label: string;
  icon: "home" | "plus" | "bell" | "clock" | "building" | "users";
  badge?: number;
};

function NavIcon({ name }: { name: BottomNavItem["icon"] }) {
  const p = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg {...p}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "plus":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
          <path d="M10 18h4" />
        </svg>
      );
    case "users":
      return (
        <svg {...p}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
  }
}

export default function BottomNav({ items }: { items: BottomNavItem[] }) {
  const pathname = usePathname();

  // Most specific matching href wins (longest prefix match)
  const matches = items.filter(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/"),
  );
  const best =
    matches.length > 0
      ? matches.reduce((a, b) => (a.href.length >= b.href.length ? a : b))
      : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-100 bg-white/90 backdrop-blur-md sm:hidden">
      <div
        className="flex"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {items.map((item) => {
          const active = best?.href === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-brand-600" : "text-stone-400"
              }`}
            >
              <div className="relative">
                <NavIcon name={item.icon} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
