import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function FittingPage() {
  return (
    <>
      <PageHeader title="피팅" />
      <PlaceholderPage
        description="가상 피팅 · 피팅 결과 · 마이핏 저장 모달이 이 영역에서 구현됩니다."
        workArea="src/components/features/fitting/"
      />
    </>
  );
}
