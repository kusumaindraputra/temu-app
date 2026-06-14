import {
  JAM_MULAI,
  JAM_SELESAI,
  RENTANG_JAM,
  posisiSlot,
  labelJam,
  labelTanggal,
} from "@/lib/jadwal";

export type BookingSlot = {
  id: number;
  waktuMulai: Date;
  waktuSelesai: Date;
  bidangNama: string;
  tujuan: string;
  status: "MENUNGGU" | "DISETUJUI";
};

export type RuanganSlot = {
  id: number;
  nama: string;
  aktif: boolean;
  slots: BookingSlot[];
};

type Props = {
  ruangan: RuanganSlot[];
  tanggal: string;
};

const jamTick = Array.from({ length: RENTANG_JAM + 1 }, (_, i) => JAM_MULAI + i);

export default function TimelineJadwal({ ruangan, tanggal }: Props) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-stone-700">{labelTanggal(tanggal)}</p>

      {/* Timeline */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <div className="min-w-[680px]">
          {/* Header jam */}
          <div className="flex border-b border-stone-100 bg-stone-50/60">
            <div className="w-36 shrink-0 border-r border-stone-100" />
            <div className="relative flex-1 py-2.5">
              {jamTick.map((h) => (
                <span
                  key={h}
                  className="absolute top-1.5 -translate-x-1/2 text-[10px] font-medium text-stone-400"
                  style={{ left: `${((h - JAM_MULAI) / RENTANG_JAM) * 100}%` }}
                >
                  {String(h).padStart(2, "0")}:00
                </span>
              ))}
            </div>
          </div>

          {/* Baris per ruangan */}
          {ruangan.map((r) => (
            <div
              key={r.id}
              className="flex items-center border-b border-stone-50 last:border-0"
            >
              <div className="w-36 shrink-0 border-r border-stone-100 px-4 py-3.5">
                <span
                  className={`text-sm font-medium ${r.aktif ? "text-stone-800" : "text-stone-300"}`}
                >
                  {r.nama}
                </span>
                {!r.aktif && (
                  <p className="mt-0.5 text-[10px] text-stone-300">nonaktif</p>
                )}
              </div>

              <div className="relative mx-3 my-2.5 h-9 flex-1 rounded-lg bg-stone-50">
                {/* Grid lines */}
                {jamTick.slice(1).map((h) => (
                  <div
                    key={h}
                    className="absolute top-0 h-full border-l border-stone-100"
                    style={{ left: `${((h - JAM_MULAI) / RENTANG_JAM) * 100}%` }}
                  />
                ))}

                {/* Booking bars */}
                {r.slots.map((b) => {
                  const { left, width } = posisiSlot(b.waktuMulai, b.waktuSelesai);
                  const isApproved = b.status === "DISETUJUI";
                  return (
                    <div
                      key={b.id}
                      className={`absolute top-1 bottom-1 flex items-center overflow-hidden rounded-md px-2 ${
                        isApproved
                          ? "bg-teal-500 text-white"
                          : "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                      }`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      title={`${b.bidangNama}: ${b.tujuan}\n${labelJam(b.waktuMulai)}–${labelJam(b.waktuSelesai)}`}
                    >
                      <span className="truncate text-xs font-medium">
                        {b.bidangNama} · {b.tujuan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {ruangan.length === 0 && (
            <div className="py-12 text-center text-sm text-stone-400">
              Tidak ada ruangan terdaftar.
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded bg-teal-500" />
          Disetujui
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded bg-amber-100 ring-1 ring-amber-200" />
          Menunggu
        </span>
        <span className="ml-auto hidden sm:block">
          Arahkan kursor untuk detail.
        </span>
      </div>
    </div>
  );
}
