import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 값은 .env.local 에서 주입됩니다. 코드에 직접 넣지 않습니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 두 환경변수가 모두 채워져 있을 때만 연동이 활성화됩니다.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// 값이 없으면 createClient 를 호출하지 않고 null 을 반환해 앱이 터지지 않게 합니다.
// 사용하는 쪽에서 `if (!supabase) ...` 로 미설정 상태를 안전하게 처리하세요.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
