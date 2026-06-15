"use client";

import { useActionState } from "react";
import { buatKomponen, type KomponenState } from "./actions";

const init: KomponenState = {};

export default function FormKomponen() {
  const [state, action, pending] = useActionState(buatKomponen, init);
  return (
    <div className="flex flex-col gap-1">
      <form action={action} className="flex items-center gap-2">
        <input
          type="text"
          name="nama"
          placeholder="Nama komponen baru"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          {pending ? "Menyimpan…" : "+ Tambah"}
        </button>
      </form>
      {state.error && <p className="text-xs text-red-500">{state.error}</p>}
    </div>
  );
}
