import { createBrowserClient } from "@supabase/ssr";
import { clientEnv, requireEnv } from "@/lib/env";

export function createClient() {
  return createBrowserClient(
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  );
}
