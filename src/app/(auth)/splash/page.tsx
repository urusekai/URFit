"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SplashPage() {
  const router = useRouter();
  // 2. 반드시 useEffect 안에서 타이머를 실행해야 합니다.
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1500);

    // 올바른 정리(Cleanup) 함수 형태
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/images/brand/splash-logo.svg"
          alt="URFit"
          width={192}
          height={160}
          priority
          className="h-auto w-44"
        />
      </div>
      <p className="pb-16 text-sm text-muted">AI 스마트 옷장 · 가상 피팅</p>
    </div>
  );
}
