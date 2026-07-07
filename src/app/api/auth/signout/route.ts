import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/app";
import { createClient } from "@/lib/supabase/server";

/**
 * 로그아웃 처리.
 * 세션을 종료한 뒤 로그인 화면으로 리다이렉트한다.
 * POST 폼 제출 후 GET으로 리다이렉트되도록 303(See Other)을 명시한다.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL(ROUTES.login, request.url), 303);
}
