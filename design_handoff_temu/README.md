# Handoff: Temu — Sistem Booking Ruang Meeting (Dinkes Bogor)

## Overview
**Temu** adalah aplikasi internal untuk memesan ruang meeting di lingkungan **Dinas Kesehatan Kabupaten Bogor**. Pegawai antar-bidang mengajukan booking ruangan; pengelola/admin menyetujui atau menolak; sistem mendeteksi bentrok jadwal. Paket ini berisi **design system lengkap** (token, komponen, pola halaman, light + dark mode) untuk diimplementasi di codebase nyata.

Nama "Temu" = *bertemu / titik temu* — mempertemukan orang dan ruangan pada satu waktu.

## About the Design Files
File dalam bundle ini adalah **referensi desain yang dibuat dalam HTML** — prototipe yang menunjukkan tampilan & perilaku yang diinginkan, **bukan kode produksi untuk disalin langsung**. Tugasnya adalah **merekonstruksi desain ini di environment codebase target** menggunakan pola dan library yang sudah ada di sana.

Codebase target diketahui memakai **Next.js (App Router) + Prisma + Tailwind** (lihat bagian *Codebase Context*). Implementasikan dengan pola tersebut — jangan tempel HTML mentah.

## Fidelity
**High-fidelity (hifi).** Warna, tipografi, spacing, radius, dan state sudah final. Recreate UI seakurat mungkin memakai library/komponen yang ada di codebase. Semua nilai ada di `temu-tokens.css` dan terdokumentasi di bawah.

---

## Brand & Warna — ATURAN PENTING

> **Brand = Ungu. Status "Disetujui" = Hijau. Jangan tertukar.**

| Peran | Token | Hex |
|---|---|---|
| **Brand primary** (tombol utama, link, topbar nav aktif, kalender "hari ini", focus ring) | `--color-brand-primary` = `--purple-600` | `#8612D2` |
| **Brand mark / accent** (logomark, highlight) | `--purple-500` | `#A020F0` |
| **Brand dark** (hover tombol, header tabel, header dokumen) | `--purple-700` | `#6A0EA6` |
| **Status DISETUJUI / sukses** (badge, alert sukses, timeline approved) | `--success-*` (= green) | `#1A8A5C` / `#0D5C3A` |
| **Status MENUNGGU** | `--gold-400` + teks `--warning-fg` | `#D49A1A` / `#7A5209` |
| **Status DITOLAK** | `--red-*` | `#E03C3C` / `#C42828` |
| **Status BATAL** | `--neutral-*` | abu |
| **Sekunder / Admin (Pengelola)** | `--blue-600` | `#1556A0` |

Hijau **HANYA** untuk semantik sukses. Jangan pakai hijau sebagai warna brand/aksi — itu peran ungu. Alasannya: jika "Disetujui" jadi ungu, ia kehilangan makna "berhasil" dan bertabrakan dengan warna brand.

---

## Logomark "Titik Temu"
Dua lingkaran beririsan; irisannya disorot warna lebih terang — memvisualkan dua pihak berbagi satu ruang & waktu.

```svg
<!-- Versi berwarna (di atas latar terang) -->
<svg viewBox="0 0 64 64" width="28" height="28">
  <clipPath id="L"><circle cx="25" cy="32" r="15"/></clipPath>
  <circle cx="25" cy="32" r="15" fill="#A020F0"/>
  <circle cx="39" cy="32" r="15" fill="#6A0EA6"/>
  <g clip-path="url(#L)"><circle cx="39" cy="32" r="15" fill="#EED7FC"/></g>
</svg>

<!-- Versi putih/reversed (di atas latar gelap) — sama geometrinya,
     lingkaran kiri opacity .78, kanan .48, irisan opacity 1 -->
```
- Wordmark selalu **"Temu"** (kapital T, sisanya kecil), Plus Jakarta Sans 800.
- Di latar gelap/ungu pakai versi mark putih.
- Favicon: mark vesica sebagai SVG data-URI (lihat `<head>` di Design System Temu.html).
- 4 konsep alternatif ada di `Logo Temu.html` — yang dipilih & dipakai adalah **Konsep 01 (Titik Temu / vesica)**.

---

## Codebase Context
Schema Prisma (acuan model data — sesuaikan dengan yang ada di repo):
- **User**: id, username, password (hash), nama, peran (`BIDANG` | `PENGELOLA` | `ADMIN`), bidang (relasi)
- **Bidang**: id, nama (unit kerja, mis. "Bidang KIA")
- **Ruangan**: id, nama, lokasi, kapasitas, fasilitas (`String[]`), status (aktif/nonaktif), komponen ruangan (untuk deteksi bentrok split/gabung aula)
- **Booking**: id, ruangan, bidang, pemohon, waktuMulai, waktuSelesai, tujuan, jumlahPeserta, status (`MENUNGGU` | `DISETUJUI` | `DITOLAK` | `DIBATALKAN`), catatan persetujuan
- **Notifikasi**: id, user, judul, isi, dibaca, tipe

