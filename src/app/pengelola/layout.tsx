import TopBar from "@/components/topbar";
import { wajibPengelola } from "@/lib/auth";

export default async function PengelolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesi = await wajibPengelola();

  const nav = [
    { href: "/pengelola", label: "Persetujuan" },
    { href: "/pengelola/riwayat", label: "Riwayat" },
    { href: "/pengelola/kalender", label: "Kalender" },
    { href: "/pengelola/jadwal", label: "Jadwal" },
  ];
  if (sesi.role === "ADMIN") {
    nav.push(
      { href: "/pengelola/ruangan", label: "Ruangan" },
      { href: "/pengelola/akun", label: "Akun" },
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar sesi={sesi} nav={nav} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
