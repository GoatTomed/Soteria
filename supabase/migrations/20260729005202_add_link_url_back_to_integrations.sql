-- Add link_url back to integrations table for Earnpaste URL option
ALTER TABLE integrations ADD COLUMN IF NOT EXISTS link_url text DEFAULT '';
