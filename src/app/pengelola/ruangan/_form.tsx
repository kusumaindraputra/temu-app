"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { RuanganState, NilaiRuangan } from "./actions";

type Komponen = { id: number; nama: string };

type PropsForm = {
  aksi: (prev: RuanganState, fd: FormData) => Promise<RuanganState>;
  semuaKomponen: Komponen[];
  awal?: {
    id?: number;
    nama: string;
    lokasi: string;
    kapasitas: string;
    fasilitas: string;
    komponenIds: number[];
    aktif?: boolean;
  };
};

const kosong: RuanganState = {};

const inputCls =
  "rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export default function FormRuangan({ aksi, semuaKomponen, awal }: PropsForm) {
  const [state, formAction, pending] = useActionState(aksi, kosong);

  const v: NilaiRuangan = state.nilai ?? {
    nama: awal?.nama ?? "",
    lokasi: awal?.lokasi ?? "",
    kapasitas: awal?.kapasitas ?? "",
    fasilitas: awal?.fasilitas ?? "",
  };

  const aktifAwal = state.nilai ? undefined : awal?.aktif;
  const selectedIds: number[] = state.nilai ? [] : (awal?.komponenIds ?? []);
  const isEdit = awal?.id !== undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {isEdit && <input type="hidden" name="id" value={awal!.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nama" className="text-sm font-medium text-stone-700">
          Nama ruangan
        </label>
        <input id="nama" name="nama" type="text" required defaultValue={v.nama} className={inputCls} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lokasi" className="text-sm font-medium text-stone-700">
          Lokasi / lantai
        </label>
        <input
          id="lokasi"
          name="lokasi"
          type="text"
          required
          defaultValue={v.lokasi}
          placeholder="mis. Lantai 2"
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="kapasitas" className="text-sm font-medium text-stone-700">
          Kapasitas (orang)
        </label>
        <input
          id="kapasitas"
          name="kapasitas"
          type="number"
          min={1}
          required
          defaultValue={v.kapasitas || "1"}
          className={`w-32 ${inputCls}`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fasilitas" className="text-sm font-medium text-stone-700">
          Fasilitas
          <span className="ml-1 font-normal text-stone-400">(pisahkan dengan koma)</span>
        </label>
        <input
          id="fasilitas"
          name="fasilitas"
          type="text"
          defaultValue={v.fasilitas}
          placeholder="mis. Proyektor, AC, Whiteboard"
          className={inputCls}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-stone-700">
          Komponen <span className="font-normal text-stone-400">(pilih minimal 1)</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {semuaKomponen.map((k) => (
            <label key={k.id} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="komponenId"
                value={k.id}
                defaultChecked={selectedIds.includes(k.id)}
                className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-stone-700">{k.nama}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {isEdit && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="aktif" className="text-sm font-medium text-stone-700">
            Status
          </label>
          <select
            id="aktif"
            name="aktif"
            defaultValue={aktifAwal === false ? "false" : "true"}
            className={`w-40 ${inputCls}`}
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Ruangan"}
        </button>
        <Link
          href="/pengelola/ruangan"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
