import Link from "next/link";
import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import { cariBentrok, deskripsiBentrok } from "@/lib/booking";
import { fmtRentang } from "@/lib/format";
import BadgeStatus from "@/components/badge-status";
import KalenderBulanan, { type TandaiHari } from "@/components/kalender-bulanan";
import TimelineJadwal, { type RuanganSlot } from "@/components/timeline-jadwal";
import {
  bulanTahunJakarta,
  toJakartaDateStr,
  padDateStr,
  namaBulan,
  salamWaktu,
  hariIniJakarta,
} from "@/lib/jadwal";
import KartuPersetujuan, { type DataKartu } from "./kartu-persetujuan";

const PAGE_SIZE = 10;

function StatCard({
  label,
  nilai,
  sub,
  warna = "stone",
}: {
  label: string;
  nilai: number;
  sub?: string;
  warna?: "stone" | "brand" | "success" | "amber" | "red";
}) {
  const cls = {
    stone: "text-stone-900",
    brand: "text-brand-600",
    success: "text-success-600",
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

export default async function HalamanPersetujuan({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string; halaman?: string; tanggal?: string }>;
}) {
  const sesi = await wajibPengelola();
  const now = new Date();
  const { bulan: bJakarta, tahun: tJakarta } = bulanTahunJakarta();
  const sp = await searchParams;

  const bulan = Math.max(1, Math.min(12, Number(sp.bulan) || bJakarta));
  const tahun = Number(sp.tahun) || tJakarta;
  const halamanParam = Math.max(1, Number(sp.halaman) || 1);
  const tanggal =
    sp.tanggal && /^\d{4}-\d{2}-\d{2}$/.test(sp.tanggal)
      ? sp.tanggal
      : hariIniJakarta();

  const startBulan = new Date(`${padDateStr(tahun, bulan, 1)}T00:00:00+07:00`);
  const endBulan = new Date(
    new Date(
      `${padDateStr(bulan === 12 ? tahun + 1 : tahun, bulan === 12 ? 1 : bulan + 1, 1)}T00:00:00+07:00`,
    ).getTime() - 1,
  );

  const hariMulai = new Date(
    `${new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)}T00:00:00+07:00`,
  );
  const hariSelesai = new Date(hariMulai.getTime() + 86400_000 - 1);

  const timelineMulai = new Date(`${tanggal}T00:00:00+07:00`);
  const timelineSelesai = new Date(`${tanggal}T23:59:59+07:00`);

  const [
    menungguList,
    disetujuiHariIni,
    totalBulanIni,
    ruanganAktif,
    semuaRuangan,
    bookingHariIni,
    bookingKalender,
    upcomingCount,
    pastCount,
  ] = await Promise.all([
    db.booking.findMany({
      where: { status: "MENUNGGU" },
      orderBy: { waktuMulai: "asc" },
      include: {
        ruangan: { select: { nama: true, lokasi: true } },
        bidang: { select: { nama: true } },
      },
    }),
    db.booking.count({
      where: {
        status: "DISETUJUI",
        diprosesPada: { gte: hariMulai, lte: hariSelesai },
      },
    }),
    db.booking.count({
      where: {
        status: { in: ["DISETUJUI", "MENUNGGU"] },
        waktuMulai: { gte: startBulan, lte: endBulan },
      },
    }),
    db.ruangan.count({ where: { aktif: true } }),
    // Timeline
    db.ruangan.findMany({
      orderBy: { nama: "asc" },
      select: { id: true, nama: true, aktif: true },
    }),
    db.booking.findMany({
      where: {
        status: { in: ["DISETUJUI", "MENUNGGU"] },
        waktuMulai: { lt: timelineSelesai },
        waktuSelesai: { gt: timelineMulai },
      },
      include: { bidang: { select: { nama: true } } },
      orderBy: { waktuMulai: "asc" },
    }),
    db.booking.findMany({
      where: {
        status: { in: ["DISETUJUI", "MENUNGGU", "DITOLAK", "BATAL"] },
        waktuMulai: { gte: startBulan, lte: endBulan },
      },
      select: { waktuMulai: true, status: true },
    }),
    db.booking.count({ where: { waktuMulai: { gte: now } } }),
    db.booking.count({ where: { waktuMulai: { lt: now } } }),
  ]);

  const total = upcomingCount + pastCount;

  // Timeline slots
  const ruangan: RuanganSlot[] = semuaRuangan.map((r) => ({
    id: r.id,
    nama: r.nama,
    aktif: r.aktif,
    slots: bookingHariIni
      .filter((b) => b.ruanganId === r.id)
      .map((b) => ({
        id: b.id,
        waktuMulai: b.waktuMulai,
        waktuSelesai: b.waktuSelesai,
        bidangNama: b.bidang.nama,
        tujuan: b.tujuan,
        status: b.status as "DISETUJUI" | "MENUNGGU",
      })),
  }));

  // Calendar dots
  const tandai: TandaiHari = {};
  for (const b of bookingKalender) {
    const ds = toJakartaDateStr(b.waktuMulai);
    if (!tandai[ds]) tandai[ds] = { dots: [] };
    const dot =
      b.status === "DISETUJUI" ? "success" : b.status === "MENUNGGU" ? "amber" : "red";
    if (!tandai[ds].dots.includes(dot)) tandai[ds].dots.push(dot);
  }

  // Approval cards
  const kartu: DataKartu[] = await Promise.all(
    menungguList.map(async (b): Promise<DataKartu> => {
      const bentrok = await cariBentrok({
        ruanganId: b.ruanganId,
        mulai: b.waktuMulai,
        selesai: b.waktuSelesai,
        kecualiId: b.id,
      });
      return {
        id: b.id,
        ruanganNama: b.ruangan.nama,
        lokasi: b.ruangan.lokasi,
        bidangNama: b.bidang.nama,
        rentang: fmtRentang(b.waktuMulai, b.waktuSelesai),
        tujuan: b.tujuan,
        jumlahPeserta: b.jumlahPeserta,
        picNama: b.picNama,
        picHp: b.picHp,
        peringatanBentrok: bentrok.map(deskripsiBentrok),
      };
    }),
  );

  // Pagination
  const totalHalaman = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const halaman = Math.min(halamanParam, totalHalaman);
  const offset = (halaman - 1) * PAGE_SIZE;

  const jadwal = await ambilJadwalPengelola(now, offset, PAGE_SIZE, upcomingCount);

  const pageUrl = (h: number) => `/pengelola?bulan=${bulan}&tahun=${tahun}&halaman=${h}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Salam */}
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Perlu Disetujui"
          nilai={kartu.length}
          warna={kartu.length > 0 ? "amber" : "stone"}
          sub={kartu.length > 0 ? "menunggu tindakan" : "sudah bersih"}
        />
        <StatCard label="Disetujui Hari Ini" nilai={disetujuiHariIni} warna="success" />
        <StatCard label="Booking Bulan Ini" nilai={totalBulanIni} sub="disetujui + menunggu" />
        <StatCard label="Ruangan Aktif" nilai={ruanganAktif} sub="siap dibooking" />
      </div>

      {/* Approval queue */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-base font-semibold text-stone-900">Persetujuan Booking</h2>
          {kartu.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {kartu.length}
            </span>
          )}
        </div>
        {kartu.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center text-stone-400">
            Tidak ada permintaan yang menunggu.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {kartu.map((d) => (
              <KartuPersetujuan key={d.id} data={d} />
            ))}
          </ul>
        )}
      </section>

      {/* Kalender */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-stone-700">
          {namaBulan(bulan)} {tahun}
        </p>
        <KalenderBulanan
          bulan={bulan}
          tahun={tahun}
          tandai={tandai}
          jadwalHref={`/pengelola?bulan=${bulan}&tahun=${tahun}`}
          kalenderHref="/pengelola"
        />

      </div>

      {/* Timeline jadwal per ruangan */}
      <TimelineJadwal ruangan={ruangan} tanggal={tanggal} />

      {/* Jadwal semua booking */}
      <section>
        <h2 className="mb-4 text-base font-semibold text-stone-900">
          Jadwal Semua Booking
          <span className="ml-2 text-sm font-normal text-stone-400">({total})</span>
        </h2>

        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center text-stone-400">
            Belum ada booking.
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2.5">
              {jadwal.map((b) => (
                <li key={b.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-stone-900">{b.ruangan.nama}</h3>
                        <span className="text-stone-300">·</span>
                        <span className="text-sm text-stone-500">{b.bidang.nama}</span>
                      </div>
                      <p className="mt-1 text-sm text-stone-600">
                        {fmtRentang(b.waktuMulai, b.waktuSelesai)}
                      </p>
                      <p className="mt-0.5 text-sm text-stone-500">{b.tujuan}</p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {b.jumlahPeserta} peserta · {b.ruangan.lokasi}
                      </p>
                    </div>
                    <BadgeStatus status={b.status} />
                  </div>
                </li>
              ))}
            </ul>

            {totalHalaman > 1 && (
              <div className="mt-5 flex items-center justify-center gap-2">
                {halaman > 1 ? (
                  <Link
                    href={pageUrl(halaman - 1)}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
                  >
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="rounded-lg border border-stone-100 px-3 py-1.5 text-xs font-medium text-stone-300">
                    ← Sebelumnya
                  </span>
                )}
                <span className="text-xs text-stone-400">
                  {halaman} / {totalHalaman}
                </span>
                {halaman < totalHalaman ? (
                  <Link
                    href={pageUrl(halaman + 1)}
                    className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
                  >
                    Berikutnya →
                  </Link>
                ) : (
                  <span className="rounded-lg border border-stone-100 px-3 py-1.5 text-xs font-medium text-stone-300">
                    Berikutnya →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

async function ambilJadwalPengelola(
  now: Date,
  offset: number,
  take: number,
  upcomingCount: number,
) {
  const inc = {
    ruangan: { select: { nama: true, lokasi: true } },
    bidang: { select: { nama: true } },
  } as const;

  if (offset < upcomingCount) {
    const upcomingTake = Math.min(take, upcomingCount - offset);
    const upcoming = await db.booking.findMany({
      where: { waktuMulai: { gte: now } },
      orderBy: { waktuMulai: "asc" },
      skip: offset,
      take: upcomingTake,
      include: inc,
    });

    if (upcomingTake < take) {
      const past = await db.booking.findMany({
        where: { waktuMulai: { lt: now } },
        orderBy: { waktuMulai: "desc" },
        skip: 0,
        take: take - upcomingTake,
        include: inc,
      });
      return [...upcoming, ...past];
    }

    return upcoming;
  }

  return db.booking.findMany({
    where: { waktuMulai: { lt: now } },
    orderBy: { waktuMulai: "desc" },
    skip: offset - upcomingCount,
    take,
    include: inc,
  });
}
