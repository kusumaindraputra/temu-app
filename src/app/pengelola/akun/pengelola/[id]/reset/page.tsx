import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { resetPasswordPengelola } from "../../../actions";
import FormResetPassword from "../../../_form-reset";

export default async function HalamanResetPengelola({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await wajibAdmin();

  const { id: idStr } = await params;
  const id = Number(idStr);

  const akun = await db.pengelola.findUnique({ where: { id }, select: { id: true, nama: true } });
  if (!akun) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">Reset Password Pengelola</h1>
      <FormResetPassword aksi={resetPasswordPengelola} id={akun.id} nama={akun.nama} />
    </div>
  );
}
