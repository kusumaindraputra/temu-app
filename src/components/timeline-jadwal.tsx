import Link from "next/link";
import {
  JAM_MULAI,
  JAM_SELESAI,
  RENTANG_JAM,
  posisiSlot,
  labelJam,
  labelTanggal,
  geserTanggal,
} from "@/lib/jadwal";
import TanggalPicker from "./tanggal-picker";

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
  baseHref: string; // "/bidang/jadwal" atau "/pengelola/jadwal"
};

const jamTick = Array.from({ length: RENTANG_JAM + 1 }, (_, i) => JAM_MULAI + i);

export default function TimelineJadwal({ ruangan, tanggal, baseHref }: Props) {
  const prevDate = geserTanggal(tanggal, -1);
  const nextDate = geserTanggal(tanggal, 1);

  return (
    <div>
      {/* Navigasi tanggal */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href={`${baseHref}?tanggal=${prevDate}`}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          ← Kemarin
        </Link>
        <TanggalPicker tanggal={tanggal} />
        <Link
          href={`${baseHref}?tanggal=${nextDate}`}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
        >
          Besok →
        </Link>
        <span className="hidden text-sm text-zinc-500 sm:block">
          {labelTanggal(tanggal)}
        </span>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <div className="min-w-[680px]">
          {/* Baris jam */}
          <div className="flex border-b border-zinc-200 bg-zinc-50">
            <div className="w-36 shrink-0 border-r border-zinc-200" />
            <div className="relative flex-1 py-2">
              {jamTick.map((h) => (
                <span
                  key={h}
                  className="absolute top-1 -translate-x-1/2 text-xs text-zinc-400"
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
              className="flex items-center border-b border-zinc-100 last:border-0"
            >
              <div className="w-36 shrink-0 border-r border-zinc-200 px-3 py-3">
                <span
                  className={`text-sm font-medium ${r.aktif ? "text-zinc-800" : "text-zinc-400"}`}
                >
                  {r.nama}
                </span>
                {!r.aktif && (
                  <span className="ml-1 text-xs text-zinc-400">(nonaktif)</span>
                )}
              </div>

              <div className="relative flex-1 mx-2 my-2 h-9 rounded bg-zinc-50 border border-zinc-200">
                {/* Grid jam */}
                {jamTick.slice(1).map((h) => (
                  <div
                    key={h}
                    className="absolute top-0 h-full border-l border-zinc-200"
                    style={{ left: `${((h - JAM_MULAI) / RENTANG_JAM) * 100}%` }}
                  />
                ))}

                {/* Batang booking */}
                {r.slots.map((b) => {
                  const { left, width } = posisiSlot(b.waktuMulai, b.waktuSelesai);
                  const isDiSetujui = b.status === "DISETUJUI";
                  return (
                    <div
                      key={b.id}
                      className={`absolute top-0.5 bottom-0.5 flex items-center overflow-hidden rounded px-1.5 ${
                        isDiSetujui
                          ? "bg-teal-500 text-white"
                          : "bg-amber-400 text-amber-900"
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
            <div className="px-4 py-10 text-center text-sm text-zinc-500">
              Tidak ada ruangan terdaftar.
            </div>
          )}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded bg-teal-500" />
          Disetujui
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded bg-amber-400" />
          Menunggu
        </span>
        <span className="ml-auto">Arahkan kursor ke booking untuk detail.</span>
      </div>
    </div>
  );
}
