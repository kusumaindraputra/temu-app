import { NextResponse, type NextRequest } from "next/server";
import { verifSesi, NAMA_COOKIE_SESI } from "@/lib/jwt";

// Pengganti `middleware` di Next.js 16 (berjalan di runtime nodejs).
// Hanya proteksi "optimistic" berbasis cookie sesi; pengecekan otoritatif
// tetap dilakukan di Server Components/Actions via lib/auth.ts.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(NAMA_COOKIE_SESI)?.value;
  const sesi = token ? await verifSesi(token) : null;

  // Halaman login: kalau sudah login, arahkan ke dashboard sesuai tipe.
  if (pathname === "/login") {
    if (sesi) {
      const tujuan = sesi.tipe === "BIDANG" ? "/bidang" : "/pengelola";
      return NextResponse.redirect(new URL(tujuan, request.url));
    }
    return NextResponse.next();
  }

  const areaBidang = pathname.startsWith("/bidang");
  const areaPengelola = pathname.startsWith("/pengelola");

  // Route terproteksi tapi belum login.
  if ((areaBidang || areaPengelola) && !sesi) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Pisahkan area sesuai tipe akun.
  if (areaBidang && sesi?.tipe !== "BIDANG") {
    return NextResponse.redirect(new URL("/pengelola", request.url));
  }
  if (areaPengelola && sesi?.tipe !== "PENGELOLA") {
    return NextResponse.redirect(new URL("/bidang", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan untuk semua route kecuali aset statis.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
