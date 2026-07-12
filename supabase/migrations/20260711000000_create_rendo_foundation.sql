create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'failed')),
  content_type text check (content_type is null or content_type in ('Podcast', 'Interview', 'Talking Head', 'Educational')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.video_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  duration_seconds numeric check (duration_seconds is null or duration_seconds >= 0),
  created_at timestamptz not null default now(),
  foreign key (project_id, user_id) references public.projects(id, user_id) on delete cascade
);

create table public.editing_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'queued', 'processing', 'completed', 'failed')),
  progress integer not null default 0 check (progress between 0 and 100),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (project_id, user_id) references public.projects(id, user_id) on delete cascade
);

create index projects_user_id_created_at_idx on public.projects (user_id, created_at desc);
create index video_assets_project_id_idx on public.video_assets (project_id);
create index video_assets_user_id_idx on public.video_assets (user_id);
create index editing_jobs_project_id_idx on public.editing_jobs (project_id);
create index editing_jobs_user_id_idx on public.editing_jobs (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger editing_jobs_set_updated_at
before update on public.editing_jobs
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.video_assets enable row level security;
alter table public.editing_jobs enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

create policy "projects_select_own" on public.projects for select to authenticated using ((select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects for delete to authenticated using ((select auth.uid()) = user_id);

create policy "video_assets_select_own" on public.video_assets for select to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = video_assets.project_id and projects.user_id = (select auth.uid()))
);
create policy "video_assets_insert_own" on public.video_assets for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = video_assets.project_id and projects.user_id = (select auth.uid()))
);
create policy "video_assets_update_own" on public.video_assets for update to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = video_assets.project_id and projects.user_id = (select auth.uid()))
) with check (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = video_assets.project_id and projects.user_id = (select auth.uid()))
);
create policy "video_assets_delete_own" on public.video_assets for delete to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = video_assets.project_id and projects.user_id = (select auth.uid()))
);

create policy "editing_jobs_select_own" on public.editing_jobs for select to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = editing_jobs.project_id and projects.user_id = (select auth.uid()))
);
create policy "editing_jobs_insert_own" on public.editing_jobs for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = editing_jobs.project_id and projects.user_id = (select auth.uid()))
);
create policy "editing_jobs_update_own" on public.editing_jobs for update to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = editing_jobs.project_id and projects.user_id = (select auth.uid()))
) with check (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = editing_jobs.project_id and projects.user_id = (select auth.uid()))
);
create policy "editing_jobs_delete_own" on public.editing_jobs for delete to authenticated using (
  (select auth.uid()) = user_id and exists (select 1 from public.projects where projects.id = editing_jobs.project_id and projects.user_id = (select auth.uid()))
);

insert into public.profiles (id, email)
select id, coalesce(email, '') from auth.users
on conflict (id) do update set email = excluded.email;
