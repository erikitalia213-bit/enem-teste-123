"use server";

import { redirect } from "next/navigation";
import { obterRepositorio } from "@/lib/dados";

export async function sair() {
  await obterRepositorio().sair();
  redirect("/login");
}
