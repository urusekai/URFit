import Image from "next/image";
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col px-6 pb-20">
      <div className="flex flex-col items-center gap-8 pt-44">
        <Image
          src="/images/brand/splash-logo.svg"
          alt="URFit"
          width={192}
          height={160}
          priority
          className="h-auto w-44"
        />
        <p className="text-center text-sm leading-relaxed text-charcoal font-semibold">
          내 옷장을 등록하고
          <br />
          가상으로 입어보세요
        </p>
      </div>
      <SocialLoginButtons />
      <p className="text-center text-xs leading-relaxed text-muted">
        계속 진행하면 이용약관 및
        <br />
        개인정보처리방침에 동의하게 됩니다.
      </p>
    </div>
  );
}
