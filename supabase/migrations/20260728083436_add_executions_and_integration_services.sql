/*
# Add execution tracking and link integrations to services

1. Modified Tables
- `integrations`
  - Add `service_id` (uuid, nullable, FK -> services ON DELETE SET NULL)
    so each monetization integration can be linked to a specific Oracle service.
- `files`
  - Add `executions` (integer, default 0) — counts how many times the
    served script has been fetched/executed by a Roblox executor.

2. New Tables
- `execution_logs`
  - id (uuid PK)
  - file_id (uuid FK -> files ON DELETE CASCADE) — which file was executed
  - service_id (uuid, nullable, FK -> services ON DELETE SET NULL) — optional service context
  - created_at (timestamptz, default now())
  - Used as a heartbeat log: every time serve-script is fetched by a
    Roblox executor, a row is inserted here. This powers the "Executions
    today / last 24 hours" stat cards with real data.

3. Indexes
- `idx_execution_logs_created_at` — for querying last-24h efficiently
- `idx_execution_logs_file_id` — for per-file execution counts
- `idx_execution_logs_service_id` — for per-service execution counts

4. Security
- RLS enabled on `execution_logs` with anon+authenticated CRUD (single-tenant).
- No policy changes on existing tables (new columns are covered by existing
  permissive policies).
*/

-- Link integrations to services
ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES services(id) ON DELETE SET NULL;

-- Track file executions
ALTER TABLE files
  ADD COLUMN IF NOT EXISTS executions integer NOT NULL DEFAULT 0;

-- Execution log table (heartbeat)
CREATE TABLE IF NOT EXISTS execution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_execution_logs" ON execution_logs;
CREATE POLICY "anon_select_execution_logs" ON execution_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_execution_logs" ON execution_logs;
CREATE POLICY "anon_insert_execution_logs" ON execution_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_execution_logs" ON execution_logs;
CREATE POLICY "anon_delete_execution_logs" ON execution_logs FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON execution_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_execution_logs_file_id ON execution_logs(file_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_service_id ON execution_logs(service_id);
