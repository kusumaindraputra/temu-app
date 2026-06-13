import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import { cariBentrok, deskripsiBentrok } from "@/lib/booking";
import { fmtRentang } from "@/lib/format";
import {
  bulanTahunJakarta,
  padDateStr,
  salamWaktu,
} from "@/lib/jadwal";
import KartuPersetujuan, { type DataKartu } from "./kartu-persetujuan";

function StatCard({
  label,
  nilai,
  sub,
  warna = "zinc",
}: {
  label: string;
  nilai: number;
  sub?: string;
  warna?: "zinc" | "teal" | "amber" | "red";
}) {
  const cls = {
    zinc: "text-zinc-900",
    teal: "text-teal-600",
    amber: "text-amber-600",
    red: "text-red-500",
  }[warna];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${cls}`}>{nilai}</p>
      {sub && <p className="mt-1 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

export default async function HalamanPersetujuan() {
  const sesi = await wajibPengelola();

  const { bulan, tahun } = bulanTahunJakarta();
  const startBulan = new Date(`${padDateStr(tahun, bulan, 1)}T00:00:00+07:00`);
  const endBulan = new Date(new Date(tahun, bulan, 1).getTime() - 1);

  const now = new Date();
  const hariMulai = new Date(
    `${new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)}T00:00:00+07:00`,
  );
  const hariSelesai = new Date(hariMulai.getTime() + 86400_000 - 1);

  const [menungguList, disetujuiHariIni, totalBulanIni, ruanganAktif] =
    await Promise.all([
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
    ]);

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
        peringatanBentrok: bentrok.map(deskripsiBentrok),
      };
    }),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Salam */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          {salamWaktu()}, {sesi.nama}!
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Perlu Disetujui"
          nilai={kartu.length}
          warna={kartu.length > 0 ? "amber" : "zinc"}
          sub={kartu.length > 0 ? "menunggu tindakan" : "sudah bersih"}
        />
        <StatCard
          label="Disetujui Hari Ini"
          nilai={disetujuiHariIni}
          warna="teal"
        />
        <StatCard
          label="Booking Bulan Ini"
          nilai={totalBulanIni}
          sub="disetujui + menunggu"
        />
        <StatCard
          label="Ruangan Aktif"
          nilai={ruanganAktif}
          sub="siap dibooking"
        />
      </div>

      {/* Approval queue */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Persetujuan Booking
          {kartu.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-700">
              {kartu.length}
            </span>
          )}
        </h2>

        {kartu.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-600">
            Tidak ada permintaan yang menunggu. 🎉
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {kartu.map((d) => (
              <KartuPersetujuan key={d.id} data={d} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
