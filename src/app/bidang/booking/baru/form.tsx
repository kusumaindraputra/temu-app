"use client";

import { useActionState } from "react";
import Link from "next/link";
import { buatBooking, type BookingState } from "../actions";

type RuanganOpsi = {
  id: number;
  nama: string;
  lokasi: string;
  kapasitas: number;
  fasilitas: string[];
};

const kondisiAwal: BookingState = {};

export default function FormBooking({ ruangan }: { ruangan: RuanganOpsi[] }) {
  const [state, formAction, pending] = useActionState(buatBooking, kondisiAwal);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ruanganId" className="text-sm font-medium text-zinc-700">
          Ruangan
        </label>
        <select
          key={state.nilai?.ruanganId ?? ""}
          id="ruanganId"
          name="ruanganId"
          required
          defaultValue={state.nilai?.ruanganId ?? ""}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        >
          <option value="" disabled>
            — Pilih ruangan —
          </option>
          {ruangan.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nama} · {r.lokasi} · kap. {r.kapasitas}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="waktuMulai" className="text-sm font-medium text-zinc-700">
            Waktu mulai
          </label>
          <input
            id="waktuMulai"
            name="waktuMulai"
            type="datetime-local"
            required
            defaultValue={state.nilai?.waktuMulai ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="waktuSelesai" className="text-sm font-medium text-zinc-700">
            Waktu selesai
          </label>
          <input
            id="waktuSelesai"
            name="waktuSelesai"
            type="datetime-local"
            required
            defaultValue={state.nilai?.waktuSelesai ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tujuan" className="text-sm font-medium text-zinc-700">
          Tujuan / agenda rapat
        </label>
        <input
          id="tujuan"
          name="tujuan"
          type="text"
          required
          defaultValue={state.nilai?.tujuan ?? ""}
          placeholder="mis. Rapat koordinasi program imunisasi"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="jumlahPeserta" className="text-sm font-medium text-zinc-700">
          Jumlah peserta
        </label>
        <input
          id="jumlahPeserta"
          name="jumlahPeserta"
          type="number"
          min={1}
          required
          defaultValue={state.nilai?.jumlahPeserta ?? "1"}
          className="w-32 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Ajukan Booking"}
        </button>
        <Link
          href="/bidang"
          className="rounded-md px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Batal
        </Link>
      </div>

      <p className="text-xs text-zinc-500">
        Booking akan berstatus <b>Menunggu</b> hingga disetujui pengelola.
        Belum yakin waktunya? Cek{" "}
        <a href="/bidang/jadwal" className="font-medium text-teal-600 hover:underline">
          jadwal ruangan
        </a>{" "}
        terlebih dahulu.
      </p>
    </form>
  );
}
