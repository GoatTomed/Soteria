/*
# Add versioning columns to files table

1. Modified Tables
- `files`
  - Add `version` (integer, default 1) — tracks which version of the script this row represents.
    Version 1 is the original/first saved script. When a user edits and re-obfuscates,
    a new row is inserted with version 2, 3, etc., keeping the same `name`.
  - Add `parent_file_id` (uuid, nullable, self-referencing FK) — links version rows
    back to the original file (version 1 row). NULL for the first version.

2. Security
- No policy changes. Existing anon+authenticated CRUD policies on `files`
  continue to apply to the new columns automatically.
*/

ALTER TABLE files ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;
ALTER TABLE files ADD COLUMN IF NOT EXISTS parent_file_id uuid REFERENCES files(id) ON DELETE SET NULL;

-- Index for efficient lookups by parent file
CREATE INDEX IF NOT EXISTS idx_files_parent_file_id ON files(parent_file_id);
