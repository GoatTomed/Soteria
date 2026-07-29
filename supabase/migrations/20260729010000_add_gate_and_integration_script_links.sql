-- Add gate_links and integration_script_links tables for provider gating and script bindings

CREATE TABLE IF NOT EXISTS gate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_username text NOT NULL,
  script_id uuid NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_script_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  script_id uuid NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (integration_id, script_id)
);
