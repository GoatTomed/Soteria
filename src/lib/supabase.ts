import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://qqnnaknwszrigxwrlvxd.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbm5ha253c3pyaWd4d3JsdnhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODc5NDYsImV4cCI6MjEwMDc2Mzk0Nn0.o_z5KcHsc0aSNpRzg7q2qSRN4U6tCs8TbrDRZnmi85o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Service = {
  id: string;
  name: string;
  description: string;
  status: string;
  executions: number;
  created_at: string;
  updated_at: string;
};

export type Script = {
  id: string;
  service_id: string | null;
  name: string;
  content: string;
  executions: number;
  status: string;
  updated_at: string;
};

export type Key = {
  id: string;
  service_id: string | null;
  key_value: string;
  status: string;
  hwid: string;
  note: string;
  uses: number;
  created_at: string;
  updated_at: string;
};

export type Integration = {
  id: string;
  provider: string;
  api_key: string;
  status: string;
  created_at: string;
  display_name: string;
  publisher_id: string;
  anti_bypass_token: string;
  key_expiry_days: number;
  daily_key_limit: number;
  checkpoints: { name: string; url: string }[];
};

export type File = {
  id: string;
  name: string;
  size_bytes: number;
  status: string;
  obfuscated: boolean;
  content: string;
  obfuscated_content: string;
  unobfuscated_content: string;
  slug: string;
  version: number;
  parent_file_id: string | null;
  created_at: string;
  updated_at: string;
};
