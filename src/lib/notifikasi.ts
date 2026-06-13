import { db } from "@/lib/db";

export async function buatNotifikasi({
  bidangId,
  judul,
  pesan,
  bookingId,
}: {
  bidangId: number;
  judul: string;
  pesan: string;
  bookingId?: number;
}) {
  await db.notifikasi.create({
    data: { bidangId, judul, pesan, bookingId: bookingId ?? null },
  });
}
