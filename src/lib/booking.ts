import { db } from "@/lib/db";
import { fmtRentang } from "@/lib/format";

export type BookingBentrok = {
  id: number;
  ruanganNama: string;
  bidangNama: string;
  waktuMulai: Date;
  waktuSelesai: Date;
};

/**
 * Mencari booking DISETUJUI yang bentrok dengan slot yang diminta.
 *
 * Aturan bentrok: waktu overlap DAN komponen ruangan beririsan.
 * Ini menangani kasus Aula yang bisa di-split:
 * - "Aula Penuh" {Aula-1, Aula-2} bentrok dengan "Aula A" {Aula-1} maupun "Aula B" {Aula-2}.
 * - "Aula A" {Aula-1} dan "Aula B" {Aula-2} TIDAK bentrok (boleh bersamaan).
 */
export async function cariBentrok(params: {
  ruanganId: number;
  mulai: Date;
  selesai: Date;
  kecualiId?: number;
}): Promise<BookingBentrok[]> {
  const { ruanganId, mulai, selesai, kecualiId } = params;

  const ruangan = await db.ruangan.findUnique({
    where: { id: ruanganId },
    include: { komponen: { select: { id: true } } },
  });
  if (!ruangan) return [];
  const komponenIds = ruangan.komponen.map((k) => k.id);
  if (komponenIds.length === 0) return [];

  const rows = await db.booking.findMany({
    where: {
      status: "DISETUJUI",
      ...(kecualiId ? { id: { not: kecualiId } } : {}),
      // Overlap waktu: existing.mulai < diminta.selesai DAN existing.selesai > diminta.mulai
      waktuMulai: { lt: selesai },
      waktuSelesai: { gt: mulai },
      // Irisan komponen
      ruangan: { komponen: { some: { id: { in: komponenIds } } } },
    },
    include: {
      ruangan: { select: { nama: true } },
      bidang: { select: { nama: true } },
    },
    orderBy: { waktuMulai: "asc" },
  });

  return rows.map((b) => ({
    id: b.id,
    ruanganNama: b.ruangan.nama,
    bidangNama: b.bidang.nama,
    waktuMulai: b.waktuMulai,
    waktuSelesai: b.waktuSelesai,
  }));
}

export function deskripsiBentrok(b: BookingBentrok): string {
  return `${b.ruanganNama} — ${b.bidangNama} (${fmtRentang(b.waktuMulai, b.waktuSelesai)})`;
}
