import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { ubahRuangan } from "../../actions";
import FormRuangan from "../../_form";

export default async function HalamanUbahRuangan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await wajibAdmin();

  const { id: idStr } = await params;
  const id = Number(idStr);

  const [ruangan, komponen] = await Promise.all([
    db.ruangan.findUnique({
      where: { id },
      include: { komponen: { select: { id: true } } },
    }),
    db.komponen.findMany({ orderBy: { nama: "asc" } }),
  ]);

  if (!ruangan) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">Ubah Ruangan</h1>
      <FormRuangan
        aksi={ubahRuangan}
        semuaKomponen={komponen}
        awal={{
          id: ruangan.id,
          nama: ruangan.nama,
          lokasi: ruangan.lokasi,
          kapasitas: String(ruangan.kapasitas),
          fasilitas: ruangan.fasilitas.join(", "),
          komponenIds: ruangan.komponen.map((k) => k.id),
          aktif: ruangan.aktif,
        }}
      />
    </div>
  );
}
