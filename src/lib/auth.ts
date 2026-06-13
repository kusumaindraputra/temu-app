import { redirect } from "next/navigation";
import { ambilSesi, type Sesi } from "@/lib/session";

/** Wajib sudah login. Mengarahkan ke /login bila belum. */
export async function wajibLogin(): Promise<Sesi> {
  const sesi = await ambilSesi();
  if (!sesi) redirect("/login");
  return sesi;
}

/** Wajib akun Bidang. */
export async function wajibBidang(): Promise<Sesi> {
  const sesi = await wajibLogin();
  if (sesi.tipe !== "BIDANG") redirect("/pengelola");
  return sesi;
}

/** Wajib akun Pengelola atau Admin. */
export async function wajibPengelola(): Promise<Sesi> {
  const sesi = await wajibLogin();
  if (sesi.tipe !== "PENGELOLA") redirect("/bidang");
  return sesi;
}

/** Wajib akun Admin. */
export async function wajibAdmin(): Promise<Sesi> {
  const sesi = await wajibPengelola();
  if (sesi.role !== "ADMIN") redirect("/pengelola");
  return sesi;
}
