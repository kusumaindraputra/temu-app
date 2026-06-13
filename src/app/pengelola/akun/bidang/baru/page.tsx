import { wajibAdmin } from "@/lib/auth";
import FormBidangBaru from "./form";

export default async function HalamanBidangBaru() {
  await wajibAdmin();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">Tambah Akun Bidang</h1>
      <FormBidangBaru />
    </div>
  );
}
