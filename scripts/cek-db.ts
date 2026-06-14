import { db } from "../src/lib/db";
async function main() {
  const rows = await db.booking.findMany({
    where: { waktuMulai: { gte: new Date("2098-01-01") } },
    include: { ruangan: { select: { nama: true } } },
  });
  console.log("Booking tahun 2099:", rows.length);
  for (const r of rows) {
    console.log(`  id=${r.id} ${r.ruangan.nama} mulai=${r.waktuMulai.toISOString()} selesai=${r.waktuSelesai.toISOString()} tujuan="${r.tujuan}"`);
  }
  await db.$disconnect();
}
main();
