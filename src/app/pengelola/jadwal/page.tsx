import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import { hariIniJakarta } from "@/lib/jadwal";
import TimelineJadwal, { type RuanganSlot } from "@/components/timeline-jadwal";

export default async function HalamanJadwalPengelola({
  searchParams,
}: {
  searchParams: Promise<{ tanggal?: string }>;
}) {
  await wajibPengelola();

  const { tanggal: tParam } = await searchParams;
  const tanggal = tParam && /^\d{4}-\d{2}-\d{2}$/.test(tParam) ? tParam : hariIniJakarta();

  const hariMulai = new Date(`${tanggal}T00:00:00+07:00`);
  const hariSelesai = new Date(`${tanggal}T23:59:59+07:00`);

  const [semuaRuangan, bookings] = await Promise.all([
    db.ruangan.findMany({ orderBy: { nama: "asc" }, select: { id: true, nama: true, aktif: true } }),
    db.booking.findMany({
      where: {
        status: { in: ["DISETUJUI", "MENUNGGU"] },
        waktuMulai: { lt: hariSelesai },
        waktuSelesai: { gt: hariMulai },
      },
      include: {
        bidang: { select: { nama: true } },
      },
      orderBy: { waktuMulai: "asc" },
    }),
  ]);

  const ruangan: RuanganSlot[] = semuaRuangan.map((r) => ({
    id: r.id,
    nama: r.nama,
    aktif: r.aktif,
    slots: bookings
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Jadwal Ruangan</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Booking disetujui <span className="font-medium text-teal-600">(hijau)</span> dan menunggu persetujuan{" "}
          <span className="font-medium text-amber-600">(kuning)</span>.
        </p>
      </div>
      <TimelineJadwal ruangan={ruangan} tanggal={tanggal} baseHref="/pengelola/jadwal" />
    </div>
  );
}
