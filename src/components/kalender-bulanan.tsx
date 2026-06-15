import Link from "next/link";
import {
  hariIniJakarta,
  namaBulan,
  generateGridKalender,
  padDateStr,
} from "@/lib/jadwal";

export type TandaiHari = Record<
  string,
  { dots: ("success" | "amber" | "red")[] }
>;

type Props = {
  bulan: number;
  tahun: number;
  tandai: TandaiHari;
  jadwalHref: string;
  kalenderHref?: string;
};

const LABEL_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const DOT_CLASS: Record<string, string> = {
  success: "bg-success-500",
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
      <div
        className={`mb-4 flex items-center ${isMini ? "justify-center" : "justify-between"}`}
      >
        {!isMini && (
          <Link
            href={prevHref}
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            ←
          </Link>
        )}
        <span className="text-sm font-semibold text-stone-800">
          {namaBulan(bulan)} {tahun}
        </span>
        {!isMini && (
          <Link
            href={nextHref}
            className="flex h-7 w-7 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            →
          </Link>
        )}
      </div>

      {/* Label hari */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {LABEL_HARI.map((h) => (
          <div key={h} className="py-1 text-[11px] font-medium uppercase tracking-wider text-stone-400">
            {h}
          </div>
        ))}
      </div>

      {/* Grid hari */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="py-1" />;
            const dateStr = padDateStr(tahun, bulan, day);
            const marks = tandai[dateStr];
            const isToday = dateStr === today;

            const dateHref = jadwalHref.includes("?")
              ? `${jadwalHref}&tanggal=${dateStr}`
              : `${jadwalHref}?tanggal=${dateStr}`;

            return (
              <Link
                key={di}
                href={dateHref}
                scroll={false}
                className="group flex flex-col items-center py-1"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                    isToday
                      ? "bg-brand-600 font-bold text-white"
                      : "text-stone-700 group-hover:bg-stone-100 group-hover:text-stone-900"
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

      {/* Legenda (full view only) */}
      {!isMini && (
        <div className="mt-5 flex flex-wrap gap-4 border-t border-stone-100 pt-4 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" /> Disetujui
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Menunggu
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Ditolak/Batal
          </span>
        </div>
      )}
    </div>
  );
}
