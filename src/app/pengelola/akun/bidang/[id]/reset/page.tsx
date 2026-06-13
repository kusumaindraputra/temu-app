import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { wajibAdmin } from "@/lib/auth";
import { resetPasswordBidang } from "../../../actions";
import FormResetPassword from "../../../_form-reset";

export default async function HalamanResetBidang({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await wajibAdmin();

  const { id: idStr } = await params;
  const id = Number(idStr);

  const akun = await db.bidang.findUnique({ where: { id }, select: { id: true, nama: true } });
  if (!akun) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Reset Password Bidang</h1>
      <FormResetPassword aksi={resetPasswordBidang} id={akun.id} nama={akun.nama} />
    </div>
  );
}
