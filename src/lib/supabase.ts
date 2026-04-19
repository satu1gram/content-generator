import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null | undefined;
let _admin: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || '';
  _client = (url && key) ? createClient(url, key) : null;
  return _client;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (_admin !== undefined) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  _admin = (url && serviceKey)
    ? createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
    : null;
  return _admin;
}

export function getSupabaseAny(): SupabaseClient | null {
  return getSupabaseAdmin() || getSupabaseClient();
}
