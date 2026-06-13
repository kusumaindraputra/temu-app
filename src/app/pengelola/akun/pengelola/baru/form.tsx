"use client";

import { useActionState } from "react";
import Link from "next/link";
import { buatAkunPengelola, type AkunState } from "../../actions";

const kosong: AkunState = {};

export default function FormPengelolaBaru() {
  const [state, formAction, pending] = useActionState(buatAkunPengelola, kosong);

  const nilai = state.nilai ?? { nama: "", username: "" };

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nama" className="text-sm font-medium text-zinc-700">
          Nama
        </label>
        <input
          id="nama"
          name="nama"
          type="text"
          required
          defaultValue={nilai.nama}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-zinc-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          defaultValue={nilai.username}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <p className="text-xs text-zinc-400">Huruf kecil, angka, dan underscore saja.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-zinc-700">
          Peran
        </label>
        <select
          id="role"
          name="role"
          defaultValue="PENGELOLA"
          className="w-48 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        >
          <option value="PENGELOLA">Pengelola</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Buat Akun Pengelola"}
        </button>
        <Link
          href="/pengelola/akun"
          className="rounded-md px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
