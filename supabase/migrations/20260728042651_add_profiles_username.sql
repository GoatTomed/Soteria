/*
# Add profiles table with unique usernames

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, not null) — the public-facing username
  - `created_at` (timestamp)

2. Security
- Enable RLS on `profiles`.
- Authenticated users can read any profile (needed for username lookup on login).
- Users can only insert/update their own profile row.

3. Notes
- Username must be unique across all users.
- On signup the app stores the username here linked to the auth user.
- Login flow reads this table to resolve username -> internal email, then signs in with email+password.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);
