import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/supabase/database.types";

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
