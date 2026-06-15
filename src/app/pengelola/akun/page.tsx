import Link from "next/link";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { toggleAktifBidang, toggleAktifPengelola } from "./actions";

export default async function HalamanAkun() {
  await wajibAdmin();

  const [bidangList, pengelolaList] = await Promise.all([
    db.bidang.findMany({ orderBy: { nama: "asc" } }),
    db.pengelola.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {/* === Akun Bidang === */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Akun Bidang</h1>
            <p className="mt-0.5 text-sm text-stone-500">{bidangList.length} akun bidang.</p>
          </div>
          <Link
            href="/pengelola/akun/bidang/baru"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + Tambah Akun Bidang
          </Link>
        </div>

        <TabelAkun
          rows={bidangList.map((b) => ({
            id: b.id,
            nama: b.nama,
            username: b.username,
            aktif: b.aktif,
            role: null,
            resetHref: `/pengelola/akun/bidang/${b.id}/reset`,
            toggleAction: toggleAktifBidang,
          }))}
        />
      </section>

      {/* === Akun Pengelola === */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Akun Pengelola</h2>
            <p className="mt-0.5 text-sm text-stone-500">{pengelolaList.length} akun pengelola.</p>
          </div>
          <Link
            href="/pengelola/akun/pengelola/baru"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + Tambah Akun Pengelola
          </Link>
        </div>

        <TabelAkun
          rows={pengelolaList.map((p) => ({
            id: p.id,
            nama: p.nama,
            username: p.username,
            aktif: p.aktif,
            role: p.role,
            resetHref: `/pengelola/akun/pengelola/${p.id}/reset`,
            toggleAction: toggleAktifPengelola,
          }))}
        />
      </section>
    </div>
  );
}

type AkunRow = {
  id: number;
  nama: string;
  username: string;
  aktif: boolean;
  role: string | null;
  resetHref: string;
  toggleAction: (fd: FormData) => Promise<void>;
};

function TabelAkun({ rows }: { rows: AkunRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
            <th className="px-5 py-3.5">Nama</th>
            <th className="px-5 py-3.5">Username</th>
            <th className="px-5 py-3.5">Peran</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-50">
          {rows.map((r) => (
            <tr key={r.id} className={r.aktif ? "" : "bg-stone-50 opacity-60"}>
              <td className="px-5 py-3.5 font-medium text-stone-900">{r.nama}</td>
              <td className="px-5 py-3.5 font-mono text-stone-600">{r.username}</td>
              <td className="px-5 py-3.5 text-stone-500">
                {r.role === "ADMIN" ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Admin
                  </span>
                ) : r.role === "PENGELOLA" ? (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Pengelola
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                    Bidang
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.aktif
                      ? "bg-green-100 text-green-700"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {r.aktif ? "Aktif" : "Nonaktif"}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={r.resetHref}
                    className="rounded px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
                  >
                    Reset Sandi
                  </Link>
                  <form action={r.toggleAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="aktif" value={String(r.aktif)} />
                    <button
                      type="submit"
                      className="rounded px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
                    >
                      {r.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-stone-500">
                Belum ada akun.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
