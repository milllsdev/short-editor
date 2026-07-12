"use client";

import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, FileVideo, Link2, Upload, X } from "lucide-react";
import { finalizeProjectUpload, prepareProjectUpload } from "@/app/(app)/dashboard/new/actions";

const contentTypes = ["Podcast", "Interview", "Talking Head", "Educational"];
const allowedMimeTypes = ["video/mp4", "video/quicktime"];
const maxFileSize = 50 * 1024 * 1024;

type PreparedUpload = { projectId: string; assetId: string; signedUrl: string };
type UploadStatus = "idle" | "preparing" | "uploading" | "finalizing" | "success" | "error";

export function UploadForm() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("Untitled project");
  const [contentType, setContentType] = useState("Podcast");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [preparedUpload, setPreparedUpload] = useState<PreparedUpload | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  function chooseFiles(files: FileList | null) {
    const selected = files?.[0];
    if (!selected) return;
    if (!allowedMimeTypes.includes(selected.type)) {
      setFile(null);
      setError("Choose an MP4 or MOV video.");
      return;
    }
    if (selected.size <= 0 || selected.size > maxFileSize) {
      setFile(null);
      setError("Video must be 50 MB or smaller.");
      return;
    }
    setFile(selected);
    setPreparedUpload(null);
    setProgress(0);
    setStatus("idle");
    setError("");
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFiles(event.dataTransfer.files);
  }

  async function handleCreateProject() {
    if (!file || ["preparing", "uploading", "finalizing"].includes(status)) return;
    setError("");
    setProgress(0);

    try {
      let upload = preparedUpload;
      if (!upload) {
        setStatus("preparing");
        const durationSeconds = await readVideoDuration(file);
        const prepared = await prepareProjectUpload({
          name: projectName,
          contentType,
          originalFilename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          durationSeconds,
        });
        if (!prepared.data) throw new Error(prepared.error);
        upload = prepared.data;
        setPreparedUpload(upload);
      }

      setStatus("uploading");
      await uploadFile(upload.signedUrl, file, setProgress, xhrRef);
      setStatus("finalizing");
      const finalized = await finalizeProjectUpload({ projectId: upload.projectId, assetId: upload.assetId });
      if (!finalized.data) throw new Error(finalized.error);
      setProgress(100);
      setStatus("success");
      router.push(`/dashboard/projects/${finalized.data.projectId}`);
      router.refresh();
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "The upload failed. Please try again.");
    } finally {
      xhrRef.current = null;
    }
  }

  function cancelUpload() {
    xhrRef.current?.abort();
  }

  const isBusy = status === "preparing" || status === "uploading" || status === "finalizing";

  return (
    <div className="space-y-7">
      <div>
        <label htmlFor="project-name" className="mb-2 block text-sm font-medium text-zinc-200">Project name</label>
        <input id="project-name" value={projectName} onChange={(event) => setProjectName(event.target.value)} maxLength={120} className="h-11 w-full rounded-md border border-white/10 bg-[#111318] px-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none" />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-zinc-200">What type of content is this?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {contentTypes.map((type) => <button type="button" key={type} onClick={() => setContentType(type)} aria-pressed={contentType === type} className={`relative min-h-11 rounded-[var(--button-radius)] border px-4 py-0.5 text-sm transition-colors ${contentType === type ? "border-blue-400 bg-blue-400/10 text-white" : "border-white/10 bg-[#111318] text-zinc-400 hover:border-white/20 hover:text-white"}`}>{type}{contentType === type && <Check className="absolute right-2 top-2 size-3.5 text-blue-300" />}</button>)}
        </div>
      </fieldset>

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-200">Add your video</p>
        <input ref={inputRef} className="sr-only" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" disabled={isBusy} onChange={(event) => chooseFiles(event.target.files)} />
        {file ? (
          <div className="flex min-h-56 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/[0.04] p-6">
            <div className="w-full max-w-sm text-center"><span className="mx-auto mb-4 grid size-12 place-items-center rounded-md bg-emerald-400/10 text-emerald-300"><FileVideo className="size-6" /></span><p className="truncate font-medium text-white">{file.name}</p><p className="mt-1 text-xs text-zinc-500">{formatBytes(file.size)} · {uploadStatusLabel(status, progress)}</p>{status !== "idle" && <div className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-blue-400 transition-[width]" style={{ width: `${progress}%` }} /></div>}{status === "uploading" ? <button type="button" onClick={cancelUpload} className="mx-auto mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"><X className="size-3.5" />Cancel upload</button> : !preparedUpload && !isBusy ? <button type="button" onClick={() => setFile(null)} className="mx-auto mt-4 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"><X className="size-3.5" />Remove video</button> : null}</div>
          </div>
        ) : (
          <div role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`flex min-h-64 cursor-pointer items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors ${isDragging ? "border-blue-400 bg-blue-400/[0.08]" : "border-white/15 bg-[#0d0f13] hover:border-blue-400/60 hover:bg-blue-400/[0.03]"}`}>
            <div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300"><Upload className="size-5" /></span><p className="font-medium text-white">Drop your video here</p><p className="mt-1.5 text-sm text-zinc-500">or <span className="text-blue-300">browse your files</span></p><p className="mt-5 text-xs text-zinc-600">MP4 or MOV · Up to 50 MB</p></div>
          </div>
        )}
      </div>

      <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/[0.08]" /></div><div className="relative flex justify-center"><span className="bg-[#08090b] px-3 text-[11px] uppercase text-zinc-600">or</span></div></div>

      {!showLink ? <button type="button" onClick={() => setShowLink(true)} className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--button-radius)] border border-white/10 bg-white/[0.025] px-5 py-0.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"><Link2 className="size-4" />Import from a link</button> : <div><label htmlFor="video-link" className="sr-only">Video link</label><div className="flex gap-2"><div className="relative flex-1"><Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" /><input id="video-link" placeholder="Paste a YouTube, Google Drive, or direct video link" className="h-11 w-full rounded-md border border-white/10 bg-[#111318] pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-400 focus:outline-none" /></div><button type="button" className="h-11 rounded-[var(--button-radius)] border border-white/10 px-5 py-0.5 text-sm text-zinc-300 hover:bg-white/[0.04]">Import</button></div></div>}

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
        <p role={error ? "alert" : undefined} className={`text-xs ${error ? "text-red-300" : "text-zinc-600"}`}>{error || "Your original video remains unchanged."}</p>
        <button type="button" onClick={handleCreateProject} disabled={!file || isBusy || status === "success"} className="h-11 rounded-[var(--button-radius)] bg-blue-500 px-7 py-0.5 text-sm text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600">{status === "error" && preparedUpload ? "Retry upload" : isBusy ? "Uploading video..." : status === "success" ? "Upload complete" : "Generate Shorts"}</button>
      </div>
    </div>
  );
}

function uploadStatusLabel(status: UploadStatus, progress: number) {
  if (status === "preparing") return "Preparing upload...";
  if (status === "uploading") return `Uploading ${progress}%`;
  if (status === "finalizing") return "Verifying upload...";
  if (status === "success") return "Upload complete";
  if (status === "error") return "Upload paused · Retry when ready";
  return "Ready to upload";
}

function uploadFile(
  signedUrl: string,
  file: File,
  onProgress: (progress: number) => void,
  xhrRef: React.MutableRefObject<XMLHttpRequest | null>,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);

    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error("The video upload failed. Retry when you’re ready."));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("The network interrupted the upload. Retry when you’re ready.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload canceled. You can retry when you’re ready.")));
    xhr.send(body);
  });
}

function readVideoDuration(file: File) {
  return new Promise<number | null>((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? Math.round(video.duration * 100) / 100 : null;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    video.src = url;
  });
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
