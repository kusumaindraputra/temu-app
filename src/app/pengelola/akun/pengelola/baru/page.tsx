import { wajibAdmin } from "@/lib/auth";
import FormPengelolaBaru from "./form";

export default async function HalamanPengelolaBaru() {
  await wajibAdmin();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">Tambah Akun Pengelola</h1>
      <FormPengelolaBaru />
    </div>
  );
}