Tiga peran utama:
- **Bidang** — buat booking, lihat jadwal & status pengajuan sendiri
- **Pengelola** — setujui/tolak booking, kelola jadwal, lihat semua
- **Admin** — kelola ruangan (CRUD), kelola user

---

## Screens / Views

### 1. Login (`/login`)
- **Purpose**: Autentikasi username + password.
- **Layout**: Dua kolom di desktop. Kiri = panel brand ungu (`--purple-700` bg) dengan logomark putih besar + wordmark "Temu" + tagline "Sistem Booking Ruang Meeting / Dinas Kesehatan Kabupaten Bogor". Kanan = form (card putih, max-width ~400px, terpusat). Di mobile, panel brand jadi header ringkas di atas form.
- **Components**: Input username & password (`--radius-md`, border `--color-border-default`, focus ring `--shadow-focus` ungu); tombol "Masuk" (btn-primary, full-width); error alert merah jika gagal.

### 2. Dashboard Bidang (`/bidang`)
- **Purpose**: Ringkasan booking milik bidang + aksi buat booking.
- **Layout**: Topbar sticky (52–56px) + konten max-width ~1152px, padding 24–32px. Urutan: greeting ("Selamat pagi" + tanggal Indonesia) → 4 stat cards (grid 4-kol desktop → 2-kol mobile) → tombol "+ Buat Booking" → daftar booking mendatang (booking cards) → kalender bulanan.
- **Stat cards**: Total, Menunggu (nilai gold), Mendatang (nilai ungu/brand), Ditolak (nilai merah). Card putih, `--radius-2xl`, `--shadow-1`, padding 16px; label overline uppercase `--neutral-400`; angka `--text-3xl` bold tabular-nums.
- **Booking card**: nama ruangan (semibold `--text-sm`) + lokasi (subtle) → waktu (Indonesia) → tujuan (muted) → badge status di kanan. Hover: lift ke `--shadow-2` + `translateY(-2px)`.

### 3. Buat Booking (`/bidang/booking/baru`)
- **Purpose**: Form pengajuan booking baru.
- **Components**: Select ruangan, date picker, time start/end, input tujuan, input jumlah peserta, (opsional) fasilitas. Validasi: jumlah peserta ≤ kapasitas ruangan (error merah inline); deteksi bentrok waktu → alert warning gold "Ruangan sudah dibooking pada waktu yang sama." Tombol Batal (secondary) + Ajukan (primary ungu).

### 4. Dashboard Pengelola (`/pengelola`)
- **Purpose**: Approve/reject booking + ringkasan.
- **Layout**: Mirip dashboard bidang. Stat cards: Perlu Disetujui (gold), Ruangan Aktif, dst. Daftar **Kartu Persetujuan**.
- **Kartu Persetujuan**: nama ruangan + bidang + waktu; jika bentrok tampilkan **conflict warning box** (bg `--gold-50`, teks `--warning-fg`); textarea catatan; tombol Setujui (primary ungu, ikon check) + Tolak (danger). Avatar pengelola pakai inisial pada lingkaran `--blue-100`/`--blue-700`.

### 5. Kelola Ruangan (`/pengelola/ruangan`) — Admin
- **Purpose**: CRUD ruangan.
- **Components**: Tabel data ruangan (nama, lokasi, kapasitas, status badge aktif/nonaktif, aksi) + form Tambah/Ubah (nama, lokasi, kapasitas, status select, fasilitas comma-separated, komponen ruangan checkbox-chips). Modal konfirmasi saat nonaktifkan ruangan.

### 6. Riwayat (`/pengelola/riwayat`)
- **Purpose**: Semua booking + filter + pagination.
- **Components**: Filter bar (select status / ruangan / bidang) + tabel (ruangan, bidang, waktu, tujuan ellipsis, peserta, badge status) + pagination (Sebelumnya / "1 / N" / Berikutnya).

### 7. Jadwal / Timeline (`/pengelola/jadwal`, `/bidang/jadwal`)
- **Timeline jadwal**: baris per ruangan, kolom jam 07:00–21:00, bar booking diposisikan dengan persen lebar. Scroll horizontal di mobile (min-width ~600px). Bar approved = hijau (`--success-500`), pending = gold.
- **Kalender bulanan**: grid 7-kol; hari ini = lingkaran ungu (`--purple-600`); dot indikator per hari (ungu/sukses-hijau, gold, merah).

---

## Komponen Inti (spesifikasi)

### Topbar
- Sticky, tinggi 52–56px, `background: rgba(255,255,255,.92)` + `backdrop-filter: blur`, border-bottom `--color-border-muted`.
- Kiri: logomark vesica (28px) + wordmark "Temu". Tengah: nav links. Kanan: bell (badge merah jumlah notif) + avatar (inisial pada lingkaran).
- Nav link aktif: bg `--purple-50`, teks `--purple-700`, weight 600. (Dark: bg `rgba(160,32,240,.18)`, teks `#C98AF5`.)

