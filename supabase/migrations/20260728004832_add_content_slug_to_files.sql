-- Add content, obfuscated_content, and slug columns to files table
ALTER TABLE files ADD COLUMN IF NOT EXISTS content text DEFAULT '';
ALTER TABLE files ADD COLUMN IF NOT EXISTS obfuscated_content text DEFAULT '';
ALTER TABLE files ADD COLUMN IF NOT EXISTS slug text;

-- Generate slugs for existing files
UPDATE files SET slug = ('100000' || floor(random() * 900000)::text) WHERE slug IS NULL;

-- Make slug unique and not null
ALTER TABLE files ALTER COLUMN slug SET NOT NULL;
ALTER TABLE files ADD CONSTRAINT files_slug_unique UNIQUE (slug);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_files_slug ON files(slug);
