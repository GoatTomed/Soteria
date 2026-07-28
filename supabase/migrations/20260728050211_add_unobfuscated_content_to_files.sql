/*
# Add unobfuscated_content column to files

1. Modified Tables
- `files`
  - Add `unobfuscated_content` (text, default '') — stores the original source
    at the moment of obfuscation so it can be reliably restored later without
    relying on runtime decoding of the obfuscated payload.

2. Security
- No policy changes. Existing anon+authenticated CRUD policies on `files`
  continue to apply to the new column automatically.
*/

ALTER TABLE files ADD COLUMN IF NOT EXISTS unobfuscated_content text DEFAULT '';
