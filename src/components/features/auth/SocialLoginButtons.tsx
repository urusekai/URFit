"use client";

import type { Provider } from "@supabase/supabase-js";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";

type SocialButton = {
  key: string;
  label: string;
  icon: string;
  className: string;
  /** Supabase 기본 지원 프로바이더. 네이버처럼 미지원이면 null. */
  provider: Provider | null;
};

const SOCIAL_BUTTONS: SocialButton[] = [
  {
    key: "kakao",
    label: "카카오로 계속하기",
    icon: "/images/icons/kakao.svg",
    className: "bg-[#FEE500] text-black",
    provider: "kakao",
  },
  {
    key: "naver",
    label: "네이버로 계속하기",
    icon: "/images/icons/naver.svg",
    className: "bg-[#03C75A] text-white",
    provider: null,
  },
  {
    key: "google",
    label: "Google로 계속하기",
    icon: "/images/icons/google.svg",
    className: "border border-border bg-white text-foreground",
    provider: "google",
  },
];

export function SocialLoginButtons() {
  const [pending, setPending] = useState<string | null>(null);

  async function handleLogin({ key, provider }: SocialButton) {
    if (!provider) {
      // 네이버는 Supabase 기본 프로바이더가 아니라 커스텀 OAuth 설정이 필요하다.
      window.alert("네이버 로그인은 준비 중입니다.");
      return;
    }

    setPending(key);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("소셜 로그인 실패:", error.message);
      setPending(null);
    }
    // 성공 시 프로바이더 인증 페이지로 리다이렉트되므로 상태는 그대로 둔다.
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      {SOCIAL_BUTTONS.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => handleLogin(item)}
          disabled={pending !== null}
          className={cn(
            "flex h-14 w-full cursor-pointer items-center justify-center gap-8 rounded-full text-base font-semibold transition hover:opacity-90 disabled:opacity-60",
            item.className,
          )}
        >
          <Image src={item.icon} alt="" aria-hidden width={20} height={20} className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
