import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // --- Akun Admin & Pengelola ---
  await prisma.pengelola.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      nama: "Administrator",
      username: "admin",
      password: hash("admin123"),
      role: Role.ADMIN,
    },
  });

  await prisma.pengelola.upsert({
    where: { username: "pengelola" },
    update: {},
    create: {
      nama: "Pengelola Ruangan",
      username: "pengelola",
      password: hash("pengelola123"),
      role: Role.PENGELOLA,
    },
  });

  // --- Akun Bidang (contoh struktur Dinas Kesehatan) ---
  const bidangList = [
    { nama: "Sekretariat", username: "sekretariat" },
    { nama: "Bidang Kesehatan Masyarakat", username: "kesmas" },
    { nama: "Bidang Pencegahan & Pengendalian Penyakit", username: "p2p" },
    { nama: "Bidang Pelayanan Kesehatan", username: "yankes" },
    { nama: "Bidang Sumber Daya Kesehatan", username: "sdk" },
  ];
  for (const b of bidangList) {
    await prisma.bidang.upsert({
      where: { username: b.username },
      update: {},
      create: { nama: b.nama, username: b.username, password: hash("bidang123") },
    });
  }

  // --- Komponen (unit fisik terkecil) ---
  const komponenNama = ["RR-1", "RR-2", "Aula-1", "Aula-2"];
  const komponen: Record<string, number> = {};
  for (const nama of komponenNama) {
    const k = await prisma.komponen.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
    komponen[nama] = k.id;
  }

  // --- Ruangan (dengan komponennya) ---
  // Ruang biasa = 1 komponen. Aula bisa di-split jadi A & B, atau dipesan penuh.
  const ruanganSeed = [
    { nama: "Ruang Rapat 1", lokasi: "Lantai 1", kapasitas: 20, fasilitas: ["Proyektor", "AC"], komponen: ["RR-1"] },
    { nama: "Ruang Rapat 2", lokasi: "Lantai 2", kapasitas: 15, fasilitas: ["TV", "AC"], komponen: ["RR-2"] },
    { nama: "Aula A", lokasi: "Lantai 3", kapasitas: 80, fasilitas: ["Proyektor", "Sound System", "AC"], komponen: ["Aula-1"] },
    { nama: "Aula B", lokasi: "Lantai 3", kapasitas: 80, fasilitas: ["Proyektor", "Sound System", "AC"], komponen: ["Aula-2"] },
    { nama: "Aula Penuh (A+B)", lokasi: "Lantai 3", kapasitas: 160, fasilitas: ["Proyektor", "Sound System", "AC"], komponen: ["Aula-1", "Aula-2"] },
  ];

  for (const r of ruanganSeed) {
    // Hindari duplikasi saat seed diulang: cek berdasarkan nama
    const existing = await prisma.ruangan.findFirst({ where: { nama: r.nama } });
    if (existing) continue;
    await prisma.ruangan.create({
      data: {
        nama: r.nama,
        lokasi: r.lokasi,
        kapasitas: r.kapasitas,
        fasilitas: r.fasilitas,
        komponen: { connect: r.komponen.map((nama) => ({ id: komponen[nama] })) },
      },
    });
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
