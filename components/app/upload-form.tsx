"use client";

import { useRef, useState, type DragEvent } from "react";
import { Check, FileVideo, Link2, Upload, X } from "lucide-react";

const contentTypes = ["Podcast", "Interview", "Talking Head", "Educational"];

export function UploadForm() {
  const [contentType, setContentType] = useState("Podcast");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFiles(files: FileList | null) {
    const selected = files?.[0];
    if (selected) setFile(selected);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFiles(event.dataTransfer.files);
  }

  return (
    <div className="space-y-7">
      <div>
        <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-zinc-200">Project name</label>
        <input id="project-name" defaultValue="Untitled project" className="h-11 w-full rounded-md border border-white/10 bg-[#111318] px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none" />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-zinc-200">What type of content is this?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {contentTypes.map((type) => <button type="button" key={type} onClick={() => setContentType(type)} aria-pressed={contentType === type} className={`relative min-h-11 rounded-[var(--button-radius)] border px-4 py-0.5 text-sm transition-colors ${contentType === type ? "border-blue-400 bg-blue-400/10 text-white" : "border-white/10 bg-[#111318] text-zinc-400 hover:border-white/20 hover:text-white"}`}>{type}{contentType === type && <Check className="absolute right-2 top-2 size-3.5 text-blue-300" />}</button>)}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-200">Add your video</p>
        <input ref={inputRef} className="sr-only" type="file" accept="video/mp4,video/quicktime,video/x-m4v,video/webm" onChange={(event) => chooseFiles(event.target.files)} />
        {file ? (
          <div className="flex min-h-56 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-6">
            <div className="text-center"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-md bg-emerald-400/10 text-emerald-300"><FileVideo className="size-6" /></span><p className="font-medium text-white">{file.name}</p><p className="mt-1 text-xs text-zinc-500">{formatBytes(file.size)} · Ready to generate</p><button type="button" onClick={() => setFile(null)} className="mx-auto mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"><X className="size-3.5" />Remove video</button></div>
          </div>
        ) : (
          <div role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`flex min-h-64 cursor-pointer items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors ${isDragging ? "border-blue-400 bg-blue-400/[0.08]" : "border-white/15 bg-[#0d0f13] hover:border-blue-400/60 hover:bg-blue-400/[0.03]"}`}>
            <div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300"><Upload className="size-5" /></span><p className="font-medium text-white">Drop your video here</p><p className="mt-1.5 text-sm text-zinc-500">or <span className="text-blue-300">browse your files</span></p><p className="mt-5 text-xs text-zinc-600">MP4, MOV, M4V, or WebM · Up to 5 GB · 3 hours maximum</p></div>
          </div>
        )}
      </div>

      <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/[0.08]" /></div><div className="relative flex justify-center"><span className="bg-[#08090b] px-3 text-[11px] uppercase text-zinc-600">or</span></div></div>

      {!showLink ? <button type="button" onClick={() => setShowLink(true)} className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--button-radius)] border border-white/10 bg-white/[0.025] px-5 py-0.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"><Link2 className="size-4" />Import from a link</button> : <div><label htmlFor="video-link" className="sr-only">Video link</label><div className="flex gap-2"><div className="relative flex-1"><Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" /><input id="video-link" placeholder="Paste a YouTube, Google Drive, or direct video link" className="h-11 w-full rounded-md border border-white/10 bg-[#111318] pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none" /></div><button type="button" className="h-11 rounded-[var(--button-radius)] border border-white/10 px-5 py-0.5 text-sm text-zinc-300 hover:bg-white/[0.04]">Import</button></div></div>}

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-zinc-600">Your original video remains unchanged.</p>
        <button type="button" disabled={!file} className="h-11 rounded-[var(--button-radius)] bg-blue-500 px-7 py-0.5 text-sm text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600">Generate Shorts</button>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
