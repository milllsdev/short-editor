import Link from "next/link";

export function Brand({ href = "/", navbar = false }: { href?: string; navbar?: boolean }) {
  return (
    <Link href={href} className={`inline-flex items-center font-medium text-white ${navbar ? "gap-1.5" : "gap-2.5"}`}>
      <BrandMark navbar={navbar} />
      <span className={navbar ? "text-lg" : "text-base"}>Rendo</span>
    </Link>
  );
}

function BrandMark({ navbar }: { navbar: boolean }) {
  return (
    <span className={`grid place-items-center rounded-[11px] bg-[#3478f6] text-[#e8eaed] ${navbar ? "-ml-1 size-[38px]" : "h-[34px] w-8"}`}>
      <svg aria-hidden="true" viewBox="0 0 24 28" className={navbar ? "h-[30px] w-[26px]" : "h-[26px] w-[22px]"} fill="currentColor">
        <rect x="2" y="1" width="5" height="26" />
        <rect x="7" y="1" width="10" height="5" />
        <rect x="17" y="6" width="5" height="8" />
        <rect x="7" y="14" width="10" height="5" />
        <rect x="12" y="19" width="5" height="4" />
        <rect x="17" y="23" width="5" height="4" />
      </svg>
    </span>
  );
}
