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
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="id" value={id} />

      <p className="text-sm text-stone-600">
        Reset password untuk akun <strong className="text-stone-900">{nama}</strong>.
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          Password baru
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
        <p className="text-xs text-stone-400">Minimal 6 karakter.</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Password Baru"}
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
