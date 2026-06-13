"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";

const skemaAkun = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi."),
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

export type AkunState = { error?: string; nilai?: { nama: string; username: string } };

function bacaNilai(fd: FormData) {
  return {
    nama: String(fd.get("nama") ?? ""),
    username: String(fd.get("username") ?? ""),
  };
}

export async function buatAkunBidang(
  _prev: AkunState,
  fd: FormData,
): Promise<AkunState> {
  await wajibAdmin();

  const nilai = bacaNilai(fd);
  const gagal = (error: string): AkunState => ({ error, nilai });

  const parsed = skemaAkun.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return gagal(parsed.error.issues[0]?.message ?? "Input tidak valid.");

  const ada = await db.bidang.findUnique({ where: { username: parsed.data.username } });
  if (ada) return gagal("Username sudah dipakai.");

  await db.bidang.create({
    data: {
      nama: parsed.data.nama,
      username: parsed.data.username,
      password: await hash(parsed.data.password, 10),
    },
  });

  revalidatePath("/pengelola/akun");
  redirect("/pengelola/akun");
}

export async function buatAkunPengelola(
  _prev: AkunState,
  fd: FormData,
): Promise<AkunState> {
  await wajibAdmin();

  const nilai = bacaNilai(fd);
  const gagal = (error: string): AkunState => ({ error, nilai });

  const parsed = skemaAkun.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return gagal(parsed.error.issues[0]?.message ?? "Input tidak valid.");

  const role = fd.get("role") === "ADMIN" ? ("ADMIN" as const) : ("PENGELOLA" as const);

  const ada = await db.pengelola.findUnique({ where: { username: parsed.data.username } });
  if (ada) return gagal("Username sudah dipakai.");

  await db.pengelola.create({
    data: {
      nama: parsed.data.nama,
      username: parsed.data.username,
      password: await hash(parsed.data.password, 10),
      role,
    },
  });

  revalidatePath("/pengelola/akun");
  redirect("/pengelola/akun");
}

export type ResetState = { error?: string };

export async function resetPasswordBidang(
  _prev: ResetState,
  fd: FormData,
): Promise<ResetState> {
  await wajibAdmin();

  const id = Number(fd.get("id"));
  const password = String(fd.get("password") ?? "");
  if (password.length < 6) return { error: "Password minimal 6 karakter." };

  await db.bidang.update({
    where: { id },
    data: { password: await hash(password, 10) },
  });

  revalidatePath("/pengelola/akun");
  redirect("/pengelola/akun");
}

export async function resetPasswordPengelola(
  _prev: ResetState,
  fd: FormData,
): Promise<ResetState> {
  await wajibAdmin();

  const id = Number(fd.get("id"));
  const password = String(fd.get("password") ?? "");
  if (password.length < 6) return { error: "Password minimal 6 karakter." };

  await db.pengelola.update({
    where: { id },
    data: { password: await hash(password, 10) },
  });

  revalidatePath("/pengelola/akun");
  redirect("/pengelola/akun");
}

export async function toggleAktifBidang(fd: FormData) {
  await wajibAdmin();
  const id = Number(fd.get("id"));
  const aktif = fd.get("aktif") === "true";
  if (!id) return;

  await db.bidang.update({ where: { id }, data: { aktif: !aktif } });
  revalidatePath("/pengelola/akun");
}

export async function toggleAktifPengelola(fd: FormData) {
  const sesi = await wajibAdmin();
  const id = Number(fd.get("id"));
  const aktif = fd.get("aktif") === "true";
  if (!id || id === sesi.id) return; // tidak bisa nonaktifkan diri sendiri

  await db.pengelola.update({ where: { id }, data: { aktif: !aktif } });
  revalidatePath("/pengelola/akun");
}
