import Link from "next/link";
import {
  hariIniJakarta,
  namaBulan,
  generateGridKalender,
  padDateStr,
} from "@/lib/jadwal";

export type TandaiHari = Record<
  string,
  { dots: ("teal" | "amber" | "red")[] }
>;

type Props = {
  bulan: number;
  tahun: number;
  tandai: TandaiHari;
  /** Base href untuk link hari → jadwal, e.g. "/bidang/jadwal". */
  jadwalHref: string;
  /** Base href untuk navigasi bulan (omit di mini). */
  kalenderHref?: string;
};

const LABEL_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const DOT_CLASS: Record<string, string> = {
  teal: "bg-teal-500",
  amber: "bg-amber-400",
  red: "bg-red-400",
};

export default function KalenderBulanan({
  bulan,
  tahun,
  tandai,
  jadwalHref,
  kalenderHref,
}: Props) {
  const weeks = generateGridKalender(tahun, bulan);
  const today = hariIniJakarta();
  const isMini = !kalenderHref;

  const prevM = new Date(tahun, bulan - 2, 1);
  const nextM = new Date(tahun, bulan, 1);
  const prevHref = kalenderHref
    ? `${kalenderHref}?bulan=${prevM.getMonth() + 1}&tahun=${prevM.getFullYear()}`
    : "";
  const nextHref = kalenderHref
    ? `${kalenderHref}?bulan=${nextM.getMonth() + 1}&tahun=${nextM.getFullYear()}`
    : "";

  return (
    <div className={isMini ? "" : "w-full"}>
      {/* Header bulan */}
      <div className={`mb-3 flex items-center ${isMini ? "justify-center" : "justify-between"}`}>
        {!isMini && (
          <Link
            href={prevHref}
            className="rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            ←
          </Link>
        )}
        <span className="text-sm font-semibold text-zinc-800">
          {namaBulan(bulan)} {tahun}
        </span>
        {!isMini && (
          <Link
            href={nextHref}
            className="rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            →
          </Link>
        )}
      </div>

      {/* Label hari */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {LABEL_HARI.map((h) => (
          <div key={h} className="py-1 text-xs font-medium text-zinc-400">
            {h}
          </div>
        ))}
      </div>

      {/* Sel hari */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="py-1" />;
            const dateStr = padDateStr(tahun, bulan, day);
            const marks = tandai[dateStr];
            const isToday = dateStr === today;

            return (
              <Link
                key={di}
                href={`${jadwalHref}?tanggal=${dateStr}`}
                className={`group flex flex-col items-center rounded-lg py-1 transition-colors hover:bg-zinc-100 ${
                  isToday ? "ring-2 ring-teal-500 ring-inset" : ""
                }`}
              >
                <span
                  className={`text-xs leading-5 ${
                    isToday
                      ? "font-bold text-teal-700"
                      : "text-zinc-700 group-hover:text-zinc-900"
                  }`}
                >
                  {day}
                </span>
                {marks && marks.dots.length > 0 ? (
                  <div className="mt-0.5 flex gap-0.5">
                    {marks.dots.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className={`h-1 w-1 rounded-full ${DOT_CLASS[c]}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-0.5 h-1.5" />
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Legenda (hanya di full view) */}
      {!isMini && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-500" /> Disetujui
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Menunggu
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" /> Ditolak / Batal
          </span>
        </div>
      )}
    </div>
  );
}
