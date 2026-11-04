import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { clientEnv, requireEnv } from "@/lib/env";
import type { Database } from "@/types/database";

// @supabase/ssr의 반환 타입과 생성된 Database 타입을 함께 쓰기 위해
// SupabaseClient<Database>로 좁혀 .from()의 스키마 타입을 유지한다.
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    },
  ) as unknown as SupabaseClient<Database>;
}
