import Link from "next/link";
import { Brand } from "@/components/brand";

export function AuthShell({
  title,
  description,
  children,
  footer,
  minimal = false,
  showLegal = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  minimal?: boolean;
  showLegal?: boolean;
}) {
  return (
    <main className={`flex min-h-screen items-center justify-center px-5 text-white sm:px-8 ${minimal ? "bg-[radial-gradient(circle_at_50%_10%,rgba(52,120,246,0.09),transparent_34%),#08090b] py-14 sm:py-20" : "bg-[#08090b] py-12"}`}>
      <div className={`w-full ${minimal ? "max-w-[420px]" : "max-w-md"}`}>
        <div className={`flex justify-center ${minimal ? "mb-10" : "mb-8"}`}><Brand /></div>
        <section className={minimal ? "w-full" : "rounded-lg border border-white/[0.08] bg-[#0d0f13] p-6 sm:p-8"}>
          <div className={`text-center ${minimal ? "mb-9" : "mb-7"}`}>
            <h1 className={`${minimal ? "text-3xl" : "text-2xl"} font-semibold leading-tight text-white`}>{title}</h1>
            <p className={`mx-auto mt-3 text-sm leading-6 text-zinc-500 ${minimal ? "max-w-sm" : ""}`}>{description}</p>
          </div>
          {children}
        </section>
        {footer && <p className={`${minimal ? "mt-8" : "mt-6"} text-center text-sm text-zinc-500`}>{footer}</p>}
        {showLegal && <p className="mx-auto mt-8 max-w-sm text-center text-xs leading-5 text-zinc-700">By continuing, you agree to Rendo&apos;s <span className="text-zinc-500">Terms of Service</span> and acknowledge the <span className="text-zinc-500">Privacy Policy</span>.</p>}
        <p className={`${minimal ? "mt-6" : "mt-5"} text-center text-xs text-zinc-700`}>
          <Link href="/" className="transition-colors hover:text-zinc-400">Back to Rendo</Link>
        </p>
      </div>
    </main>
  );
}
