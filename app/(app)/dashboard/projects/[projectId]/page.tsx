import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import { getProject } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9">
      <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"><ArrowLeft className="size-4" />Back to dashboard</Link>
      <header className="mb-8"><div className="mb-3 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-[#171a21] text-zinc-300"><Film className="size-5" /></span><span className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] capitalize text-zinc-500">{project.status}</span></div><h1 className="text-2xl font-semibold text-white sm:text-3xl">{project.name}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{project.content_type ?? "Content type not specified"} · Created {new Date(project.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p></header>
      <section className="flex min-h-[320px] items-center justify-center rounded-lg border border-white/[0.08] bg-[#0e1014] px-6 py-12 text-center"><div className="max-w-md"><span className="mx-auto mb-5 grid size-14 place-items-center rounded-lg border border-white/10 bg-[#171a21] text-zinc-300"><Film className="size-6" /></span><h2 className="text-lg font-semibold text-white">Project created</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Your project metadata is saved. Video upload and processing will be added in a later step.</p></div></section>
    </div>
  );
}
