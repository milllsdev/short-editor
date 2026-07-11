import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { UploadForm } from "@/components/app/upload-form";

export const metadata: Metadata = { title: "New project" };

export default function NewProjectPage() {
  return <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-9"><Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"><ArrowLeft className="size-4" />Back to dashboard</Link><header className="mb-8"><h1 className="text-2xl font-semibold text-white sm:text-3xl">Create a new project</h1><p className="mt-2 text-sm leading-6 text-zinc-500">Add a long-form video and choose how you want Rendo to understand it.</p></header><div className="rounded-lg border border-white/[0.08] bg-[#0d0f13] p-5 sm:p-8"><UploadForm /></div><p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-600"><LockKeyhole className="size-3" />Your files are private and securely processed.</p></div>;
}
