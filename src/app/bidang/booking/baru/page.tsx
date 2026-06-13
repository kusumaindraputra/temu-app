import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";
import FormBooking from "./form";

export default async function HalamanBuatBooking() {
  await wajibBidang();

  const ruangan = await db.ruangan.findMany({
    where: { aktif: true },
    orderBy: { nama: "asc" },
    select: { id: true, nama: true, lokasi: true, kapasitas: true, fasilitas: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900">Buat Booking</h1>
      <p className="mb-6 mt-1 text-sm text-stone-400">
        Ajukan pemesanan ruang meeting. Permintaan akan ditinjau pengelola.
      </p>
      <FormBooking ruangan={ruangan} />
    </div>
  );
}
