import Link from "next/link";
import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import KalenderBulanan, { type TandaiHari } from "@/components/kalender-bulanan";
import {
  bulanTahunJakarta,
  toJakartaDateStr,
  padDateStr,
  namaBulan,
} from "@/lib/jadwal";
import { fmtRentang } from "@/lib/format";
import BadgeStatus from "@/components/badge-status";

export default async function HalamanKalenderPengelola({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  await wajibPengelola();
  const { bulan: bJakarta, tahun: tJakarta } = bulanTahunJakarta();
  const sp = await searchParams;

  const bulan = Math.max(1, Math.min(12, Number(sp.bulan) || bJakarta));
  const tahun = Number(sp.tahun) || tJakarta;

  const startBulan = new Date(`${padDateStr(tahun, bulan, 1)}T00:00:00+07:00`);
  const endBulan = new Date(new Date(tahun, bulan, 1).getTime() - 1);

  const bookings = await db.booking.findMany({
    where: {
      status: { in: ["MENUNGGU", "DISETUJUI", "DITOLAK", "BATAL"] },
      waktuMulai: { gte: startBulan, lte: endBulan },
    },
    include: {
      ruangan: { select: { nama: true } },
      bidang: { select: { nama: true } },
    },
    orderBy: { waktuMulai: "asc" },
  });

  const statusDotMap = {
    DISETUJUI: "teal",
    MENUNGGU: "amber",
    DITOLAK: "red",
    BATAL: "red",
  } as const;

  const tandai: TandaiHari = {};
  for (const b of bookings) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!tandai[ds]) tandai[ds] = { dots: [] };
    const dot = statusDotMap[b.status];
    if (!tandai[ds].dots.includes(dot)) tandai[ds].dots.push(dot);
  }

  // Kelompokkan per hari
  const perHari = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!perHari.has(ds)) perHari.set(ds, []);
    perHari.get(ds)!.push(b);
  }

  // Ringkasan per status
  const ringkasan = {
    disetujui: bookings.filter((b) => b.status === "DISETUJUI").length,
    menunggu: bookings.filter((b) => b.status === "MENUNGGU").length,
    ditolak: bookings.filter((b) => b.status === "DITOLAK").length,
    batal: bookings.filter((b) => b.status === "BATAL").length,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Kalender Semua Booking</h1>
          <p className="mt-1 text-sm text-stone-500">
            {namaBulan(bulan)} {tahun} — {bookings.length} booking
          </p>
        </div>
        <Link
          href="/pengelola/jadwal"
          className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
        >
          Tampilan Hari →
        </Link>
      </div>

      {/* Ringkasan bulan */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Disetujui", nilai: ringkasan.disetujui, cls: "text-teal-600 bg-teal-50 border-teal-200" },
          { label: "Menunggu", nilai: ringkasan.menunggu, cls: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Ditolak", nilai: ringkasan.ditolak, cls: "text-red-600 bg-red-50 border-red-200" },
          { label: "Batal", nilai: ringkasan.batal, cls: "text-stone-600 bg-stone-50 border-stone-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.cls}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums`}>{s.nilai}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* Kalender */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <KalenderBulanan
            bulan={bulan}
            tahun={tahun}
            tandai={tandai}
            jadwalHref="/pengelola/jadwal"
            kalenderHref="/pengelola/kalender"
          />
        </div>

        {/* Daftar booking bulan ini */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-stone-700">
            Detail Booking — {namaBulan(bulan)} {tahun}
          </h2>

          {bookings.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-500">
              Tidak ada booking bulan ini.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {Array.from(perHari.entries()).map(([ds, items]) => (
                <li key={ds}>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                      {new Date(`${ds}T12:00:00Z`).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        timeZone: "Asia/Jakarta",
                      })}
                    </p>
                    <Link
                      href={`/pengelola/jadwal?tanggal=${ds}`}
                      className="text-xs text-teal-600 hover:underline"
                    >
                      Lihat jadwal
                    </Link>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {items.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-stone-900">
                              {b.ruangan.nama}
                            </p>
                            <span className="text-xs text-stone-400">·</span>
                            <p className="text-xs text-stone-500">{b.bidang.nama}</p>
                          </div>
                          <p className="text-xs text-stone-500">
                            {fmtRentang(b.waktuMulai, b.waktuSelesai)} · {b.tujuan}
                          </p>
                        </div>
                        <BadgeStatus status={b.status} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
