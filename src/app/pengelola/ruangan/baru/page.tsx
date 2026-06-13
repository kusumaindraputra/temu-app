import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { buatRuangan } from "../actions";
import FormRuangan from "../_form";

export default async function HalamanRuanganBaru() {
  await wajibAdmin();

  const komponen = await db.komponen.findMany({ orderBy: { nama: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">Tambah Ruangan</h1>
      <FormRuangan aksi={buatRuangan} semuaKomponen={komponen} />
    </div>
  );
}
