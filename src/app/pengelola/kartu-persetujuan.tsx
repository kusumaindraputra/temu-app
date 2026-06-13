"use client";

import { useActionState } from "react";
import { prosesBooking, type ProsesState } from "./actions";

export type DataKartu = {
  id: number;
  ruanganNama: string;
  lokasi: string;
  bidangNama: string;
  rentang: string;
  tujuan: string;
  jumlahPeserta: number;
  peringatanBentrok: string[];
};

const kondisiAwal: ProsesState = {};

export default function KartuPersetujuan({ data }: { data: DataKartu }) {
  const [state, formAction, pending] = useActionState(prosesBooking, kondisiAwal);

  return (
    <li className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-stone-900">{data.ruanganNama}</h2>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-400">{data.lokasi}</span>
          </div>
          <p className="mt-1.5 text-sm text-stone-600">{data.rentang}</p>
          <p className="mt-0.5 text-sm text-stone-700">{data.tujuan}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-stone-400">Pemohon</p>
          <p className="text-sm font-semibold text-stone-900">{data.bidangNama}</p>
          <p className="mt-0.5 text-xs text-stone-400">{data.jumlahPeserta} peserta</p>
        </div>
      </div>

      {data.peringatanBentrok.length > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <p className="font-semibold">Berpotensi bentrok dengan booking yang sudah disetujui:</p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5">
            {data.peringatanBentrok.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {state.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.ok && (
        <div className="mt-4 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700">
          {state.ok}
        </div>
      )}

      {!state.ok && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="id" value={data.id} />
          <textarea
            name="catatan"
            rows={2}
            placeholder="Catatan untuk pemohon (opsional)…"
            className="rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              name="aksi"
              value="setujui"
              disabled={pending}
              className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {pending ? "Memproses…" : "Setujui"}
            </button>
            <button
              type="submit"
              name="aksi"
              value="tolak"
              disabled={pending}
              className="rounded-lg border border-stone-200 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              Tolak
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
