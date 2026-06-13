import type { StatusBooking } from "@prisma/client";

const peta: Record<StatusBooking, { label: string; kelas: string }> = {
  MENUNGGU: { label: "Menunggu", kelas: "bg-amber-50 text-amber-700 ring-amber-200" },
  DISETUJUI: { label: "Disetujui", kelas: "bg-green-50 text-green-700 ring-green-200" },
  DITOLAK: { label: "Ditolak", kelas: "bg-red-50 text-red-700 ring-red-200" },
  BATAL: { label: "Dibatalkan", kelas: "bg-zinc-100 text-zinc-600 ring-zinc-200" },
};

export default function BadgeStatus({ status }: { status: StatusBooking }) {
  const s = peta[status];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${s.kelas}`}
    >
      {s.label}
    </span>
  );
}
