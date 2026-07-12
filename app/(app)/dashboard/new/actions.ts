"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const allowedContentTypes = ["Podcast", "Interview", "Talking Head", "Educational"] as const;
const allowedMimeTypes = ["video/mp4", "video/quicktime"] as const;
const maxFileSize = 50 * 1024 * 1024;

type UploadInput = {
  name: string;
  contentType: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds: number | null;
};

function sanitizeFilename(filename: string) {
  const extension = filename.toLowerCase().endsWith(".mov") ? ".mov" : ".mp4";
  const base = filename
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "video";
  return `${base}${extension}`;
}

async function authenticatedContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;
  return { supabase, userId };
}

export async function prepareProjectUpload(input: UploadInput) {
  const name = input.name.trim();

  if (!name || name.length > 120) return { error: "Project name must be between 1 and 120 characters." };
  if (!allowedContentTypes.includes(input.contentType as (typeof allowedContentTypes)[number])) return { error: "Choose a valid content type." };
  if (!allowedMimeTypes.includes(input.mimeType as (typeof allowedMimeTypes)[number])) return { error: "Choose an MP4 or MOV video." };
  if (!Number.isSafeInteger(input.sizeBytes) || input.sizeBytes <= 0 || input.sizeBytes > maxFileSize) return { error: "Video must be 50 MB or smaller." };
  if (input.originalFilename.length < 1 || input.originalFilename.length > 255) return { error: "The video filename is invalid." };
  if (input.durationSeconds !== null && (!Number.isFinite(input.durationSeconds) || input.durationSeconds < 0 || input.durationSeconds > 10800)) return { error: "The video duration is invalid." };

  const context = await authenticatedContext();
  if (!context) return { error: "Your session has expired. Please sign in again." };
  const { supabase, userId } = context;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, content_type: input.contentType, status: "draft" })
    .select("id")
    .single();

  if (projectError || !project) return { error: "We could not create the project. Please try again." };

  const storagePath = `${userId}/${project.id}/${crypto.randomUUID()}-${sanitizeFilename(input.originalFilename)}`;
  const { data: upload, error: uploadUrlError } = await supabase.storage
    .from("videos")
    .createSignedUploadUrl(storagePath, { upsert: true });

  if (uploadUrlError || !upload) {
    await supabase.from("projects").delete().eq("id", project.id).eq("user_id", userId);
    return { error: "We could not prepare the video upload. Confirm the storage migration is applied." };
  }

  const { data: asset, error: assetError } = await supabase
    .from("video_assets")
    .insert({
      project_id: project.id,
      user_id: userId,
      storage_path: storagePath,
      original_filename: input.originalFilename,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      duration_seconds: input.durationSeconds,
    })
    .select("id")
    .single();

  if (assetError || !asset) {
    await supabase.from("projects").delete().eq("id", project.id).eq("user_id", userId);
    return { error: "We could not save the video metadata. Please try again." };
  }

  return { data: { projectId: project.id, assetId: asset.id, signedUrl: upload.signedUrl } };
}

export async function finalizeProjectUpload(input: { projectId: string; assetId: string }) {
  const context = await authenticatedContext();
  if (!context) return { error: "Your session has expired. Please sign in again." };
  const { supabase, userId } = context;

  const { data: asset, error: assetError } = await supabase
    .from("video_assets")
    .select("storage_path")
    .eq("id", input.assetId)
    .eq("project_id", input.projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (assetError || !asset) return { error: "The uploaded video does not belong to this project." };

  const pathParts = asset.storage_path.split("/");
  const filename = pathParts.pop();
  const folder = pathParts.join("/");
  if (!filename || pathParts[0] !== userId || pathParts[1] !== input.projectId) return { error: "The stored video path is invalid." };

  const { data: objects, error: storageError } = await supabase.storage
    .from("videos")
    .list(folder, { limit: 10, search: filename });

  if (storageError || !objects?.some((object) => object.name === filename)) return { error: "The upload could not be verified. Retry the upload." };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${input.projectId}`);
  return { data: { projectId: input.projectId } };
}
