import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function SavedPage() {
  return (
    <>
      <PageHeader title="저장" />
      <PlaceholderPage
        description="저장한 코디 · 마이핏 목록이 이 영역에서 구현됩니다."
        workArea="src/components/features/saved/"
      />
    </>
  );
}
