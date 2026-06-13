"use client";

export default function TanggalPicker({ tanggal }: { tanggal: string }) {
  return (
    <input
      type="date"
      value={tanggal}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      onChange={(e) => {
        if (!e.target.value) return;
        const url = new URL(window.location.href);
        url.searchParams.set("tanggal", e.target.value);
        window.location.href = url.toString();
      }}
    />
  );
}
