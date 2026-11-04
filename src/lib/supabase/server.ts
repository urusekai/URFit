import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { clientEnv, requireEnv } from "@/lib/env";
import type { Database } from "@/types/database";

// @supabase/ssr@0.6.1은 반환 타입을 supabase-js@2.109의 재배치된 제네릭과
// 맞지 않게 선언한다(Schema가 잘못된 슬롯으로 들어가 never로 붕괴). 스키마를
// 올바로 파생하는 2-제네릭 SupabaseClient<Database>로 캐스팅해 .from() 타입을 복구한다.
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
