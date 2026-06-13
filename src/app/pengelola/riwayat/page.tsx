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
      <h1 className="text-2xl font-bold text-zinc-900">Riwayat Booking</h1>

      <div className="mb-5 mt-3 flex flex-wrap gap-2">
        {tab.map((t) => {
          const aktif = (t.nilai ?? undefined) === (filter ?? undefined);
          const href = t.nilai ? `/pengelola/riwayat?status=${t.nilai}` : "/pengelola/riwayat";
          return (
            <a
              key={t.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${
                aktif
                  ? "bg-teal-600 text-white ring-teal-600"
                  : "bg-white text-zinc-600 ring-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {t.label}
            </a>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600">
          Tidak ada data.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ruangan</th>
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Pemohon</th>
                <th className="px-4 py-3 font-medium">Tujuan</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {bookings.map((b) => (
                <tr key={b.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900">{b.ruangan.nama}</div>
                    <div className="text-xs text-zinc-500">{b.ruangan.lokasi}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{b.bidang.nama}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {b.tujuan}
                    {b.catatan && (
                      <div className="mt-1 text-xs text-zinc-500">Catatan: {b.catatan}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeStatus status={b.status} />
                    {b.diprosesOleh && (
                      <div className="mt-1 text-xs text-zinc-400">oleh {b.diprosesOleh.nama}</div>
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
