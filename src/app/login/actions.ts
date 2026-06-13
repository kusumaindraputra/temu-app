"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { buatSesi } from "@/lib/session";

const skema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginState = { error?: string };

export async function aksiLogin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = skema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." };
  }
  const { username, password } = parsed.data;

  // Cek akun pengelola/admin lebih dulu, lalu akun bidang.
  const pengelola = await db.pengelola.findUnique({ where: { username } });
  if (pengelola?.aktif && bcrypt.compareSync(password, pengelola.password)) {
    await buatSesi({
      id: pengelola.id,
      nama: pengelola.nama,
      username: pengelola.username,
      tipe: "PENGELOLA",
      role: pengelola.role,
    });
    redirect("/pengelola");
  }

  const bidang = await db.bidang.findUnique({ where: { username } });
  if (bidang?.aktif && bcrypt.compareSync(password, bidang.password)) {
    await buatSesi({
      id: bidang.id,
      nama: bidang.nama,
      username: bidang.username,
      tipe: "BIDANG",
    });
    redirect("/bidang");
  }

  return { error: "Username atau password salah." };
}
