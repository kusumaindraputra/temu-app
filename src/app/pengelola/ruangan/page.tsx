import Link from "next/link";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { toggleAktifRuangan, buatKomponen, hapusKomponen } from "./actions";

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
            <h1 className="text-2xl font-bold text-zinc-900">Ruangan</h1>
            <p className="mt-0.5 text-sm text-zinc-500">{ruanganList.length} ruangan terdaftar.</p>
          </div>
          <Link
            href="/pengelola/ruangan/baru"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            + Tambah Ruangan
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Kap.</th>
                <th className="px-4 py-3">Komponen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ruanganList.map((r) => (
                <tr key={r.id} className={r.aktif ? "" : "bg-zinc-50 opacity-60"}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{r.nama}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.lokasi}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.kapasitas}</td>
                  <td className="px-4 py-3">
                    <span className="flex flex-wrap gap-1">
                      {r.komponen.map((k) => (
                        <span
                          key={k.id}
                          className="rounded bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-teal-700"
                        >
                          {k.nama}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.aktif
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-200 text-zinc-500"
                      }`}
                    >
                      {r.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/pengelola/ruangan/${r.id}/ubah`}
                        className="rounded px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                      >
                        Ubah
                      </Link>
                      <form action={toggleAktifRuangan}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="aktif" value={String(r.aktif)} />
                        <button
                          type="submit"
                          className="rounded px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
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
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
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
          <h2 className="text-lg font-semibold text-zinc-900">Komponen</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Unit fisik terkecil ruangan. Dipakai untuk deteksi bentrok Aula split.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {komponenList.map((k) => (
            <div
              key={k.id}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2"
            >
              <span className="text-sm font-medium text-zinc-800">{k.nama}</span>
              <span className="text-xs text-zinc-400">({k.ruangan.length} ruangan)</span>
              {k.ruangan.length === 0 && (
                <form action={hapusKomponen}>
                  <input type="hidden" name="id" value={k.id} />
                  <button
                    type="submit"
                    className="ml-1 text-xs text-red-500 hover:text-red-700"
                    title="Hapus komponen (hanya jika tidak dipakai)"
                  >
                    ×
                  </button>
                </form>
              )}
            </div>
          ))}

          {/* Form tambah komponen baru */}
          <form action={buatKomponen} className="flex items-center gap-2">
            <input
              type="text"
              name="nama"
              placeholder="Nama komponen baru"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              + Tambah
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
