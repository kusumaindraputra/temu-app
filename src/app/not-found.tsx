import Link from "next/link";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <LogoMark size={56} />
      <h1 className="text-5xl font-bold tracking-tight text-stone-900">404</h1>
      <p className="text-stone-400">Halaman tidak ditemukan.</p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/bidang"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Ke Beranda Bidang
        </Link>
        <Link
          href="/pengelola"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          Ke Beranda Pengelola
        </Link>
      </div>
    </div>
  );
}
