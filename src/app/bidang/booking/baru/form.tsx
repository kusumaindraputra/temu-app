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

const inputCls =
  "rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

export default function FormBooking({ ruangan }: { ruangan: RuanganOpsi[] }) {
  const [state, formAction, pending] = useActionState(buatBooking, kondisiAwal);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ruanganId" className="text-sm font-medium text-stone-700">
          Ruangan
        </label>
        <select
          key={state.nilai?.ruanganId ?? ""}
          id="ruanganId"
          name="ruanganId"
          required
          defaultValue={state.nilai?.ruanganId ?? ""}
          className={inputCls}
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
          <label htmlFor="waktuMulai" className="text-sm font-medium text-stone-700">
            Waktu mulai
          </label>
          <input
            id="waktuMulai"
            name="waktuMulai"
            type="datetime-local"
            required
            defaultValue={state.nilai?.waktuMulai ?? ""}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="waktuSelesai" className="text-sm font-medium text-stone-700">
            Waktu selesai
          </label>
          <input
            id="waktuSelesai"
            name="waktuSelesai"
            type="datetime-local"
            required
            defaultValue={state.nilai?.waktuSelesai ?? ""}
            className={inputCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tujuan" className="text-sm font-medium text-stone-700">
          Tujuan / agenda rapat
        </label>
        <input
          id="tujuan"
          name="tujuan"
          type="text"
          required
          defaultValue={state.nilai?.tujuan ?? ""}
          placeholder="mis. Rapat koordinasi program imunisasi"
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="jumlahPeserta" className="text-sm font-medium text-stone-700">
          Jumlah peserta
        </label>
        <input
          id="jumlahPeserta"
          name="jumlahPeserta"
          type="number"
          min={1}
          required
          defaultValue={state.nilai?.jumlahPeserta ?? "1"}
          className={`w-32 ${inputCls}`}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Ajukan Booking"}
        </button>
        <Link
          href="/bidang"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100"
        >
          Batal
        </Link>
      </div>

      <p className="text-xs text-stone-400">
        Booking akan berstatus <span className="font-medium text-stone-600">Menunggu</span> hingga
        disetujui pengelola. Cek{" "}
        <a href="/bidang/jadwal" className="font-medium text-teal-600 hover:underline">
          jadwal ruangan
        </a>{" "}
        untuk melihat ketersediaan.
      </p>
    </form>
  );
}
