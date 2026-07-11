import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function redirectIfAuthenticated() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/dashboard");
}

export async function requireAuthenticatedUser(next = "/dashboard") {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return data.claims;
}
