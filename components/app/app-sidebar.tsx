import Link from "next/link";
import { CircleHelp, FolderOpen, LayoutDashboard, Plus, Settings } from "lucide-react";
import { Brand } from "@/components/brand";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard", icon: FolderOpen },
];

export function AppSidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.08] bg-[#0c0e12] md:flex">
        <div className="flex h-16 items-center px-5"><Brand href="/dashboard" /></div>
        <div className="px-3 py-3">
          <Link href="/dashboard/new" className="button-label flex h-10 items-center justify-center gap-2 rounded-[var(--button-radius)] bg-blue-500 px-5 py-0.5 text-sm text-white transition-colors hover:bg-blue-400"><Plus className="size-4" />New project</Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-3" aria-label="Application navigation">
          {navigation.map(({ label, href, icon: Icon }, index) => <Link key={label} href={href} className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm ${index === 0 ? "bg-white/[0.07] text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}><Icon className="size-4" />{label}</Link>)}
        </nav>
        <div className="space-y-1 border-t border-white/[0.08] p-3">
          <span className="flex h-10 items-center gap-3 px-3 text-sm text-zinc-500"><CircleHelp className="size-4" />Help center</span>
          <span className="flex h-10 items-center gap-3 px-3 text-sm text-zinc-500"><Settings className="size-4" />Settings</span>
          <div className="mt-3 flex items-center gap-3 border-t border-white/[0.08] px-2 pt-4">
            <span className="grid size-8 place-items-center rounded-full bg-[#273142] text-xs font-semibold text-blue-200">AM</span>
            <div className="min-w-0"><p className="truncate text-xs font-medium text-white">Alex Morgan</p><p className="truncate text-[11px] text-zinc-500">Creator plan</p></div>
          </div>
        </div>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-white/10 bg-[#0c0e12]/95 px-3 backdrop-blur md:hidden" aria-label="Mobile application navigation">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[10px] text-white"><LayoutDashboard className="size-5" />Home</Link>
        <Link href="/dashboard/new" className="grid size-10 place-items-center rounded-[var(--button-radius)] bg-blue-500 text-white" aria-label="New project"><Plus className="size-5" /></Link>
        <span className="flex flex-col items-center gap-1 text-[10px] text-zinc-500"><Settings className="size-5" />Settings</span>
      </nav>
    </>
  );
}
