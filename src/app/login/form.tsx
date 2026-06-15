"use client";

import { useActionState } from "react";
import { aksiLogin, type LoginState } from "./actions";

const kondisiAwal: LoginState = {};

export default function FormLogin() {
  const [state, formAction, pending] = useActionState(aksiLogin, kondisiAwal);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-stone-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          placeholder="mis. kesmas / pengelola / admin"
          className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
