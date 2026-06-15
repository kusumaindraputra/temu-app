import TopBar from "@/components/topbar";
import BottomNav, { type BottomNavItem } from "@/components/bottom-nav";
import { wajibPengelola } from "@/lib/auth";

export default async function PengelolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesi = await wajibPengelola();

  const nav = [
    { href: "/pengelola", label: "Beranda" },
    { href: "/pengelola/riwayat", label: "Riwayat" },
  ];
  const bottomItems: BottomNavItem[] = [
    { href: "/pengelola", label: "Beranda", icon: "home" },
    { href: "/pengelola/riwayat", label: "Riwayat", icon: "clock" },
  ];
  if (sesi.role === "ADMIN") {
    nav.push(
      { href: "/pengelola/ruangan", label: "Ruangan" },
      { href: "/pengelola/akun", label: "Akun" },
    );
    bottomItems.push(
      { href: "/pengelola/ruangan", label: "Ruangan", icon: "building" },
      { href: "/pengelola/akun", label: "Akun", icon: "users" },
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar sesi={sesi} nav={nav} />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:pb-6">{children}</main>
      <BottomNav items={bottomItems} />
    </div>
  );
}
