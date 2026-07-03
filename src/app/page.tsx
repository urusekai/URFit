import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { APP_DESCRIPTION, APP_NAME, ROUTES } from "@/constants/app";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          AI Virtual Wardrobe
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{APP_NAME}</h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {APP_DESCRIPTION}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.wardrobe}>
          <Button>옷장 보기</Button>
        </Link>
        <Link href={ROUTES.outfit}>
          <Button variant="secondary">코디 추천 받기</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "날씨 연동", desc: "OpenWeather API로 오늘 코디에 맞는 정보를 반영합니다." },
          { title: "AI 추천", desc: "Gemini API로 상황별 코디를 제안합니다." },
          { title: "협업 구조", desc: "기능별 폴더 분리로 3~4인 병렬 개발이 쉽습니다." },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-medium">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
