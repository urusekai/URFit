import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { clientEnv, requireEnv } from "@/lib/env";
import type { Database } from "@/types/database";

// server.ts와 동일한 이유로 SupabaseClient<Database>로 캐스팅해 .from() 타입을 복구한다.
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  ) as unknown as SupabaseClient<Database>;
}