### Tombol
| Varian | bg | teks | border |
|---|---|---|---|
| Primary | `--color-brand-primary` (#8612D2) | putih | — |
| Primary hover | `--color-brand-primary-dark` (#6A0EA6) | putih | — |
| Secondary | `--color-bg-default` | `--neutral-700` | `--color-border-default` |
| Danger | putih | `--red-500` | `--neutral-200` |
| Ghost | transparan | `--purple-600` | — |
- Radius `--radius-md` (6px). Press: `scale(0.98)`. Transisi `--transition-fast`.

### Badge Status (pill, `--radius-full`)
| Status | bg | teks | dot |
|---|---|---|---|
| Disetujui | `--success-50` | `--success-700` | `--success-500` |
| Menunggu | `--gold-50` | `--warning-fg` | `--gold-400` |
| Ditolak | `--red-50` | `--red-600` | `--red-400` |
| Batal | `--neutral-100` | `--neutral-500` | `--neutral-300` |

### Lainnya
Stat card, booking card, kartu persetujuan, form input/select/textarea, alert (success/warning/danger/info), modal konfirmasi, toast (success/error/warning, pojok kanan atas, auto-dismiss 4s), skeleton loading (shimmer), data table, pagination, empty state, 404 page — semua tampil lengkap di `Design System Temu.html`.

---

## Interactions & Behavior
- **Approve/Reject**: server action → update status → toast sukses/error → refresh list.
- **Deteksi bentrok**: cek overlap waktu pada ruangan (& komponen aula) sebelum submit; tampilkan warning, blokir submit jika bentrok keras.
- **Validasi peserta**: `jumlahPeserta > kapasitas` → error inline merah.
- **Modal konfirmasi**: untuk batalkan booking, nonaktifkan ruangan, hapus. Tutup via Esc / klik backdrop / tombol ×. Aksi destruktif = btn-danger di kanan.
- **Animasi**: minimal. Hover 150ms; enter 200ms ease-out fadeInUp; hormati `prefers-reduced-motion`.
- **Responsive**: desktop nav links di topbar tetap dipakai di mobile (TIDAK ada bottom nav — jumlah menu sedikit, muat di topbar kompak). Stat cards 4→2 kol. Kalender & timeline 1 kol; timeline scroll-x. Touch target ≥44px.

## Dark Mode
Toggle via `<html data-theme="dark">`. Semua nilai sudah di `temu-tokens.css` (blok `:root[data-theme="dark"]`). Brand tetap ungu; neutral jadi ungu-gelap; "Disetujui" tetap hijau (lebih cerah agar kontras ≥4.5:1); background status jadi gelap dengan teks cerah. Implementasi disarankan pakai **next-themes** (`attribute="data-theme"` atau `class` — sesuaikan selector).

## Design Tokens
Semua token ada di **`temu-tokens.css`** — import sekali di root. Ringkas:
- **Warna**: skala purple/green/blue/gold/red/neutral 50–900 + token semantik `--color-*` + `--success-*`.
- **Spacing**: base 4px → `--space-0..32`.
- **Type**: Plus Jakarta Sans (400/500/600/700/800) + JetBrains Mono; `--text-xs..5xl`.
- **Radius**: input/btn 6px, card 8px, modal 10px, badge pill, avatar circle.
- **Shadow**: `--shadow-1..4` + `--shadow-focus` (ungu).
- **Transisi**: `--transition-fast/base/exit`.

Untuk Tailwind, map ke config (lihat seksi "Tailwind Mapping" di Design System Temu.html):
```ts
theme.extend.colors = {
  brand:   { primary:'#8612D2', dark:'#6A0EA6', light:'#EED7FC' },
  success: { DEFAULT:'#1A8A5C', dark:'#0D5C3A', light:'#F0F8F4' },
}
```

## Assets
- **Ikon**: Phosphor Icons (regular) via CDN — `<i class="ph ph-..."></i>`. Tidak ada icon font yang di-bundle.
- **Font**: Plus Jakarta Sans + JetBrains Mono via Google Fonts (di-import di `temu-tokens.css`).
- **Logo**: vesica SVG (inline, lihat di atas). Tidak ada file raster.

## Files in this bundle
- `temu-tokens.css` — **token CSS siap import** (warna, type, spacing, radius, shadow, transisi, dark mode). Sumber kebenaran.
- `Design System Temu.html` — **referensi visual lengkap** & interaktif (semua komponen, pola halaman, copy-to-clipboard code, Tailwind mapping, checklist implementasi, light/dark toggle). Buka di browser.
- `Logo Temu.html` — eksplorasi 4 konsep logo + spesifikasi konsep terpilih (Titik Temu).
- `README.md` — dokumen ini.

> Buka `Design System Temu.html` di browser sebagai panduan utama saat implementasi — punya tombol "Salin" di setiap blok kode dan checklist langkah.
