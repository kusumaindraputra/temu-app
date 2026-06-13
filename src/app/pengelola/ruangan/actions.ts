"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";

const skema = z.object({
  nama: z.string().trim().min(1, "Nama ruangan wajib diisi."),
  lokasi: z.string().trim().min(1, "Lokasi wajib diisi."),
  kapasitas: z.coerce.number().int().min(1, "Kapasitas minimal 1."),
  fasilitas: z.string().trim(),
});

export type NilaiRuangan = {
  nama: string;
  lokasi: string;
  kapasitas: string;
  fasilitas: string;
};

export type RuanganState = { error?: string; nilai?: NilaiRuangan };

function parseFasilitas(raw: string): string[] {
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function bacaNilai(fd: FormData): NilaiRuangan {
  return {
    nama: String(fd.get("nama") ?? ""),
    lokasi: String(fd.get("lokasi") ?? ""),
    kapasitas: String(fd.get("kapasitas") ?? ""),
    fasilitas: String(fd.get("fasilitas") ?? ""),
  };
}

export async function buatRuangan(
  _prev: RuanganState,
  fd: FormData,
): Promise<RuanganState> {
  await wajibAdmin();

  const nilai = bacaNilai(fd);
  const gagal = (error: string): RuanganState => ({ error, nilai });

  const parsed = skema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return gagal(parsed.error.issues[0]?.message ?? "Input tidak valid.");

  const komponenIds = fd.getAll("komponenId").map(Number).filter((n) => n > 0);
  if (komponenIds.length === 0) return gagal("Pilih minimal satu komponen.");

  await db.ruangan.create({
    data: {
      nama: parsed.data.nama,
      lokasi: parsed.data.lokasi,
      kapasitas: parsed.data.kapasitas,
      fasilitas: parseFasilitas(parsed.data.fasilitas),
      komponen: { connect: komponenIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/pengelola/ruangan");
  redirect("/pengelola/ruangan");
}

export async function ubahRuangan(
  _prev: RuanganState,
  fd: FormData,
): Promise<RuanganState> {
  await wajibAdmin();

  const id = Number(fd.get("id"));
  const nilai = bacaNilai(fd);
  const gagal = (error: string): RuanganState => ({ error, nilai });

  const parsed = skema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return gagal(parsed.error.issues[0]?.message ?? "Input tidak valid.");

  const komponenIds = fd.getAll("komponenId").map(Number).filter((n) => n > 0);
  if (komponenIds.length === 0) return gagal("Pilih minimal satu komponen.");

  const aktif = fd.get("aktif") === "true";

  await db.ruangan.update({
    where: { id },
    data: {
      nama: parsed.data.nama,
      lokasi: parsed.data.lokasi,
      kapasitas: parsed.data.kapasitas,
      fasilitas: parseFasilitas(parsed.data.fasilitas),
      aktif,
      komponen: { set: komponenIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/pengelola/ruangan");
  redirect("/pengelola/ruangan");
}

export async function toggleAktifRuangan(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  const aktif = fd.get("aktif") === "true";
  if (!id) return;

  await db.ruangan.update({ where: { id }, data: { aktif: !aktif } });
  revalidatePath("/pengelola/ruangan");
}

export async function buatKomponen(fd: FormData): Promise<{ error?: string }> {
  await wajibAdmin();
  const nama = String(fd.get("nama") ?? "").trim();
  if (!nama) return { error: "Nama komponen wajib diisi." };

  const ada = await db.komponen.findUnique({ where: { nama } });
  if (ada) return { error: "Komponen dengan nama tersebut sudah ada." };

  await db.komponen.create({ data: { nama } });
  revalidatePath("/pengelola/ruangan");
  return {};
}

export async function hapusKomponen(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  if (!id) return;

  // Hanya hapus jika tidak dipakai ruangan mana pun.
  const dipakai = await db.komponen.findUnique({
    where: { id },
    include: { ruangan: { take: 1 } },
  });
  if (!dipakai || dipakai.ruangan.length > 0) return;

  await db.komponen.delete({ where: { id } });
  revalidatePath("/pengelola/ruangan");
}
