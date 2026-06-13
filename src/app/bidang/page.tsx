import Link from "next/link";
import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";
import BadgeStatus from "@/components/badge-status";
import KalenderBulanan, { type TandaiHari } from "@/components/kalender-bulanan";
import { fmtRentang, fmtTanggal } from "@/lib/format";
import {
  bulanTahunJakarta,
  toJakartaDateStr,
  salamWaktu,
  padDateStr,
} from "@/lib/jadwal";
import { batalBooking } from "./booking/actions";

function StatCard({
  label,
  nilai,
  sub,
  warna = "stone",
}: {
  label: string;
  nilai: number;
  sub?: string;
  warna?: "stone" | "teal" | "amber" | "red";
}) {
  const cls = {
    stone: "text-stone-900",
    teal: "text-teal-600",
    amber: "text-amber-600",
    red: "text-red-500",
  }[warna];
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${cls}`}>{nilai}</p>
      {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}

export default async function BerandaBidang() {
  const sesi = await wajibBidang();
  const now = new Date();
  const { bulan, tahun } = bulanTahunJakarta();

  const startBulan = new Date(`${padDateStr(tahun, bulan, 1)}T00:00:00+07:00`);
  const endBulan = new Date(
    new Date(tahun, bulan, 1).getTime() - 1 + 7 * 3600 * 1000,
  );

  const [semuaBooking, bookingBulanIni] = await Promise.all([
    db.booking.findMany({
      where: { bidangId: sesi.id },
      orderBy: { waktuMulai: "desc" },
      include: { ruangan: { select: { nama: true, lokasi: true } } },
    }),
    db.booking.findMany({
      where: {
        bidangId: sesi.id,
        waktuMulai: { gte: startBulan, lte: endBulan },
      },
      select: { waktuMulai: true, status: true },
    }),
  ]);

  const total = semuaBooking.length;
  const menunggu = semuaBooking.filter((b) => b.status === "MENUNGGU").length;
  const disetujuiMendatang = semuaBooking.filter(
    (b) => b.status === "DISETUJUI" && b.waktuMulai > now,
  ).length;
  const batalDitolak = semuaBooking.filter(
    (b) => b.status === "BATAL" || b.status === "DITOLAK",
  ).length;

  const mendatang = semuaBooking
    .filter((b) => b.status === "DISETUJUI" && b.waktuMulai > now)
    .sort((a, b) => a.waktuMulai.getTime() - b.waktuMulai.getTime())
    .slice(0, 4);

  const statusDotMap = {
    DISETUJUI: "teal",
    MENUNGGU: "amber",
    DITOLAK: "red",
    BATAL: "red",
  } as const;

  const tandai: TandaiHari = {};
  for (const b of bookingBulanIni) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!tandai[ds]) tandai[ds] = { dots: [] };
    const dot = statusDotMap[b.status];
    if (!tandai[ds].dots.includes(dot)) tandai[ds].dots.push(dot);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Salam */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {salamWaktu()}, {sesi.nama}
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {new Date(Date.now() + 7 * 3600 * 1000).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            })}
          </p>
        </div>
        <Link
          href="/bidang/booking/baru"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          + Buat Booking
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Booking" nilai={total} sub="semua waktu" />
        <StatCard
          label="Menunggu"
          nilai={menunggu}
          warna="amber"
          sub={menunggu > 0 ? "perlu tindak lanjut" : "tidak ada"}
        />
        <StatCard
          label="Mendatang"
          nilai={disetujuiMendatang}
          warna="teal"
          sub="sudah disetujui"
        />
        <StatCard
          label="Batal / Ditolak"
          nilai={batalDitolak}
          warna={batalDitolak > 0 ? "red" : "stone"}
        />
      </div>

      {/* Kalender + Mendatang */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-700">Bulan Ini</span>
            <Link href="/bidang/kalender" className="text-xs text-teal-600 hover:underline">
              Lihat penuh →
            </Link>
          </div>
          <KalenderBulanan
            bulan={bulan}
            tahun={tahun}
            tandai={tandai}
            jadwalHref="/bidang/jadwal"
          />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-stone-700">Booking Mendatang</h2>
          {mendatang.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-stone-400">Tidak ada booking mendatang.</p>
              <Link
                href="/bidang/booking/baru"
                className="mt-2 text-xs font-medium text-teal-600 hover:underline"
              >
                Buat booking baru →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-stone-50">
              {mendatang.map((b) => (
                <li key={b.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <span className="text-xs font-bold leading-none">
                      {b.waktuMulai.toLocaleDateString("id-ID", {
                        day: "numeric",
                        timeZone: "Asia/Jakarta",
                      })}
                    </span>
                    <span className="mt-0.5 text-[10px] leading-none text-teal-500">
                      {b.waktuMulai.toLocaleDateString("id-ID", {
                        month: "short",
                        timeZone: "Asia/Jakarta",
                      })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">
                      {b.ruangan.nama}
                    </p>
                    <p className="text-xs text-stone-500">
                      {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                    </p>
                    <p className="truncate text-xs text-stone-400">{b.tujuan}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {mendatang.length > 0 && (
            <Link
              href="/bidang/kalender"
              className="mt-4 block text-center text-xs text-teal-600 hover:underline"
            >
              Lihat kalender lengkap →
            </Link>
          )}
        </div>
      </div>

      {/* Semua booking */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-stone-900">
          Semua Booking
          <span className="ml-2 text-sm font-normal text-stone-400">({total})</span>
        </h2>

        {semuaBooking.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center">
            <p className="text-stone-400">Belum ada booking.</p>
            <Link
              href="/bidang/booking/baru"
              className="mt-3 inline-block text-sm font-medium text-teal-600 hover:underline"
            >
              Buat booking pertama →
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {semuaBooking.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-stone-900">{b.ruangan.nama}</h3>
                      <span className="text-stone-200">·</span>
                      <span className="text-xs text-stone-400">{b.ruangan.lokasi}</span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">
                      {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                    </p>
                    <p className="mt-0.5 text-sm text-stone-500">{b.tujuan}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{b.jumlahPeserta} peserta</p>
                    {b.catatan && (
                      <p className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600">
                        Catatan pengelola: {b.catatan}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <BadgeStatus status={b.status} />
                    {b.status === "MENUNGGU" && (
                      <form action={batalBooking}>
                        <input type="hidden" name="id" value={b.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-50"
                        >
                          Batalkan
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
