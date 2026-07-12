import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Film, Plus, Sparkles } from "lucide-react";
import { listProjects } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  let projects = await listProjects().catch(() => null);
  const loadError = projects === null;
  projects ??= [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div><p className="mb-1 text-sm text-zinc-500">Friday, July 10</p><h1 className="text-2xl font-semibold text-white sm:text-3xl">Dashboard</h1></div>
        <Link href="/dashboard/new" className="button-label inline-flex h-10 items-center gap-2 rounded-[var(--button-radius)] bg-blue-500 px-5 py-0.5 text-sm text-white transition-colors hover:bg-blue-400"><Plus className="size-4" /><span className="hidden sm:inline">New project</span><span className="sm:hidden">New</span></Link>
      </header>

      <section aria-labelledby="usage-heading" className="mb-10">
        <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><h2 id="usage-heading" className="text-sm font-medium text-zinc-300">Monthly usage</h2><span className="rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-zinc-600">Preview</span></div><span className="text-xs text-zinc-500">Resets Aug 1</span></div>
        <div className="grid gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          <UsageItem icon={<Clock3 className="size-4" />} label="Processing time" value="0 / 120 min" />
          <UsageItem icon={<Film className="size-4" />} label="Shorts generated" value="0 this month" />
          <div className="bg-[#111318] p-5"><div className="mb-3 flex items-center gap-2 text-xs text-zinc-500"><Sparkles className="size-4 text-blue-300" />Creator plan</div><Link href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-300">View plan</Link></div>
        </div>
      </section>

      <section aria-labelledby="projects-heading">
        <div className="mb-3 flex items-center justify-between"><h2 id="projects-heading" className="text-lg font-semibold text-white">Recent projects</h2><span className="text-xs text-zinc-600">{projects.length} {projects.length === 1 ? "project" : "projects"}</span></div>
        {loadError ? (
          <div className="rounded-lg border border-red-400/15 bg-red-400/[0.04] px-5 py-6 text-sm text-red-200">Projects could not be loaded. Confirm the Supabase migration has been applied, then try again.</div>
        ) : projects.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-white/[0.08] bg-[#0e1014] px-6 py-12 text-center">
            <div className="max-w-md"><span className="mx-auto mb-5 grid size-14 place-items-center rounded-lg border border-white/10 bg-[#171a21] text-zinc-300"><Film className="size-6" /></span><h3 className="text-lg font-semibold text-white">Create your first standout Short</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">Add a podcast, interview, or talking-head video. Rendo will find the strongest moments and prepare them for vertical video.</p><Link href="/dashboard/new" className="button-label mt-6 inline-flex h-10 items-center gap-2 rounded-[var(--button-radius)] bg-white px-5 py-0.5 text-sm text-black transition-colors hover:bg-zinc-200"><Plus className="size-4" />Create a project</Link><p className="mt-4 text-xs text-zinc-600">Your projects and generated clips will appear here.</p></div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0e1014]">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="flex items-center gap-4 border-b border-white/[0.07] px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.025] sm:px-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#171a21] text-zinc-400"><Film className="size-4.5" /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{project.name}</p><p className="mt-1 text-xs text-zinc-600">{project.content_type ?? "Unspecified"} · Created {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div>
                <span className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] capitalize text-zinc-500">{project.status}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UsageItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="bg-[#111318] p-5"><div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">{icon}{label}</div><p className="text-xl font-semibold text-white">{value}</p><div className="mt-4 h-1.5 rounded-full bg-zinc-800"><div className="h-full w-0 rounded-full bg-blue-400" /></div></div>;
}
