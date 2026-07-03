import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function MyPage() {
  return (
    <>
      <PageHeader title="MY" />
      <PlaceholderPage
        description="프로필 · 신체정보 수정 · 데이터 삭제/탈퇴 모달이 이 영역에서 구현됩니다."
        workArea="src/components/features/mypage/"
      />
      <form action="/api/auth/signout" method="post" className="mt-8">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-off-white"
        >
          로그아웃
        </button>
      </form>
    </>
  );
}
