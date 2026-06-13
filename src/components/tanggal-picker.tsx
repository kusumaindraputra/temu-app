"use client";

export default function TanggalPicker({ tanggal }: { tanggal: string }) {
  return (
    <input
      type="date"
      value={tanggal}
      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
      onChange={(e) => {
        if (!e.target.value) return;
        const url = new URL(window.location.href);
        url.searchParams.set("tanggal", e.target.value);
        window.location.href = url.toString();
      }}
    />
  );
}
