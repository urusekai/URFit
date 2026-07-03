export default function OutfitPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">코디 추천</h1>
      <p className="text-zinc-600 dark:text-zinc-300">
        날씨 + AI 추천 결과를 보여주는 화면입니다. API는 `/api/weather`, `/api/ai/generate`를
        사용합니다.
      </p>
      <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        `src/components/features/outfit/` 에 추천 UI를 구현하세요.
      </div>
    </section>
  );
}
