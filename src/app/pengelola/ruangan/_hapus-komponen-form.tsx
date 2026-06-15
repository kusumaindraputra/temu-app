"use client";

import { useActionState } from "react";
import { hapusKomponen, type HapusKomponenState } from "./actions";

const init: HapusKomponenState = {};

export default function TombolHapusKomponen({ id }: { id: number }) {
  const [state, action] = useActionState(hapusKomponen, init);
  return (
    <form action={action} title={state.error ?? "Hapus komponen"}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="ml-1 text-xs text-red-500 hover:text-red-700"
        title={state.error ?? "Hapus komponen (hanya jika tidak dipakai)"}
      >
        ×
      </button>
    </form>
  );
}
