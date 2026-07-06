import { AiRecommendationCard } from "@/components/features/outfit/AiRecommendationCard";
import { WardrobeTeaser } from "@/components/features/outfit/WardrobeTeaser";
import { WeatherPill } from "@/components/features/outfit/WeatherPill";
import { WeatherTipBanner } from "@/components/features/outfit/WeatherTipBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { APP_NAME } from "@/constants/app";
import { getCurrentUserId, getWardrobe } from "@/lib/fitting";
import {
  buildFeaturedRecommendations,
  getGreeting,
  getWeatherTip,
} from "@/lib/outfit/recommendation";
import { toClosetItems } from "@/lib/wardrobe/catalog";
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

async function getWeatherSafely(): Promise<WeatherSummary> {
  try {
    return await getCurrentWeather();
  } catch {
    return FALLBACK_WEATHER;
  }
}

const DEMO_USER_NAME = "지우";

export default async function MainPage() {
  const userId = await getCurrentUserId();
  const [weather, clothes] = await Promise.all([
    getWeatherSafely(),
    getWardrobe(userId),
  ]);
  const closetItems = toClosetItems(clothes);
  const recommendations = buildFeaturedRecommendations(closetItems);
  const tip = getWeatherTip(weather);
  const greeting = getGreeting();

  return (
    <>
      <PageHeader title={APP_NAME} actions={<WeatherPill weather={weather} />} />

      <div className="mt-3 flex flex-col gap-6 pb-6">
        <div>
          <p className="text-sm text-muted">
            {greeting}, {DEMO_USER_NAME}님
          </p>
          <h2 className="mt-1 text-[30px] font-extrabold leading-tight text-[#323232]">
            오늘 뭐 입지?
          </h2>
        </div>

        <WeatherTipBanner tip={tip} />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#323232]">오늘의 AI 추천</h2>
            <span className="inline-flex h-6 min-w-10 items-center justify-center rounded-full bg-accent px-3 text-[12px] font-bold tracking-wide text-white">
              AI
            </span>
          </div>
          <AiRecommendationCard recommendations={recommendations} />
        </section>

        <WardrobeTeaser items={closetItems} />
      </div>
    </>
  );
}
