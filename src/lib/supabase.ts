/**
 * Supabase clients for LinguaLab.
 *
 * - createClient() is the browser client used in Client Components.
 * - createServerClient() is a thin factory for Route Handlers / Server Components.
 *
 * We do NOT use Supabase Auth for the MVP. Guest sessions are tracked by a
 * generated profile_id stored in localStorage and sent with chat requests.
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in development so missing env vars are obvious.
  if (typeof window === "undefined") {
    console.warn(
      "[LinguaLab] Supabase environment variables are missing. Database persistence will be disabled."
    );
  }
}

export function createClient() {
  return createSupabaseClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
}

export function createServerClient() {
  return createSupabaseClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
}
