import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-xl font-bold text-white">
        DK
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-stone-900">404</h1>
      <p className="text-stone-400">Halaman tidak ditemukan.</p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/bidang"
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
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
