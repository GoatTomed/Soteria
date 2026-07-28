/*
# Create dashboard tables for Soteria

1. New Tables
- `services` — Oracle services (groups of scripts/keys)
  - id (uuid PK), name (text), description (text), status (text, default 'active'),
    executions (int, default 0), created_at, updated_at
- `scripts` — Luau scripts belonging to a service
  - id (uuid PK), service_id (FK -> services), name (text), content (text),
    executions (int, default 0), status (text, default 'active'), updated_at
- `keys` — License keys belonging to a service
  - id (uuid PK), service_id (FK -> services), key_value (text, unique),
    status (text, default 'active'), hwid (text), note (text), uses (int, default 0),
    created_at, updated_at
- `integrations` — Monetization integrations (Linkvertise, Work.ink, LootLabs)
  - id (uuid PK), provider (text), api_key (text), status (text, default 'connected'),
    created_at
- `files` — Obfuscated files uploaded by the user
  - id (uuid PK), name (text), size_bytes (int), status (text, default 'pending'),
    obfuscated (boolean, default false), created_at, updated_at

2. Security
- All tables: RLS enabled, anon+authenticated CRUD (single-tenant, no auth screen).
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  executions integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text DEFAULT '',
  executions integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_scripts" ON scripts;
CREATE POLICY "anon_select_scripts" ON scripts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_scripts" ON scripts;
CREATE POLICY "anon_insert_scripts" ON scripts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_scripts" ON scripts;
CREATE POLICY "anon_update_scripts" ON scripts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_scripts" ON scripts;
CREATE POLICY "anon_delete_scripts" ON scripts FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  key_value text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  hwid text DEFAULT '',
  note text DEFAULT '',
  uses integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_keys" ON keys;
CREATE POLICY "anon_select_keys" ON keys FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_keys" ON keys;
CREATE POLICY "anon_insert_keys" ON keys FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_keys" ON keys;
CREATE POLICY "anon_update_keys" ON keys FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_keys" ON keys;
CREATE POLICY "anon_delete_keys" ON keys FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  api_key text DEFAULT '',
  status text NOT NULL DEFAULT 'connected',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_integrations" ON integrations;
CREATE POLICY "anon_select_integrations" ON integrations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_integrations" ON integrations;
CREATE POLICY "anon_insert_integrations" ON integrations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_integrations" ON integrations;
CREATE POLICY "anon_update_integrations" ON integrations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_integrations" ON integrations;
CREATE POLICY "anon_delete_integrations" ON integrations FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  size_bytes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  obfuscated boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_files" ON files;
CREATE POLICY "anon_select_files" ON files FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_files" ON files;
CREATE POLICY "anon_insert_files" ON files FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_files" ON files;
CREATE POLICY "anon_update_files" ON files FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_files" ON files;
CREATE POLICY "anon_delete_files" ON files FOR DELETE TO anon, authenticated USING (true);
