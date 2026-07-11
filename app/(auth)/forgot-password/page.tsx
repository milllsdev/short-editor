import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return <AuthShell title="Reset your password" description="Enter your email and we’ll send you a secure reset link." footer={<Link href="/sign-in" className="font-medium text-blue-300 hover:text-blue-200">Return to sign in</Link>}><AuthForm mode="forgot-password" /></AuthShell>;
}
