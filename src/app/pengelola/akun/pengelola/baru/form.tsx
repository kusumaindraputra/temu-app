"use client";

import { useActionState } from "react";
import Link from "next/link";
import { buatAkunPengelola, type AkunState } from "../../actions";

const kosong: AkunState = {};

const inputCls =
  "rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export default function FormPengelolaBaru() {
  const [state, formAction, pending] = useActionState(buatAkunPengelola, kosong);
  const nilai = state.nilai ?? { nama: "", username: "" };

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nama" className="text-sm font-medium text-stone-700">
          Nama
        </label>
        <input id="nama" name="nama" type="text" required defaultValue={nilai.nama} className={inputCls} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-stone-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          defaultValue={nilai.username}
          className={inputCls}
        />
        <p className="text-xs text-stone-400">Huruf kecil, angka, dan underscore saja.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-stone-700">
          Peran
        </label>
        <select
          id="role"
          name="role"
          defaultValue="PENGELOLA"
          className={`w-48 ${inputCls}`}
        >
          <option value="PENGELOLA">Pengelola</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Buat Akun Pengelola"}
        </button>
        <Link
          href="/pengelola/akun"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
