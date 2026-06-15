"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";
import { cariBentrok, deskripsiBentrok } from "@/lib/booking";

const skema = z.object({
  ruanganId: z.coerce.number().int().positive("Ruangan wajib dipilih."),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi."),
  waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi."),
  tujuan: z.string().trim().min(3, "Tujuan rapat minimal 3 karakter."),
  jumlahPeserta: z.coerce.number().int().min(1, "Jumlah peserta minimal 1."),
  picNama: z.string().trim().min(2, "Nama PIC minimal 2 karakter."),
  picHp: z
    .string()
    .trim()
    .regex(/^08\d{8,11}$/, "Nomor HP harus diawali 08 dan minimal 10 digit."),
});

/** Nilai input dikembalikan agar form tidak ter-reset saat terjadi error. */
export type NilaiBooking = {
  ruanganId: string;
  waktuMulai: string;
  waktuSelesai: string;
  tujuan: string;
  jumlahPeserta: string;
  picNama: string;
  picHp: string;
};

export type BookingState = { error?: string; nilai?: NilaiBooking };

export async function buatBooking(
  _prev: BookingState,
  fd: FormData,
): Promise<BookingState> {
  const sesi = await wajibBidang();

  // Simpan input mentah agar bisa dikembalikan ke form bila gagal.
  const nilai: NilaiBooking = {
    ruanganId: String(fd.get("ruanganId") ?? ""),
    waktuMulai: String(fd.get("waktuMulai") ?? ""),
    waktuSelesai: String(fd.get("waktuSelesai") ?? ""),
    tujuan: String(fd.get("tujuan") ?? ""),
    jumlahPeserta: String(fd.get("jumlahPeserta") ?? ""),
    picNama: String(fd.get("picNama") ?? ""),
    picHp: String(fd.get("picHp") ?? ""),
  };
  const gagal = (error: string): BookingState => ({ error, nilai });

  const parsed = skema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    return gagal(parsed.error.issues[0]?.message ?? "Input tidak valid.");
  }
  const { ruanganId, waktuMulai, waktuSelesai, tujuan, jumlahPeserta, picNama, picHp } = parsed.data;

  // datetime-local menghasilkan "YYYY-MM-DDTHH:MM" — tanpa timezone.
  // Tambah ":00+07:00" agar server UTC tidak salah interpretasi.
  const toWIB = (s: string) => new Date(`${s}:00+07:00`);
  const mulai = toWIB(waktuMulai);
  const selesai = toWIB(waktuSelesai);
  if (Number.isNaN(mulai.getTime()) || Number.isNaN(selesai.getTime())) {
    return gagal("Format waktu tidak valid.");
  }
  if (selesai <= mulai) {
    return gagal("Waktu selesai harus setelah waktu mulai.");
  }
  if (mulai.getTime() < Date.now() - 60_000) {
    return gagal("Tidak bisa memesan untuk waktu yang sudah lewat.");
  }

  const ruangan = await db.ruangan.findUnique({ where: { id: ruanganId } });
  if (!ruangan || !ruangan.aktif) {
    return gagal("Ruangan tidak tersedia.");
  }
  if (jumlahPeserta > ruangan.kapasitas) {
    return gagal(
      `Jumlah peserta (${jumlahPeserta}) melebihi kapasitas ${ruangan.nama} (${ruangan.kapasitas}).`,
    );
  }

  // Tolak bila slot bentrok dengan booking yang sudah DISETUJUI
  // (overlap waktu + irisan komponen — termasuk kasus Aula split).
  const bentrok = await cariBentrok({ ruanganId, mulai, selesai });
  if (bentrok.length > 0) {
    return gagal(
      `Slot bentrok dengan booking yang sudah disetujui: ${deskripsiBentrok(bentrok[0])}. Silakan pilih waktu atau ruangan lain.`,
    );
  }

  await db.booking.create({
    data: {
      ruanganId,
      bidangId: sesi.id,
      waktuMulai: mulai,
      waktuSelesai: selesai,
      tujuan,
      jumlahPeserta,
      picNama,
      picHp,
    },
  });

  revalidatePath("/bidang");
  redirect("/bidang");
}

export type BatalState = { error?: string };

/** Membatalkan booking milik sendiri yang masih berstatus MENUNGGU. */
export async function batalBooking(
  _prev: BatalState,
  fd: FormData,
): Promise<BatalState> {
  const sesi = await wajibBidang();
  const id = Number(fd.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "ID booking tidak valid." };

  const result = await db.booking.updateMany({
    where: { id, bidangId: sesi.id, status: "MENUNGGU" },
    data: { status: "BATAL" },
  });

  if (result.count === 0) return { error: "Booking tidak dapat dibatalkan." };

  revalidatePath("/bidang");
  return {};
}
