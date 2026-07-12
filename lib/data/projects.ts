import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Project, VideoAsset } from "@/lib/supabase/database.types";

async function authenticatedUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) throw new Error("Authentication required.");
  return { supabase, userId };
}

export async function listProjects(): Promise<Project[]> {
  const { supabase, userId } = await authenticatedUserId();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load projects right now.");
  return data;
}

export async function getProject(projectId: string): Promise<Project | null> {
  const { supabase, userId } = await authenticatedUserId();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error("Unable to load this project right now.");
  return data;
}

export async function getProjectVideoAsset(projectId: string): Promise<{ asset: VideoAsset; signedUrl: string | null } | null> {
  const { supabase, userId } = await authenticatedUserId();
  const { data: asset, error } = await supabase
    .from("video_assets")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Unable to load this project’s video right now.");
  if (!asset) return null;

  const parts = asset.storage_path.split("/");
  const filename = parts.pop();
  const folder = parts.join("/");
  if (!filename || parts[0] !== userId || parts[1] !== projectId) return { asset, signedUrl: null };

  const { data: objects, error: listError } = await supabase.storage
    .from("videos")
    .list(folder, { limit: 10, search: filename });
  if (listError || !objects?.some((object) => object.name === filename)) return { asset, signedUrl: null };

  const { data: signed, error: signedError } = await supabase.storage
    .from("videos")
    .createSignedUrl(asset.storage_path, 600);

  return { asset, signedUrl: signedError ? null : signed.signedUrl };
}
