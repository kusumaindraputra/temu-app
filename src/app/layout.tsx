import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Temu — Booking Ruang Meeting",
  description:
    "Temu — sistem booking ruang meeting Dinas Kesehatan Kabupaten Bogor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Temu",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#8612d2" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
