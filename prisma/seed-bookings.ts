import { PrismaClient, StatusBooking } from "@prisma/client";

const prisma = new PrismaClient();

function tgl(offsetHari: number, jamMulai: number, jamSelesai: number) {
  const d = new Date("2026-06-15T00:00:00+07:00");
  d.setDate(d.getDate() + offsetHari);
  const mulai = new Date(d);
  mulai.setHours(jamMulai, 0, 0, 0);
  const selesai = new Date(d);
  selesai.setHours(jamSelesai, 0, 0, 0);
  return { waktuMulai: mulai, waktuSelesai: selesai };
}

async function main() {
  const bidang = await prisma.bidang.findMany({ orderBy: { id: "asc" } });
  const ruangan = await prisma.ruangan.findMany({ orderBy: { id: "asc" } });
  const pengelola = await prisma.pengelola.findFirst({ where: { role: "PENGELOLA" } });

  const b = (username: string) => bidang.find((x) => x.username === username)!;
  const r = (nama: string) => ruangan.find((x) => x.nama === nama)!;

  const diproses = pengelola
    ? { diprosesOlehId: pengelola.id, diprosesPada: new Date() }
    : {};

  const data: Parameters<typeof prisma.booking.create>[0]["data"][] = [
    // ───── MINGGU LALU (sudah lewat) ─────
    {
      ...tgl(-7, 8, 10),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("kesmas").id,
      tujuan: "Rapat Evaluasi Program KIA Triwulan II",
      jumlahPeserta: 15,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(-7, 13, 15),
      ruanganId: r("Ruang Rapat 2").id,
      bidangId: b("p2p").id,
      tujuan: "Koordinasi Surveilans Penyakit Menular",
      jumlahPeserta: 10,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(-6, 9, 11),
      ruanganId: r("Aula A").id,
      bidangId: b("sekretariat").id,
      tujuan: "Sosialisasi Peraturan Kepegawaian Terbaru",
      jumlahPeserta: 60,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(-5, 10, 12),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("yankes").id,
      tujuan: "Review Capaian SPM Bidang Kesehatan",
      jumlahPeserta: 12,
      status: StatusBooking.DITOLAK,
      catatan: "Jadwal bentrok dengan kegiatan Kepala Dinas",
      ...diproses,
    },
    {
      ...tgl(-4, 8, 17),
      ruanganId: r("Aula Penuh (A+B)").id,
      bidangId: b("sekretariat").id,
      tujuan: "Musrenbang Kesehatan Kabupaten Bogor 2026",
      jumlahPeserta: 140,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(-3, 13, 15),
      ruanganId: r("Ruang Rapat 2").id,
      bidangId: b("sdk").id,
      tujuan: "Rapat Perencanaan Pengadaan Alat Kesehatan",
      jumlahPeserta: 8,
      status: StatusBooking.BATAL,
      catatan: "Dibatalkan oleh bidang karena narasumber berhalangan",
      ...diproses,
    },
    {
      ...tgl(-2, 9, 11),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("p2p").id,
      tujuan: "Briefing Tim Investigasi KLB DBD",
      jumlahPeserta: 18,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(-1, 10, 12),
      ruanganId: r("Aula B").id,
      bidangId: b("kesmas").id,
      tujuan: "Pelatihan Kader Posyandu Kecamatan Bogor Tengah",
      jumlahPeserta: 55,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },

    // ───── HARI INI (2026-06-15) ─────
    {
      ...tgl(0, 8, 10),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("sekretariat").id,
      tujuan: "Apel dan Koordinasi Pagi Seluruh Bidang",
      jumlahPeserta: 20,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(0, 10, 12),
      ruanganId: r("Aula A").id,
      bidangId: b("yankes").id,
      tujuan: "Workshop Implementasi Rekam Medis Elektronik",
      jumlahPeserta: 70,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(0, 13, 15),
      ruanganId: r("Ruang Rapat 2").id,
      bidangId: b("p2p").id,
      tujuan: "Rapat Lintas Sektor Penanganan TB",
      jumlahPeserta: 14,
      status: StatusBooking.MENUNGGU,
    },
    {
      ...tgl(0, 15, 16),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("sdk").id,
      tujuan: "Diskusi Rencana Aksi Ketenagaan 2027",
      jumlahPeserta: 10,
      status: StatusBooking.MENUNGGU,
    },

    // ───── BESOK & MINGGU DEPAN ─────
    {
      ...tgl(1, 9, 11),
      ruanganId: r("Ruang Rapat 2").id,
      bidangId: b("kesmas").id,
      tujuan: "Rapat Koordinasi Program Gizi Masyarakat",
      jumlahPeserta: 12,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(1, 13, 16),
      ruanganId: r("Aula B").id,
      bidangId: b("sekretariat").id,
      tujuan: "Bimbingan Teknis Pengelolaan Keuangan Daerah",
      jumlahPeserta: 65,
      status: StatusBooking.MENUNGGU,
    },
    {
      ...tgl(2, 8, 10),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("yankes").id,
      tujuan: "Monitoring Akreditasi Puskesmas Kecamatan Ciawi",
      jumlahPeserta: 15,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(3, 9, 12),
      ruanganId: r("Aula Penuh (A+B)").id,
      bidangId: b("p2p").id,
      tujuan: "Pelatihan Surveilans Berbasis Masyarakat",
      jumlahPeserta: 120,
      status: StatusBooking.MENUNGGU,
    },
    {
      ...tgl(4, 10, 12),
      ruanganId: r("Ruang Rapat 2").id,
      bidangId: b("sdk").id,
      tujuan: "Rapat Evaluasi Distribusi Obat Puskesmas",
      jumlahPeserta: 9,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(5, 8, 17),
      ruanganId: r("Aula A").id,
      bidangId: b("sekretariat").id,
      tujuan: "Rapat Kerja Tahunan Dinkes Kabupaten Bogor",
      jumlahPeserta: 75,
      status: StatusBooking.DISETUJUI,
      ...diproses,
    },
    {
      ...tgl(7, 9, 11),
      ruanganId: r("Ruang Rapat 1").id,
      bidangId: b("kesmas").id,
      tujuan: "Koordinasi Program Kesehatan Ibu & Anak",
      jumlahPeserta: 16,
      status: StatusBooking.MENUNGGU,
    },
    {
      ...tgl(8, 13, 15),
      ruanganId: r("Aula B").id,
      bidangId: b("yankes").id,
      tujuan: "Sosialisasi Standar Pelayanan Minimal (SPM) 2026",
      jumlahPeserta: 50,
      status: StatusBooking.MENUNGGU,
    },
  ];

  let created = 0;
  for (const d of data) {
    await prisma.booking.create({ data: d as never });
    created++;
  }

  // Notifikasi untuk beberapa booking yang diproses
  const disetujuiBookings = await prisma.booking.findMany({
    where: { status: { in: [StatusBooking.DISETUJUI, StatusBooking.DITOLAK, StatusBooking.BATAL] } },
    include: { ruangan: true, bidang: true },
    take: 8,
  });

  for (const booking of disetujuiBookings) {
    const approved = booking.status === StatusBooking.DISETUJUI;
    const ditolak = booking.status === StatusBooking.DITOLAK;
    await prisma.notifikasi.create({
      data: {
        bidangId: booking.bidangId,
        bookingId: booking.id,
        judul: approved
          ? "Booking Disetujui"
          : ditolak
          ? "Booking Ditolak"
          : "Booking Dibatalkan",
        pesan: approved
          ? `Booking "${booking.tujuan}" di ${booking.ruangan.nama} telah disetujui.`
          : ditolak
          ? `Booking "${booking.tujuan}" di ${booking.ruangan.nama} ditolak. ${booking.catatan ?? ""}`
          : `Booking "${booking.tujuan}" di ${booking.ruangan.nama} dibatalkan.`,
        sudahDibaca: Math.random() > 0.5,
      },
    });
  }

  console.log(`Seed booking selesai: ${created} booking, ${disetujuiBookings.length} notifikasi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
