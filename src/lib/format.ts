const TZ = "Asia/Jakarta";

export function fmtTanggal(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(d);
}

export function fmtJam(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(d);
}

/** Contoh: "Jumat, 13 Juni 2026, 09.00–11.00" */
export function fmtRentang(mulai: Date, selesai: Date): string {
  return `${fmtTanggal(mulai)}, ${fmtJam(mulai)}–${fmtJam(selesai)}`;
}
