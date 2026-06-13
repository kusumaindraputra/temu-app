import Link from "next/link";
import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";
import KalenderBulanan, { type TandaiHari } from "@/components/kalender-bulanan";
import {
  bulanTahunJakarta,
  toJakartaDateStr,
  padDateStr,
  namaBulan,
} from "@/lib/jadwal";
import { fmtRentang } from "@/lib/format";

export default async function HalamanKalenderBidang({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  await wajibBidang();
  const { bulan: bJakarta, tahun: tJakarta } = bulanTahunJakarta();
  const sp = await searchParams;

  const bulan = Math.max(1, Math.min(12, Number(sp.bulan) || bJakarta));
  const tahun = Number(sp.tahun) || tJakarta;

  const startBulan = new Date(`${padDateStr(tahun, bulan, 1)}T00:00:00+07:00`);
  const endBulan = new Date(new Date(tahun, bulan, 1).getTime() - 1);

  const [ruanganList, bookings] = await Promise.all([
    db.ruangan.findMany({
      where: { aktif: true },
      orderBy: { nama: "asc" },
      select: { id: true, nama: true },
    }),
    db.booking.findMany({
      where: {
        status: { in: ["DISETUJUI", "MENUNGGU"] },
        waktuMulai: { gte: startBulan, lte: endBulan },
      },
      include: {
        ruangan: { select: { id: true, nama: true } },
      },
      orderBy: { waktuMulai: "asc" },
    }),
  ]);

  // Calendar dots: teal = any DISETUJUI, amber = only MENUNGGU
  const tandai: TandaiHari = {};
  for (const b of bookings) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!tandai[ds]) tandai[ds] = { dots: [] };
    const dot = b.status === "DISETUJUI" ? "teal" : "amber";
    if (!tandai[ds].dots.includes(dot)) tandai[ds].dots.push(dot);
  }

  // Per-day: map of dateStr → set of booked ruanganIds
  const bokdPerHari = new Map<string, Set<number>>();
  for (const b of bookings) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!bokdPerHari.has(ds)) bokdPerHari.set(ds, new Set());
    bokdPerHari.get(ds)!.add(b.ruangan.id);
  }

  // Collect unique days that have any booking
  const hariAdaBooking = Array.from(
    new Map(
      bookings.map((b) => [toJakartaDateStr(b.waktuMulai), b.waktuMulai]),
    ).entries(),
  ).sort(([a], [b]) => a.localeCompare(b));

  // Per-day + per-room: grouped bookings for tooltip/detail
  type BookingItem = (typeof bookings)[number];
  const perHariRuangan = new Map<string, Map<number, BookingItem[]>>();
  for (const b of bookings) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!perHariRuangan.has(ds)) perHariRuangan.set(ds, new Map());
    const byRoom = perHariRuangan.get(ds)!;
    if (!byRoom.has(b.ruangan.id)) byRoom.set(b.ruangan.id, []);
    byRoom.get(b.ruangan.id)!.push(b);
  }

  const totalHariBusy = bokdPerHari.size;
  const totalRuangan = ruanganList.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Ketersediaan Ruangan</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {namaBulan(bulan)} {tahun} — {totalRuangan} ruangan aktif
          </p>
        </div>
        <Link
          href="/bidang/jadwal"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Tampilan Hari →
        </Link>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs text-zinc-600">
        <span className="font-medium text-zinc-500">Keterangan:</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-teal-500" />
          Ada booking disetujui
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
          Ada booking menunggu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm border border-zinc-200 bg-zinc-50" />
          Bebas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* Kalender */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <KalenderBulanan
            bulan={bulan}
            tahun={tahun}
            tandai={tandai}
            jadwalHref="/bidang/jadwal"
            kalenderHref="/bidang/kalender"
          />
          <p className="mt-4 text-center text-xs text-zinc-400">
            Klik tanggal untuk lihat jadwal hari itu
          </p>
        </div>

        {/* Ketersediaan per hari */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-zinc-700">
            Ketersediaan Ruangan — {namaBulan(bulan)} {tahun}
          </h2>

          {hariAdaBooking.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-zinc-500">Semua ruangan bebas bulan ini.</p>
              <Link
                href="/bidang/booking/baru"
                className="mt-2 text-sm font-medium text-teal-600 hover:underline"
              >
                Buat booking →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {hariAdaBooking.map(([ds]) => {
                const bokdIds = bokdPerHari.get(ds) ?? new Set<number>();
                const byRoom = perHariRuangan.get(ds) ?? new Map<number, BookingItem[]>();
                const bebas = ruanganList.filter((r) => !bokdIds.has(r.id));
                const sibuk = ruanganList.filter((r) => bokdIds.has(r.id));

                return (
                  <li key={ds}>
                    <div className="mb-2 flex items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        {new Date(`${ds}T12:00:00Z`).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          timeZone: "Asia/Jakarta",
                        })}
                      </p>
                      <Link
                        href={`/bidang/jadwal?tanggal=${ds}`}
                        className="text-xs text-teal-600 hover:underline"
                      >
                        Lihat jadwal
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {/* Ruangan sibuk */}
                      {sibuk.map((r) => {
                        const items = byRoom.get(r.id) ?? [];
                        return (
                          <div
                            key={r.id}
                            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-zinc-700">{r.nama}</p>
                              <span className="shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
                                Terisi
                              </span>
                            </div>
                            <ul className="mt-1.5 flex flex-col gap-1">
                              {items.map((b) => (
                                <li key={b.id} className="flex items-center gap-1.5 text-xs text-zinc-500">
                                  <span
                                    className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                                      b.status === "DISETUJUI" ? "bg-teal-500" : "bg-amber-400"
                                    }`}
                                  />
                                  {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}

                      {/* Ruangan bebas */}
                      {bebas.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-teal-700">{r.nama}</p>
                            <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-600">
                              Bebas
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-teal-500">Tersedia sepanjang hari</p>
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {hariAdaBooking.length > 0 && (
            <p className="mt-6 text-xs text-zinc-400">
              {totalHariBusy} hari ada booking · {totalRuangan} ruangan aktif
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
