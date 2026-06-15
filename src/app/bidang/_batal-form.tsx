"use client";

import { useActionState } from "react";
import { batalBooking, type BatalState } from "./booking/actions";

const init: BatalState = {};

export default function FormBatal({ id }: { id: number }) {
  const [state, action, pending] = useActionState(batalBooking, init);
  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      {state.error && <p className="text-xs text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-50 disabled:opacity-50"
      >
        {pending ? "Membatalkan…" : "Batalkan"}
      </button>
    </form>
  );
}
