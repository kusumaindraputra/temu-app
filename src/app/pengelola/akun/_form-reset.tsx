"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ResetState } from "./actions";

type Props = {
  aksi: (prev: ResetState, fd: FormData) => Promise<ResetState>;
  id: number;
  nama: string;
};

const kosong: ResetState = {};

export default function FormResetPassword({ aksi, id, nama }: Props) {
  const [state, formAction, pending] = useActionState(aksi, kosong);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <input type="hidden" name="id" value={id} />

      <p className="text-sm text-zinc-600">
        Reset password untuk akun <strong>{nama}</strong>.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Password baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <p className="text-xs text-zinc-400">Minimal 6 karakter.</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Password Baru"}
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
