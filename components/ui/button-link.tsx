import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "border-[#4b8cff] bg-[#3478f6] text-white hover:border-[#5a96ff] hover:bg-[#4385fa]",
  secondary: "bg-white/[0.04] text-white hover:bg-white/[0.08] border-white/10",
  ghost: "border-transparent text-zinc-300 hover:text-white hover:bg-white/[0.05]",
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`button-label inline-flex h-10 items-center justify-center gap-2 rounded-[var(--button-radius)] border px-5 py-0.5 text-sm transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
