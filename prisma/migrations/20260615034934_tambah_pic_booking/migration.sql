-- AlterTable: tambah kolom PIC dengan default untuk baris lama
ALTER TABLE "Booking" ADD COLUMN "picNama" TEXT NOT NULL DEFAULT '-',
ADD COLUMN "picHp" TEXT NOT NULL DEFAULT '08000000000';

-- Hapus default setelah kolom terisi (kolom baru wajib diisi via form)
ALTER TABLE "Booking" ALTER COLUMN "picNama" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "picHp" DROP DEFAULT;
