import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function MyFitPage() {
  return (
    <>
      <PageHeader title="마이핏" />
      <PlaceholderPage
        description="저장한 룩 목록 · 상세 화면입니다."
        workArea="src/components/features/my-fit/"
      />
    </>
  );
}
