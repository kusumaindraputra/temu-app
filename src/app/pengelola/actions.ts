"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibPengelola } from "@/lib/auth";
import { cariBentrok, deskripsiBentrok } from "@/lib/booking";
import { fmtRentang } from "@/lib/format";
import { buatNotifikasi } from "@/lib/notifikasi";

export type ProsesState = { error?: string; ok?: string };

export async function prosesBooking(
  _prev: ProsesState,
  fd: FormData,
): Promise<ProsesState> {
  const sesi = await wajibPengelola();

  const id = Number(fd.get("id"));
  const aksi = String(fd.get("aksi") ?? "");
  const catatan = String(fd.get("catatan") ?? "").trim() || null;

  if (!Number.isInteger(id) || id <= 0) return { error: "Booking tidak valid." };

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      ruangan: { select: { nama: true } },
    },
  });
  if (!booking) return { error: "Booking tidak ditemukan." };
  if (booking.status !== "MENUNGGU") {
    return { error: "Booking ini sudah diproses sebelumnya." };
  }

  const rentang = fmtRentang(booking.waktuMulai, booking.waktuSelesai);

  if (aksi === "tolak") {
    await db.booking.update({
      where: { id },
      data: {
        status: "DITOLAK",
        catatan,
        diprosesOlehId: sesi.id,
        diprosesPada: new Date(),
      },
    });
    await buatNotifikasi({
      bidangId: booking.bidangId,
      judul: "Booking Ditolak",
      pesan: `Booking ${booking.ruangan.nama} (${rentang}) ditolak.${catatan ? ` Catatan: ${catatan}` : ""}`,
      bookingId: booking.id,
    });
    revalidatePath("/pengelola");
    revalidatePath("/pengelola/riwayat");
    return { ok: "Booking ditolak." };
  }

  if (aksi === "setujui") {
    const bentrok = await cariBentrok({
      ruanganId: booking.ruanganId,
      mulai: booking.waktuMulai,
      selesai: booking.waktuSelesai,
      kecualiId: id,
    });
    if (bentrok.length > 0) {
      return {
        error: `Tidak bisa disetujui — bentrok dengan: ${deskripsiBentrok(bentrok[0])}.`,
      };
    }
    await db.booking.update({
      where: { id },
      data: {
        status: "DISETUJUI",
        catatan,
        diprosesOlehId: sesi.id,
        diprosesPada: new Date(),
      },
    });
    await buatNotifikasi({
      bidangId: booking.bidangId,
      judul: "Booking Disetujui",
      pesan: `Booking ${booking.ruangan.nama} (${rentang}) telah disetujui.${catatan ? ` Catatan: ${catatan}` : ""}`,
      bookingId: booking.id,
    });
    revalidatePath("/pengelola");
    revalidatePath("/pengelola/riwayat");
    return { ok: "Booking disetujui." };
  }

  return { error: "Aksi tidak dikenal." };
}
