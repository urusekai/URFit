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
    </>
  );
}
