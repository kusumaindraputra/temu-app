import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-bold text-white">
        DK
      </div>
      <h1 className="text-4xl font-bold text-zinc-900">404</h1>
      <p className="text-zinc-500">Halaman tidak ditemukan.</p>
      <div className="flex gap-3">
        <Link
          href="/bidang"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Ke Beranda Bidang
        </Link>
        <Link
          href="/pengelola"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Ke Beranda Pengelola
        </Link>
      </div>
    </div>
  );
}
