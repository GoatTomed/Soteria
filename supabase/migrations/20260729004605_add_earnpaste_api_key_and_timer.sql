-- Replace link_url with api_key + timer for Earnpaste-only integration
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS api_key text DEFAULT '';
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS timer integer DEFAULT 15;

-- Migrate existing link_url data into api_key
UPDATE integrations SET api_key = link_url WHERE api_key = '' AND link_url IS NOT NULL AND link_url <> '';

ALTER TABLE integrations ALTER COLUMN api_key SET DEFAULT '';
ALTER TABLE integrations ALTER COLUMN timer SET DEFAULT 15;
