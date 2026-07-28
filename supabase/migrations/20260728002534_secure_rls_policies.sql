/*
# Add ownership columns and secure RLS policies

## Problem
All tables currently have `USING (true)` / `WITH CHECK (true)` policies that
allow unrestricted access to anyone (anon + authenticated). This bypasses
row-level security entirely.

## Solution
1. Delete existing demo/test data (created under the old no-auth policies).
2. Add `user_id uuid NOT NULL DEFAULT auth.uid()` to: services, integrations, files.
   - scripts and keys are child tables of services; scoped through parent ownership.
3. Rewrite ALL policies to use `auth.uid()` ownership checks, `authenticated` only.
4. Child tables (scripts, keys) use EXISTS subquery against services for ownership.

## Security changes
- All policies now require authentication (TO authenticated)
- Anon role has NO access to any table
- Owner tables: auth.uid() = user_id
- Child tables: EXISTS check against parent service ownership
*/

-- Clear old demo data (created under no-auth policies, has no owner)
DELETE FROM keys;
DELETE FROM scripts;
DELETE FROM integrations;
DELETE FROM files;
DELETE FROM services;

-- Add user_id to owner tables
ALTER TABLE services ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE files ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);

-- ========== SERVICES ==========
DROP POLICY IF EXISTS "anon_select_services" ON services;
DROP POLICY IF EXISTS "anon_insert_services" ON services;
DROP POLICY IF EXISTS "anon_update_services" ON services;
DROP POLICY IF EXISTS "anon_delete_services" ON services;

CREATE POLICY "select_own_services" ON services FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_services" ON services FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_services" ON services FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_services" ON services FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ========== SCRIPTS (child of services) ==========
DROP POLICY IF EXISTS "anon_select_scripts" ON scripts;
DROP POLICY IF EXISTS "anon_insert_scripts" ON scripts;
DROP POLICY IF EXISTS "anon_update_scripts" ON scripts;
DROP POLICY IF EXISTS "anon_delete_scripts" ON scripts;

CREATE POLICY "select_own_scripts" ON scripts FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = scripts.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "insert_own_scripts" ON scripts FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM services WHERE services.id = scripts.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "update_own_scripts" ON scripts FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = scripts.service_id AND services.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM services WHERE services.id = scripts.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "delete_own_scripts" ON scripts FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = scripts.service_id AND services.user_id = auth.uid())
  );

-- ========== KEYS (child of services) ==========
DROP POLICY IF EXISTS "anon_select_keys" ON keys;
DROP POLICY IF EXISTS "anon_insert_keys" ON keys;
DROP POLICY IF EXISTS "anon_update_keys" ON keys;
DROP POLICY IF EXISTS "anon_delete_keys" ON keys;

CREATE POLICY "select_own_keys" ON keys FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = keys.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "insert_own_keys" ON keys FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM services WHERE services.id = keys.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "update_own_keys" ON keys FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = keys.service_id AND services.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM services WHERE services.id = keys.service_id AND services.user_id = auth.uid())
  );
CREATE POLICY "delete_own_keys" ON keys FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM services WHERE services.id = keys.service_id AND services.user_id = auth.uid())
  );

-- ========== INTEGRATIONS ==========
DROP POLICY IF EXISTS "anon_select_integrations" ON integrations;
DROP POLICY IF EXISTS "anon_insert_integrations" ON integrations;
DROP POLICY IF EXISTS "anon_update_integrations" ON integrations;
DROP POLICY IF EXISTS "anon_delete_integrations" ON integrations;

CREATE POLICY "select_own_integrations" ON integrations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_integrations" ON integrations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_integrations" ON integrations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_integrations" ON integrations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ========== FILES ==========
DROP POLICY IF EXISTS "anon_select_files" ON files;
DROP POLICY IF EXISTS "anon_insert_files" ON files;
DROP POLICY IF EXISTS "anon_update_files" ON files;
DROP POLICY IF EXISTS "anon_delete_files" ON files;

CREATE POLICY "select_own_files" ON files FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_files" ON files FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_files" ON files FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_files" ON files FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
