"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({
  mode,
  next = "/dashboard",
  initialError,
}: {
  mode: Mode;
  next?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [success, setSuccess] = useState("");

  const needsEmail = mode !== "reset-password";
  const needsPassword = mode !== "forgot-password";
  const needsConfirmation = mode === "sign-up" || mode === "reset-password";
  const submitLabel = {
    "sign-in": "Sign in",
    "sign-up": "Create account",
    "forgot-password": "Send reset link",
    "reset-password": "Update password",
  }[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm-password") ?? "");

    if (needsEmail && !emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (needsPassword && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (needsConfirmation && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const supabase = createClient();

      if (mode === "sign-in") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace(next);
        router.refresh();
        return;
      }

      if (mode === "sign-up") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }
        setSuccess("Check your email to confirm your account, then return to sign in.");
      }

      if (mode === "forgot-password") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (authError) throw authError;
        setSuccess("If an account exists for that email, a password reset link is on its way.");
      }

      if (mode === "reset-password") {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setSuccess("Your password has been updated. Redirecting to your dashboard...");
        window.setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 700);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {needsEmail && (
        <div>
          <label htmlFor={`${mode}-email`} className="mb-2 block text-sm font-medium text-zinc-200">Email</label>
          <input id={`${mode}-email`} name="email" type="email" autoComplete="email" required disabled={pending} className="h-11 w-full rounded-md border border-white/10 bg-[#111318] px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none disabled:opacity-60" placeholder="you@example.com" />
        </div>
      )}

      {needsPassword && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor={`${mode}-password`} className="text-sm font-medium text-zinc-200">Password</label>
            {mode === "sign-in" && <Link href="/forgot-password" className="text-xs text-blue-300 transition-colors hover:text-blue-200">Forgot password?</Link>}
          </div>
          <input id={`${mode}-password`} name="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} required minLength={8} disabled={pending} className="h-11 w-full rounded-md border border-white/10 bg-[#111318] px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none disabled:opacity-60" placeholder="At least 8 characters" />
        </div>
      )}

      {needsConfirmation && (
        <div>
          <label htmlFor={`${mode}-confirm-password`} className="mb-2 block text-sm font-medium text-zinc-200">Confirm password</label>
          <input id={`${mode}-confirm-password`} name="confirm-password" type="password" autoComplete="new-password" required minLength={8} disabled={pending} className="h-11 w-full rounded-md border border-white/10 bg-[#111318] px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none disabled:opacity-60" placeholder="Repeat your password" />
        </div>
      )}

      {error && <p role="alert" className="rounded-md border border-red-400/20 bg-red-400/[0.06] px-3.5 py-3 text-sm leading-5 text-red-200">{error}</p>}
      {success && <p role="status" className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-3 text-sm leading-5 text-emerald-200">{success}</p>}

      <button type="submit" disabled={pending || Boolean(success && mode !== "reset-password")} className="h-11 w-full rounded-[var(--button-radius)] bg-blue-500 px-5 py-0.5 text-sm text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">
        {pending ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}
