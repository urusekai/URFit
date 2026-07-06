import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES } from "@/constants/app";

/** 로그인 없이 접근 가능한 공개 경로. */
const PUBLIC_PATHS: string[] = [ROUTES.splash, ROUTES.login, "/api/auth/callback", "/api/health"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

type OnboardingProfile = {
  gender: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  style: string | null;
  brands: string[] | null;
};

function isOnboardingComplete(profile: OnboardingProfile | null) {
  return Boolean(
    profile?.gender &&
      profile.height != null &&
      profile.weight != null &&
      profile.age != null &&
      profile.style &&
      profile.brands &&
      profile.brands.length > 0,
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // [임시/개발용] 인증 게이팅 우회 스위치.
  // .env 의 DISABLE_AUTH_GUARD=true 인 동안 모든 라우트 보호를 끈다(세션 갱신은 유지).
  // 원복: .env 에서 DISABLE_AUTH_GUARD 줄을 지우거나 false 로. 이 코드 블록은 지울 필요 없음.
  if (process.env.DISABLE_AUTH_GUARD === "true") {
    return supabaseResponse;
  }

  const { pathname } = request.nextUrl;

  // /splash는 로그인 여부와 무관하게 항상 통과시키는 브랜드 화면.
  if (pathname === ROUTES.splash) {
    return supabaseResponse;
  }

  // 공개 경로가 아닌데 로그인이 안 되어 있으면 /login으로 보낸다.
  if (!user && !isPublicPath(pathname)) {
    return redirectWithCookies(ROUTES.login, request, supabaseResponse);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("gender,height,weight,age,style,brands")
      .eq("id", user.id)
      .maybeSingle<OnboardingProfile>();
    const onboardingComplete = isOnboardingComplete(profile);

    // 이미 로그인된 유저가 /login에 접근하면 온보딩 완료 여부에 맞춰 보낸다.
    if (pathname === ROUTES.login) {
      return redirectWithCookies(
        onboardingComplete ? ROUTES.main : ROUTES.onboarding,
        request,
        supabaseResponse,
      );
    }

    // 온보딩 필수값이 없으면 보호 페이지 진입 전에 온보딩으로 보낸다.
    if (!onboardingComplete && pathname !== ROUTES.onboarding && !isPublicPath(pathname)) {
      return redirectWithCookies(ROUTES.onboarding, request, supabaseResponse);
    }

    // 이미 온보딩을 끝낸 유저가 /onboarding에 직접 접근하면 메인으로 보낸다.
    if (onboardingComplete && pathname === ROUTES.onboarding) {
      return redirectWithCookies(ROUTES.main, request, supabaseResponse);
    }
  }

  return supabaseResponse;
}

/**
 * 리다이렉트 응답을 만들되, `supabaseResponse`에 세팅된 세션 갱신 쿠키를
 * 새 응답에 그대로 복사한다. 그러지 않으면 리다이렉트 도중 갱신된 세션 쿠키가 유실된다.
 */
function redirectWithCookies(path: string, request: NextRequest, supabaseResponse: NextResponse) {
  const redirectUrl = new URL(path, request.url);
  const redirectResponse = NextResponse.redirect(redirectUrl);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
