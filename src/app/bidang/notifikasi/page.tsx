import { db } from "@/lib/db";
import { wajibBidang } from "@/lib/auth";

function fmtWaktu(dt: Date): string {
  const diff = Date.now() - dt.getTime();
  const menit = Math.floor(diff / 60_000);
  if (menit < 1) return "baru saja";
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  if (hari < 7) return `${hari} hari lalu`;
  return dt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
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

  const adaYangBelumDibaca = notifikasi.some((n) => !n.sudahDibaca);
  if (adaYangBelumDibaca) {
    await db.notifikasi.updateMany({
      where: { bidangId: sesi.id, sudahDibaca: false },
      data: { sudahDibaca: true },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Notifikasi</h1>
        <p className="mt-1 text-sm text-stone-400">
          {notifikasi.length === 0 ? "Belum ada notifikasi." : `${notifikasi.length} notifikasi`}
        </p>
      </div>

      {notifikasi.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-14 text-center text-stone-400">
          Tidak ada notifikasi.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifikasi.map((n) => {
            const isApproved = n.judul.includes("Disetujui");
            const isNew = !n.sudahDibaca && adaYangBelumDibaca;
            return (
              <li
                key={n.id}
                className={`rounded-2xl p-4 transition-colors ${
                  isNew ? "bg-brand-50" : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      isApproved ? "bg-success-100 text-success-600" : "bg-red-50 text-red-400"
                    }`}
                  >
                    {isApproved ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-900">{n.judul}</p>
                    <p className="mt-0.5 text-sm text-stone-500">{n.pesan}</p>
                    <p className="mt-1.5 text-xs text-stone-400">{fmtWaktu(n.dibuatPada)}</p>
                  </div>

                  {isNew && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
