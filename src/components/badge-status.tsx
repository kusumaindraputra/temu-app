import type { StatusBooking } from "@prisma/client";

const peta: Record<
  StatusBooking,
  { label: string; dot: string; text: string; bg: string }
> = {
  MENUNGGU: {
    label: "Menunggu",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  DISETUJUI: {
    label: "Disetujui",
    dot: "bg-teal-500",
    text: "text-teal-700",
    bg: "bg-teal-50",
  },
  DITOLAK: {
    label: "Ditolak",
    dot: "bg-red-400",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  BATAL: {
    label: "Dibatalkan",
    dot: "bg-stone-300",
    text: "text-stone-500",
    bg: "bg-stone-100",
  },
};

export default function BadgeStatus({ status }: { status: StatusBooking }) {
  const s = peta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
