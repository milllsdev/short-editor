export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; display_name: string | null; avatar_url: string | null; created_at: string; updated_at: string };
        Insert: { id: string; email: string; display_name?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string };
        Update: { email?: string; display_name?: string | null; avatar_url?: string | null; updated_at?: string };
        Relationships: [];
      };
      projects: {
        Row: { id: string; user_id: string; name: string; status: string; content_type: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; name: string; status?: string; content_type?: string | null; created_at?: string; updated_at?: string };
        Update: { name?: string; status?: string; content_type?: string | null; updated_at?: string };
        Relationships: [];
      };
      video_assets: {
        Row: { id: string; project_id: string; user_id: string; storage_path: string; original_filename: string; mime_type: string; size_bytes: number; duration_seconds: number | null; created_at: string };
        Insert: { id?: string; project_id: string; user_id: string; storage_path: string; original_filename: string; mime_type: string; size_bytes: number; duration_seconds?: number | null; created_at?: string };
        Update: { storage_path?: string; original_filename?: string; mime_type?: string; size_bytes?: number; duration_seconds?: number | null };
        Relationships: [];
      };
      editing_jobs: {
        Row: { id: string; project_id: string; user_id: string; status: string; progress: number; error_message: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; project_id: string; user_id: string; status?: string; progress?: number; error_message?: string | null; created_at?: string; updated_at?: string };
        Update: { status?: string; progress?: number; error_message?: string | null; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type VideoAsset = Database["public"]["Tables"]["video_assets"]["Row"];
