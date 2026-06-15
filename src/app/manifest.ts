import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Temu — Booking Ruang Meeting Dinas Kesehatan",
    short_name: "Temu",
    description:
      "Temu — sistem booking ruang meeting Dinas Kesehatan Kabupaten Bogor",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8612d2",
    orientation: "portrait-primary",
    scope: "/",
    lang: "id",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
