import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/app";
import { createClient } from "@/lib/supabase/server";

/**
 * 소셜 로그인 OAuth 콜백.
 * 프로바이더가 `?code=`를 붙여 돌려보내면 세션으로 교환한 뒤 앱으로 리다이렉트한다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? ROUTES.main;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 로드밸런서/프록시 뒤에서는 origin이 내부 주소라 x-forwarded-host를 우선한다.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${ROUTES.login}?error=auth`);
}
