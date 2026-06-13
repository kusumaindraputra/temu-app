// Utilitas bersama untuk halaman jadwal ruangan.

export const JAM_MULAI = 7;   // 07:00 WIB
export const JAM_SELESAI = 22; // 22:00 WIB
export const RENTANG_JAM = JAM_SELESAI - JAM_MULAI;

/** Jam WIB (desimal) dari objek Date UTC. */
export function wibJam(dt: Date): number {
  const ms = dt.getTime() + 7 * 3600 * 1000;
  const d = new Date(ms);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
}

/** Posisi (left%) dan lebar (width%) untuk batang timeline. */
export function posisiSlot(
  mulai: Date,
  selesai: Date,
): { left: number; width: number } {
  const jMulai = Math.max(wibJam(mulai), JAM_MULAI);
  const jSelesai = Math.min(wibJam(selesai), JAM_SELESAI);
  const left = ((jMulai - JAM_MULAI) / RENTANG_JAM) * 100;
  const width = Math.max(0.5, ((jSelesai - jMulai) / RENTANG_JAM) * 100);
  return { left: Math.max(0, left), width };
}

/** Tanggal hari ini dalam format YYYY-MM-DD (timezone Jakarta). */
export function hariIniJakarta(): string {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Geser tanggal YYYY-MM-DD sebesar n hari. */
export function geserTanggal(dateStr: string, hari: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + hari);
  return d.toISOString().slice(0, 10);
}

/** Label jam singkat, mis. "09:30". */
export function labelJam(dt: Date): string {
  const jam = wibJam(dt);
  const h = Math.floor(jam);
  const m = Math.round((jam - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format tanggal panjang bahasa Indonesia, mis. "Senin, 15 Januari 2024". */
export function labelTanggal(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/** Bulan dan tahun saat ini dalam timezone Jakarta. */
export function bulanTahunJakarta(): { bulan: number; tahun: number } {
  const d = new Date(Date.now() + 7 * 3600 * 1000);
  return { bulan: d.getUTCMonth() + 1, tahun: d.getUTCFullYear() };
}

/** Konversi objek Date UTC ke string YYYY-MM-DD dalam timezone Jakarta. */
export function toJakartaDateStr(dt: Date): string {
  return new Date(dt.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Nama bulan dalam bahasa Indonesia, mis. "Juni". */
export function namaBulan(bulan: number): string {
  return new Date(2024, bulan - 1, 1).toLocaleDateString("id-ID", { month: "long" });
}

/** Salam berdasarkan jam saat ini (WIB). */
export function salamWaktu(): string {
  const jam = new Date(Date.now() + 7 * 3600 * 1000).getUTCHours();
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

/** Grid kalender bulanan — array 7-kolom (Sen–Min), null = padding. */
export function generateGridKalender(tahun: number, bulan: number): (number | null)[][] {
  const firstDate = new Date(tahun, bulan - 1, 1);
  const daysInMonth = new Date(tahun, bulan, 0).getDate();
  const startOffset = (firstDate.getDay() + 6) % 7; // Sen=0, Min=6

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** String YYYY-MM-DD untuk hari tertentu di bulan/tahun. */
export function padDateStr(tahun: number, bulan: number, hari: number): string {
  return `${tahun}-${String(bulan).padStart(2, "0")}-${String(hari).padStart(2, "0")}`;
}
