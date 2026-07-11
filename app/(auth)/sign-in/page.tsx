import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { redirectIfAuthenticated } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await redirectIfAuthenticated();
  const params = await searchParams;
  const next = typeof params.next === "string" && params.next.startsWith("/") && !params.next.startsWith("//") ? params.next : "/dashboard";
  const error = typeof params.error === "string" ? params.error : undefined;

  return <AuthShell title="Welcome back" description="Sign in to continue creating with Rendo." minimal showLegal footer={<>New to Rendo? <Link href="/sign-up" className="font-medium text-blue-300 hover:text-blue-200">Create an account</Link></>}><AuthForm mode="sign-in" next={next} initialError={error} /></AuthShell>;
}
