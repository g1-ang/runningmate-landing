import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버 측에서 사용하는 Supabase 클라이언트.
 *
 * service_role 키는 RLS 를 우회하므로 절대 클라이언트 번들에 노출되면
 * 안 됨. API route (`app/api/**`) 안에서만 import 한다.
 *
 * 환경변수 미설정 시 (개발 초기 / Supabase 미연결) 기능을 silent 하게
 * disable 해서 앱이 깨지지 않도록 한다.
 */
let cached: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
