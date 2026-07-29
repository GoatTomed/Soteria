-- Soteria Supabase setup
-- Paste this into Supabase SQL Editor and run it.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "select_profiles" on profiles;
create policy "select_profiles" on profiles for select to anon, authenticated using (true);

drop policy if exists "insert_own_profile" on profiles;
create policy "insert_own_profile" on profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "update_own_profile" on profiles;
create policy "update_own_profile" on profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "delete_own_profile" on profiles;
create policy "delete_own_profile" on profiles for delete to authenticated using (auth.uid() = id);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  status text not null default 'active',
  executions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists scripts (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  name text not null,
  content text not null default '',
  executions integer not null default 0,
  status text not null default 'active',
  updated_at timestamptz not null default now()
);

create table if not exists keys (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references services(id) on delete set null,
  key_value text not null unique,
  status text not null default 'active',
  hwid text not null default '',
  note text not null default '',
  uses integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  api_key text not null default '',
  link_url text not null default '',
  timer integer not null default 15,
  status text not null default 'connected',
  created_at timestamptz not null default now(),
  display_name text not null default '',
  key_expiry_days integer not null default 0,
  checkpoints_config text not null default '',
  hwid_lock boolean not null default false,
  uid_lock boolean not null default false,
  service_id uuid references services(id) on delete set null
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size_bytes integer not null default 0,
  status text not null default 'active',
  obfuscated boolean not null default false,
  content text not null default '',
  obfuscated_content text not null default '',
  unobfuscated_content text not null default '',
  slug text not null unique,
  version integer not null default 1,
  parent_file_id uuid references files(id) on delete set null,
  executions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists execution_logs (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references files(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists gate_links (
  id uuid primary key default gen_random_uuid(),
  owner_username text not null,
  script_id uuid not null references files(id) on delete cascade,
  integration_id uuid references integrations(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists integration_script_links (
  id uuid primary key default gen_random_uuid(),
  integration_id uuid not null references integrations(id) on delete cascade,
  script_id uuid not null references files(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(integration_id, script_id)
);

create index if not exists idx_execution_logs_created_at on execution_logs(created_at);
create index if not exists idx_execution_logs_file_id on execution_logs(file_id);
create index if not exists idx_execution_logs_service_id on execution_logs(service_id);
create index if not exists idx_files_slug on files(slug);
create index if not exists idx_files_parent_file_id on files(parent_file_id);

alter table services disable row level security;
alter table scripts disable row level security;
alter table keys disable row level security;
alter table integrations disable row level security;
alter table files disable row level security;
alter table execution_logs disable row level security;
