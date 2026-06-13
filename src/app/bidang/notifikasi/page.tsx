import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";

function fmtWaktu(dt: Date): string {
  const now = Date.now();
  const diff = now - dt.getTime();
  const menit = Math.floor(diff / 60_000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  if (hari < 7) return `${hari} hari lalu`;
  return dt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

export default async function HalamanNotifikasi() {
  const sesi = await wajibBidang();

  const notifikasi = await db.notifikasi.findMany({
    where: { bidangId: sesi.id },
    orderBy: { dibuatPada: "desc" },
    take: 100,
  });

  // Auto-mark as read on page visit
  const adaYangBelumDibaca = notifikasi.some((n) => !n.sudahDibaca);
  if (adaYangBelumDibaca) {
    await db.notifikasi.updateMany({
      where: { bidangId: sesi.id, sudahDibaca: false },
      data: { sudahDibaca: true },
    });
    revalidatePath("/bidang");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Notifikasi</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {notifikasi.length === 0
            ? "Belum ada notifikasi."
            : `${notifikasi.length} notifikasi`}
        </p>
      </div>

      {notifikasi.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-500">
          Tidak ada notifikasi saat ini.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifikasi.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 ${
                n.sudahDibaca && !adaYangBelumDibaca
                  ? "border-zinc-200 bg-white"
                  : "border-teal-100 bg-teal-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    n.judul.includes("Disetujui")
                      ? "bg-teal-100 text-teal-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {n.judul.includes("Disetujui") ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-900">{n.judul}</p>
                  <p className="mt-0.5 text-sm text-zinc-600">{n.pesan}</p>
                  <p className="mt-1 text-xs text-zinc-400">{fmtWaktu(n.dibuatPada)}</p>
                </div>

                {/* Unread dot — shown before auto-read fires */}
                {!n.sudahDibaca && adaYangBelumDibaca && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
