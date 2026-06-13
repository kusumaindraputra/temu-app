import { SignJWT, jwtVerify } from "jose";

// Modul ini hanya bergantung pada `jose` (tanpa next/headers),
// supaya bisa dipakai baik di Server Components/Actions maupun di proxy.ts.

export const NAMA_COOKIE_SESI = "sesi";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export type TipeAkun = "BIDANG" | "PENGELOLA";
export type PeranPengelola = "PENGELOLA" | "ADMIN";

export interface Sesi {
  id: number;
  nama: string;
  username: string;
  tipe: TipeAkun;
  /** Hanya terisi untuk akun bertipe PENGELOLA. */
  role?: PeranPengelola;
}

export async function enkodeSesi(data: Sesi): Promise<string> {
  return new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export async function verifSesi(token: string): Promise<Sesi | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Sesi;
  } catch {
    return null;
  }
}
