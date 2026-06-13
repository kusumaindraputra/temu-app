import type { Metadata } from "next";
import FormLogin from "./form";

export const metadata: Metadata = {
  title: "Masuk — Booking Ruang Dinas Kesehatan",
};

export default function HalamanLogin() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[420px_1fr]">
      {/* Left: brand panel */}
      <div className="hidden flex-col justify-between bg-teal-600 p-12 lg:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-sm font-bold text-white">
          DK
        </div>

        <div>
          <h1 className="text-3xl font-bold leading-snug text-white">
            Booking Ruang Meeting
          </h1>
          <p className="mt-2 text-teal-200">Dinas Kesehatan</p>
          <div className="mt-10 space-y-3 text-sm text-teal-100/80">
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
              Kelola pemesanan ruang meeting
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
              Approval workflow real-time
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
              Jadwal visual & ketersediaan ruangan
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
              Notifikasi status booking
            </div>
          </div>
        </div>

        <p className="text-xs text-teal-300/60">© 2026 Dinas Kesehatan</p>
      </div>

      {/* Right: form */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:min-h-0">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
              DK
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Booking Ruang Meeting</p>
              <p className="text-xs text-stone-400">Dinas Kesehatan</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              Selamat datang
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Masuk untuk melanjutkan
            </p>
          </div>

          <FormLogin />

          <p className="mt-6 text-center text-xs text-stone-400">
            Gunakan akun bidang atau akun pengelola Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
