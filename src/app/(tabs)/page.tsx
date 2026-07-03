import { AiRecommendationCard } from "@/components/features/outfit/AiRecommendationCard";
import { WardrobeTeaser } from "@/components/features/outfit/WardrobeTeaser";
import { WeatherPill } from "@/components/features/outfit/WeatherPill";
import { WeatherTipBanner } from "@/components/features/outfit/WeatherTipBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { APP_NAME } from "@/constants/app";
import { getGreeting, getMockOutfitRecommendation, getWeatherTip } from "@/lib/mock/ai-recommendation";
import { getCurrentWeather } from "@/lib/weather/openweather";
import type { WeatherSummary } from "@/types/api";

const FALLBACK_WEATHER: WeatherSummary = {
  city: "Seoul",
  temperature: 21,
  feelsLike: 19,
  humidity: 55,
  windSpeed: 2.1,
  condition: "Clear",
  description: "맑음",
  icon: "01d",
};

/** OpenWeather 연동 실패 시(키 미설정, API 오류 등) 데모가 끊기지 않도록 기본값으로 대체합니다. */
async function getWeatherSafely(): Promise<WeatherSummary> {
  try {
    return await getCurrentWeather();
  } catch {
    return FALLBACK_WEATHER;
  }
}

// 실제 프로필 연동 전까지 사용하는 임시 사용자명
const DEMO_USER_NAME = "지우";

export default async function MainPage() {
  const weather = await getWeatherSafely();
  const recommendation = getMockOutfitRecommendation(weather);
  const tip = getWeatherTip(weather);
  const greeting = getGreeting();

  return (
    <>
      <PageHeader title={APP_NAME} actions={<WeatherPill weather={weather} />} />

      <div className="flex flex-col gap-6 pb-6">
        <div>
          <p className="text-sm text-muted">
            {greeting}, {DEMO_USER_NAME}님
          </p>
          <h2 className="mt-1 text-xl font-bold text-foreground">오늘 뭐 입지?</h2>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">오늘의 AI 추천</h2>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
              AI
            </span>
          </div>
          <AiRecommendationCard recommendation={recommendation} />
        </section>

        <WeatherTipBanner tip={tip} />

        <WardrobeTeaser />
      </div>
    </>
  );
}
