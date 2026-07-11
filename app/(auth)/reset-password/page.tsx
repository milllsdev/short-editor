import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  await requireAuthenticatedUser("/reset-password");
  return <AuthShell title="Choose a new password" description="Use at least 8 characters for your new password."><AuthForm mode="reset-password" /></AuthShell>;
}
