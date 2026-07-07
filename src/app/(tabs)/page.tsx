import { AiRecommendationCard } from "@/components/features/outfit/AiRecommendationCard";
import { WardrobeTeaser } from "@/components/features/outfit/WardrobeTeaser";
import { WeatherPill } from "@/components/features/outfit/WeatherPill";
import { WeatherTipBanner } from "@/components/features/outfit/WeatherTipBanner";
import { PageHeader } from "@/components/layout/PageHeader";
import { APP_NAME } from "@/constants/app";
import { getWardrobe } from "@/lib/fitting";
import {
  buildAiOutfitRecommendations,
  buildFeaturedRecommendations,
  getGreeting,
  getWeatherTip,
} from "@/lib/outfit/recommendation";
import {
  recommendOutfit,
  toRecommendationStyle,
} from "@/lib/outfit/recommend-engine";
import { createClient } from "@/lib/supabase/server";
import { getMyClosetItems } from "@/lib/wardrobe/closet";
import { getCurrentWeather } from "@/lib/weather/openweather";
import type { WeatherSummary } from "@/types/api";
import type { StyleTag } from "@/types/fitting";

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

async function getPreferredStyle(): Promise<StyleTag> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "캐주얼";
  }

  const { data } = await supabase
    .from("profiles")
    .select("style")
    .eq("id", user.id)
    .maybeSingle();

  return toRecommendationStyle(data?.style);
}

function formatWeatherForRecommendation(weather: WeatherSummary) {
  return `${weather.city}, ${Math.round(weather.temperature)}°C, 체감 ${Math.round(
    weather.feelsLike,
  )}°C, ${weather.description}, 습도 ${weather.humidity}%`;
}

const DEMO_USER_NAME = "지윤";

export default async function MainPage() {
  const [weather, closetItems, wardrobe, preferredStyle] = await Promise.all([
    getWeatherSafely(),
    getMyClosetItems(),
    getWardrobe(""),
    getPreferredStyle(),
  ]);

  const aiRecommendation =
    wardrobe.length > 0
      ? await recommendOutfit({
          wardrobe,
          style: preferredStyle,
          weather: formatWeatherForRecommendation(weather),
        }).catch((error) => {
          console.error("[MainPage recommendOutfit]", error);
          return null;
        })
      : null;

  const recommendations =
    aiRecommendation && wardrobe.length > 0
      ? buildAiOutfitRecommendations({
          recommendation: aiRecommendation,
          style: preferredStyle,
          wardrobe,
          weather,
        })
      : buildFeaturedRecommendations(closetItems);
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
