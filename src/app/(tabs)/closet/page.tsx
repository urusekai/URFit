import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function ClosetPage() {
  return (
    <>
      <PageHeader title="나만의 옷장" />
      <PlaceholderPage
        description="내 옷 목록 · 옷 추가/상세 모달이 이 영역에서 구현됩니다."
        workArea="src/components/features/wardrobe/"
      />
    </>
  );
}
