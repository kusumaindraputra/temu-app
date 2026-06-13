import type { Metadata } from "next";
import FormLogin from "./form";

export const metadata: Metadata = {
  title: "Masuk — Booking Ruang Dinas Kesehatan",
};

export default function HalamanLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            DK
          </div>
          <h1 className="text-xl font-bold text-zinc-900">
            Booking Ruang Meeting
          </h1>
          <p className="text-sm text-zinc-500">Dinas Kesehatan</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <FormLogin />
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Gunakan akun bidang atau akun pengelola Anda.
        </p>
      </div>
    </div>
  );
}
