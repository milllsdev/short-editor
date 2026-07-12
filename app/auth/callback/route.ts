import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard";
}

function failureResponse(requestUrl: URL, message: string) {
  const destination = new URL("/sign-in", requestUrl.origin);
  destination.searchParams.set("error", message);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function confirmationErrorMessage(code: string | null, description: string | null) {
  if (code === "otp_expired") {
    return "This confirmation link has expired or has already been used. Request a new confirmation email and try again.";
  }
  return description || "We could not confirm your email. Request a new confirmation email and try again.";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const returnedError = requestUrl.searchParams.get("error");
  const returnedErrorCode = requestUrl.searchParams.get("error_code");
  const returnedErrorDescription = requestUrl.searchParams.get("error_description");

  if (returnedError) {
    return failureResponse(
      requestUrl,
      confirmationErrorMessage(returnedErrorCode, returnedErrorDescription),
    );
  }

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = (requestUrl.searchParams.get("type") ?? "email") as EmailOtpType;
  const destination = new URL(safeNext(requestUrl.searchParams.get("next")), requestUrl.origin);
  const response = NextResponse.redirect(destination);
  const { url, publishableKey } = getSupabaseConfig();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        );
      },
    },
  });

  let authError: { code?: string; message: string } | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error;
  } else if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    authError = error;
  } else {
    authError = { message: "The authentication link is invalid or incomplete." };
  }

  if (authError) {
    return failureResponse(
      requestUrl,
      confirmationErrorMessage(authError.code ?? null, authError.message),
    );
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
