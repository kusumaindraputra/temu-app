import { cookies } from "next/headers";
import { enkodeSesi, verifSesi, NAMA_COOKIE_SESI, type Sesi } from "@/lib/jwt";

export type { Sesi } from "@/lib/jwt";

const UMUR_DETIK = 60 * 60 * 12; // 12 jam

/** Membuat cookie sesi (login). */
export async function buatSesi(data: Sesi) {
  const token = await enkodeSesi(data);
  const c = await cookies();
  c.set(NAMA_COOKIE_SESI, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_DETIK,
    secure: process.env.NODE_ENV === "production",
  });
}

/** Membaca & memverifikasi sesi dari cookie. Null bila tidak login. */
export async function ambilSesi(): Promise<Sesi | null> {
  const c = await cookies();
  const token = c.get(NAMA_COOKIE_SESI)?.value;
  if (!token) return null;
  return verifSesi(token);
}

/** Menghapus cookie sesi (logout). */
export async function hapusSesi() {
  const c = await cookies();
  c.delete(NAMA_COOKIE_SESI);
}
