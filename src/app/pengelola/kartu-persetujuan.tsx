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
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-zinc-900">{data.ruanganNama}</h2>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-500">{data.lokasi}</span>
          </div>
          <p className="mt-1 text-sm text-zinc-700">{data.rentang}</p>
          <p className="mt-1 text-sm text-zinc-600">{data.tujuan}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Pemohon: <b>{data.bidangNama}</b> · {data.jumlahPeserta} peserta
          </p>
        </div>
      </div>

      {data.peringatanBentrok.length > 0 && (
        <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">
          <p className="font-semibold">⚠ Berpotensi bentrok dengan booking disetujui:</p>
          <ul className="mt-1 list-inside list-disc">
            {data.peringatanBentrok.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {state.error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 ring-1 ring-green-200">
          {state.ok}
        </p>
      )}

      {!state.ok && (
        <form action={formAction} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="id" value={data.id} />
          <textarea
            name="catatan"
            rows={2}
            placeholder="Catatan untuk pemohon (opsional)…"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              name="aksi"
              value="setujui"
              disabled={pending}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {pending ? "Memproses…" : "Setujui"}
            </button>
            <button
              type="submit"
              name="aksi"
              value="tolak"
              disabled={pending}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Tolak
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
