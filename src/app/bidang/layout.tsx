import TopBar from "@/components/topbar";
import BottomNav from "@/components/bottom-nav";
import { wajibBidang } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function BidangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesi = await wajibBidang();

  const unreadCount = await db.notifikasi.count({
    where: { bidangId: sesi.id, sudahDibaca: false },
  });

  return (
    <div className="min-h-screen">
      <TopBar
        sesi={sesi}
        unreadCount={unreadCount}
        nav={[
          { href: "/bidang", label: "Beranda" },
          { href: "/bidang/booking/baru", label: "Buat Booking" },
          { href: "/bidang/notifikasi", label: "Notifikasi" },
        ]}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:pb-6">{children}</main>
      <BottomNav
        items={[
          { href: "/bidang", label: "Beranda", icon: "home" },
          { href: "/bidang/booking/baru", label: "Buat Booking", icon: "plus" },
          { href: "/bidang/notifikasi", label: "Notifikasi", icon: "bell", badge: unreadCount },
        ]}
      />
    </div>
  );
}
