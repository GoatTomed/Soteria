-- Add provider-specific configuration columns to the integrations table.
-- These store the credentials and settings needed for each monetization provider.
ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS display_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS publisher_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS anti_bypass_token text DEFAULT '',
  ADD COLUMN IF NOT EXISTS key_expiry_days int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_key_limit int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checkpoints jsonb DEFAULT '[]'::jsonb;
