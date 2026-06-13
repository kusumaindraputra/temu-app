import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import BadgeStatus from "@/components/badge-status";
import { fmtRentang } from "@/lib/format";
import type { StatusBooking } from "@prisma/client";

const STATUS_VALID: StatusBooking[] = ["MENUNGGU", "DISETUJUI", "DITOLAK", "BATAL"];

export default async function HalamanRiwayat({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await wajibPengelola();
  const { status } = await searchParams;
  const filter = STATUS_VALID.includes(status as StatusBooking)
    ? (status as StatusBooking)
    : undefined;

  const bookings = await db.booking.findMany({
    where: filter ? { status: filter } : {},
    orderBy: { waktuMulai: "desc" },
    take: 200,
    include: {
      ruangan: { select: { nama: true, lokasi: true } },
      bidang: { select: { nama: true } },
      diprosesOleh: { select: { nama: true } },
    },
  });

  const tab: { label: string; nilai?: string }[] = [
    { label: "Semua" },
    { label: "Menunggu", nilai: "MENUNGGU" },
    { label: "Disetujui", nilai: "DISETUJUI" },
    { label: "Ditolak", nilai: "DITOLAK" },
    { label: "Dibatalkan", nilai: "BATAL" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900">Riwayat Booking</h1>

      <div className="mb-6 mt-4 flex flex-wrap gap-1.5">
        {tab.map((t) => {
          const aktif = (t.nilai ?? undefined) === (filter ?? undefined);
          const href = t.nilai ? `/pengelola/riwayat?status=${t.nilai}` : "/pengelola/riwayat";
          return (
            <a
              key={t.label}
              href={href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                aktif
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-600 shadow-sm hover:bg-stone-50"
              }`}
            >
              {t.label}
            </a>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center text-stone-400">
          Tidak ada data.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-100">
              <tr>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-stone-400">Ruangan</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-stone-400">Waktu</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-stone-400">Pemohon</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-stone-400">Tujuan</th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-stone-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {bookings.map((b) => (
                <tr key={b.id} className="align-top">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-stone-900">{b.ruangan.nama}</div>
                    <div className="text-xs text-stone-400">{b.ruangan.lokasi}</div>
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">
                    {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">{b.bidang.nama}</td>
                  <td className="px-5 py-3.5 text-stone-600">
                    {b.tujuan}
                    {b.catatan && (
                      <div className="mt-1 text-xs text-stone-400">Catatan: {b.catatan}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <BadgeStatus status={b.status} />
                    {b.diprosesOleh && (
                      <div className="mt-1 text-xs text-stone-400">oleh {b.diprosesOleh.nama}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
