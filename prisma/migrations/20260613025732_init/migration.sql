-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PENGELOLA', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusBooking" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK', 'BATAL');

-- CreateTable
CREATE TABLE "Bidang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengelola" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PENGELOLA',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pengelola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Komponen" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Komponen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "fasilitas" TEXT[],
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "ruanganId" INTEGER NOT NULL,
    "bidangId" INTEGER NOT NULL,
    "waktuMulai" TIMESTAMP(3) NOT NULL,
    "waktuSelesai" TIMESTAMP(3) NOT NULL,
    "tujuan" TEXT NOT NULL,
    "jumlahPeserta" INTEGER NOT NULL,
    "status" "StatusBooking" NOT NULL DEFAULT 'MENUNGGU',
    "catatan" TEXT,
    "diprosesOlehId" INTEGER,
    "diprosesPada" TIMESTAMP(3),
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RuanganKomponen" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RuanganKomponen_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bidang_username_key" ON "Bidang"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pengelola_username_key" ON "Pengelola"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Komponen_nama_key" ON "Komponen"("nama");

-- CreateIndex
CREATE INDEX "Booking_ruanganId_waktuMulai_waktuSelesai_idx" ON "Booking"("ruanganId", "waktuMulai", "waktuSelesai");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "_RuanganKomponen_B_index" ON "_RuanganKomponen"("B");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_diprosesOlehId_fkey" FOREIGN KEY ("diprosesOlehId") REFERENCES "Pengelola"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RuanganKomponen" ADD CONSTRAINT "_RuanganKomponen_A_fkey" FOREIGN KEY ("A") REFERENCES "Komponen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RuanganKomponen" ADD CONSTRAINT "_RuanganKomponen_B_fkey" FOREIGN KEY ("B") REFERENCES "Ruangan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
