import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { redirectIfAuthenticated } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return <AuthShell title="Create your account" description="Start turning long-form footage into polished Shorts." minimal showLegal footer={<>Already have an account? <Link href="/sign-in" className="font-medium text-blue-300 hover:text-blue-200">Sign in</Link></>}><AuthForm mode="sign-up" /></AuthShell>;
}
