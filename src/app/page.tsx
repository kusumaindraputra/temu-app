import { redirect } from "next/navigation";
import { ambilSesi } from "@/lib/session";

export default async function Home() {
  const sesi = await ambilSesi();
  if (!sesi) redirect("/login");
  redirect(sesi.tipe === "BIDANG" ? "/bidang" : "/pengelola");
}
