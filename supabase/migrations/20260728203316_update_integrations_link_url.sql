-- Replace token-based fields with simple link_url field
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS link_url text;
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS checkpoints_config text DEFAULT 'None';
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS hwid_lock boolean DEFAULT false;
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS uid_lock boolean DEFAULT false;

-- Migrate existing data: copy publisher_id or api_key into link_url
UPDATE integrations SET link_url = COALESCE(publisher_id, api_key, '') WHERE link_url IS NULL;

ALTER TABLE integrations ALTER COLUMN link_url SET DEFAULT '';
