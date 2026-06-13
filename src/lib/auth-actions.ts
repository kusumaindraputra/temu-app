"use server";

import { redirect } from "next/navigation";
import { hapusSesi } from "@/lib/session";

export async function aksiLogout() {
  await hapusSesi();
  redirect("/login");
}
