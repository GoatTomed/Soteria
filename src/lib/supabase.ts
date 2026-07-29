import { createClient } from '@supabase/supabase-js';

export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://bcedukdmqieckhpsrrcx.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZWR1a2RtcWllY2tocHNycmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyODE5OTAsImV4cCI6MjEwMDg1Nzk5MH0.k9HcY0d42rP3NoX2sySFCneQcYwCdc29mEG0YnErNRU';

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
  link_url: string;
  timer: number;
  status: string;
  created_at: string;
  display_name: string;
  key_expiry_days: number;
  checkpoints_config: string;
  hwid_lock: boolean;
  uid_lock: boolean;
  service_id: string | null;
};

export type GateLink = {
  id: string;
  owner_username: string;
  script_id: string;
  integration_id: string | null;
  created_at: string;
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
  executions: number;
  created_at: string;
  updated_at: string;
};
