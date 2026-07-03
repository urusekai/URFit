import { PageHeader } from "@/components/layout/PageHeader";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function MainPage() {
  return (
    <>
      <PageHeader title="오늘의 추천" />
      <PlaceholderPage
        description="날씨 기반 코디 추천 메인 화면입니다."
        workArea="src/components/features/outfit/"
      />
    </>
  );
}
