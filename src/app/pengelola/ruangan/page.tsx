import Link from "next/link";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { toggleAktifRuangan } from "./actions";
import FormKomponen from "./_komponen-form";
import TombolHapusKomponen from "./_hapus-komponen-form";

export default async function HalamanRuangan() {
  await wajibAdmin();

  const [ruanganList, komponenList] = await Promise.all([
    db.ruangan.findMany({
      orderBy: { nama: "asc" },
      include: { komponen: { select: { id: true, nama: true } } },
    }),
    db.komponen.findMany({
      orderBy: { nama: "asc" },
      include: { ruangan: { select: { id: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* === Ruangan === */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Ruangan</h1>
            <p className="mt-0.5 text-sm text-stone-500">{ruanganList.length} ruangan terdaftar.</p>
          </div>
          <Link
            href="/pengelola/ruangan/baru"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            + Tambah Ruangan
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-medium uppercase tracking-wider text-stone-400">
                <th className="px-5 py-3.5">Nama</th>
                <th className="px-5 py-3.5">Lokasi</th>
                <th className="px-5 py-3.5">Kap.</th>
                <th className="px-5 py-3.5">Komponen</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {ruanganList.map((r) => (
                <tr key={r.id} className={r.aktif ? "" : "bg-stone-50 opacity-60"}>
                  <td className="px-5 py-3.5 font-medium text-stone-900">{r.nama}</td>
                  <td className="px-5 py-3.5 text-stone-600">{r.lokasi}</td>
                  <td className="px-5 py-3.5 text-stone-600">{r.kapasitas}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex flex-wrap gap-1">
                      {r.komponen.map((k) => (
                        <span
                          key={k.id}
                          className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700"
                        >
                          {k.nama}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.aktif
                          ? "bg-success-100 text-success-700"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {r.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/pengelola/ruangan/${r.id}/ubah`}
                        className="rounded px-2.5 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
                      >
                        Ubah
                      </Link>
                      <form action={toggleAktifRuangan}>
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
              {ruanganList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    Belum ada ruangan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* === Komponen === */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-900">Komponen</h2>
          <p className="mt-0.5 text-sm text-stone-500">
            Unit fisik terkecil ruangan. Dipakai untuk deteksi bentrok Aula split.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {komponenList.map((k) => (
            <div
              key={k.id}
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2"
            >
              <span className="text-sm font-medium text-stone-800">{k.nama}</span>
              <span className="text-xs text-stone-400">({k.ruangan.length} ruangan)</span>
              {k.ruangan.length === 0 && <TombolHapusKomponen id={k.id} />}
            </div>
          ))}

          <FormKomponen />
        </div>
      </section>
    </div>
  );
}
