# Booking Ruang Meeting — Dinas Kesehatan

Aplikasi web pemesanan ruang meeting untuk Dinas Kesehatan. Bidang (unit kerja) mengajukan booking, Pengelola menyetujui atau menolak. Dilengkapi kalender, jadwal harian visual, notifikasi in-app, dan dukungan PWA.

## Fitur

- **Booking dengan approval** — bidang mengajukan, pengelola menyetujui/menolak dengan catatan
- **Deteksi bentrok otomatis** — termasuk Aula yang dapat dibagi (split: Aula A + B = Aula Penuh)
- **Jadwal harian visual** — timeline 07:00–22:00 WIB, navigasi per hari
- **Kalender bulanan** — tampilan dot-per-hari; bidang lihat ketersediaan semua ruangan
- **Notifikasi in-app** — badge di header, dibuat otomatis saat booking disetujui/ditolak
- **Admin CRUD** — kelola ruangan (+ komponen Aula), akun bidang, akun pengelola
- **Riwayat booking** — filter per status, ditampilkan siapa yang memproses
- **PWA** — dapat diinstal di perangkat mobile/desktop

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16.2.9 (App Router, React 19) |
| Database | PostgreSQL 17 + Prisma 6 |
| Auth | JWT via `jose` (cookie httpOnly) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5 |

## Prasyarat

- **Node.js** 20+
- **PostgreSQL** 17
- **npm**

## Setup Lokal

### 1. Clone & install

```bash
git clone https://github.com/NAMA_USER/temu-app.git
cd temu-app
npm install
```

### 2. Buat database

```sql
CREATE DATABASE temu_booking;
```

### 3. Konfigurasi environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/temu_booking"
AUTH_SECRET="string-acak-minimal-32-karakter"
```

> Generate `AUTH_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Migrasi & seed

```bash
npm run db:migrate
npm run db:seed
```

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Akun Default (setelah seed)

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Pengelola | `pengelola` | `pengelola123` |
| Bidang | `kesmas`, `kesling`, dll | `bidang123` |

## Aturan Aula Split

Aula dapat dibagi menjadi dua bagian:

| Ruangan | Komponen |
|---|---|
| Aula A | `Aula-1` |
| Aula B | `Aula-2` |
| Aula Penuh | `Aula-1`, `Aula-2` |

Booking Aula Penuh otomatis bentrok dengan Aula A atau Aula B pada waktu yang sama, dan sebaliknya.

## Instalasi PWA

### Android (Chrome)
1. Buka di Chrome → tap menu (⋮) → **Add to Home screen**

### iOS (Safari)
1. Buka di Safari → tap Share → **Add to Home Screen**

### Desktop (Chrome/Edge)
1. Klik ikon install (⊕) di address bar kanan

## Scripts

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Jalankan build
npm run db:migrate   # Jalankan migrasi
npm run db:seed      # Seed data
npm run db:studio    # Prisma Studio (GUI database)
```

## Struktur Direktori

```
src/
├── app/
│   ├── bidang/          # Halaman untuk akun Bidang
│   │   ├── booking/     # Form booking baru
│   │   ├── jadwal/      # Jadwal harian visual
│   │   ├── kalender/    # Kalender ketersediaan ruangan
│   │   └── notifikasi/  # Notifikasi in-app
│   ├── pengelola/       # Halaman untuk Pengelola/Admin
│   │   ├── akun/        # CRUD akun
│   │   ├── jadwal/      # Jadwal harian
│   │   ├── kalender/    # Kalender booking
│   │   ├── riwayat/     # Riwayat booking
│   │   └── ruangan/     # CRUD ruangan
│   └── icons/           # PWA icon route handler
├── components/          # Komponen reusable
└── lib/                 # Utilities & domain logic
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## Lisensi

MIT
