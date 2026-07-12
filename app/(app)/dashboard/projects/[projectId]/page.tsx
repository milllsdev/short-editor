import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import { getProject, getProjectVideoAsset } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project, video] = await Promise.all([getProject(projectId), getProjectVideoAsset(projectId)]);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9">
      <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"><ArrowLeft className="size-4" />Back to dashboard</Link>
      <header className="mb-8"><div className="mb-3 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-[#171a21] text-zinc-300"><Film className="size-5" /></span><span className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[11px] capitalize text-zinc-500">{project.status}</span></div><h1 className="text-2xl font-semibold text-white sm:text-3xl">{project.name}</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{project.content_type ?? "Content type not specified"} · Created {formatDate(project.created_at)}</p></header>

      {video?.signedUrl ? (
        <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0e1014]">
          <div className="bg-black"><video controls preload="metadata" src={video.signedUrl} className="mx-auto max-h-[620px] w-full bg-black" aria-label={`Video preview for ${project.name}`} /></div>
          <div className="grid gap-4 border-t border-white/[0.08] px-5 py-5 sm:grid-cols-3 sm:px-6"><Detail label="Original filename" value={video.asset.original_filename} /><Detail label="File size" value={formatBytes(video.asset.size_bytes)} /><Detail label="Uploaded" value={formatDate(video.asset.created_at)} /></div>
        </section>
      ) : video ? (
        <section className="flex min-h-[320px] items-center justify-center rounded-lg border border-white/[0.08] bg-[#0e1014] px-6 py-12 text-center"><div className="max-w-md"><span className="mx-auto mb-5 grid size-14 place-items-center rounded-lg border border-white/10 bg-[#171a21] text-zinc-300"><Film className="size-6" /></span><h2 className="text-lg font-semibold text-white">Upload incomplete</h2><p className="mt-2 text-sm leading-6 text-zinc-500">The metadata for {video.asset.original_filename} is saved, but the private video upload has not completed.</p></div></section>
      ) : (
        <section className="flex min-h-[320px] items-center justify-center rounded-lg border border-white/[0.08] bg-[#0e1014] px-6 py-12 text-center"><div className="max-w-md"><span className="mx-auto mb-5 grid size-14 place-items-center rounded-lg border border-white/10 bg-[#171a21] text-zinc-300"><Film className="size-6" /></span><h2 className="text-lg font-semibold text-white">No video uploaded</h2><p className="mt-2 text-sm leading-6 text-zinc-500">This project does not have a video asset yet.</p></div></section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="text-xs text-zinc-600">{label}</p><p className="mt-1 truncate text-sm text-zinc-300" title={value}>{value}</p></div>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
