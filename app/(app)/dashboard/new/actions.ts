"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedContentTypes = ["Podcast", "Interview", "Talking Head", "Educational"] as const;

export async function createProject(input: { name: string; contentType: string }) {
  const name = input.name.trim();

  if (!name || name.length > 120) {
    return { error: "Project name must be between 1 and 120 characters." };
  }
  if (!allowedContentTypes.includes(input.contentType as (typeof allowedContentTypes)[number])) {
    return { error: "Choose a valid content type." };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) return { error: "Your session has expired. Please sign in again." };

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, content_type: input.contentType, status: "draft" })
    .select("id")
    .single();

  if (error || !data) return { error: "We could not create the project. Please try again." };

  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${data.id}`);
}
