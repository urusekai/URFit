import { IMAGES } from "@/constants/assets";
import type { WeatherSummary } from "@/types/api";

export type OutfitRecommendation = {
  styleTag: string;
  matchPercent: number;
  title: string;
  description: string;
  ctaLabel: string;
  imageUrl?: string;
  imageAlt?: string;
  recommendationImageUrl?: string;
  recommendationImageAlt?: string;
};

export const FEATURED_AI_RECOMMENDATION: OutfitRecommendation = {
  styleTag: "AI 데일리 추천",
  matchPercent: 94,
  title: "차분한 뉴트럴 오피스룩",
  description:
    "신선한 날씨엔 자켓에 슬랙스, 톤온톤으로 정돈된 인상을 줘요.",
  ctaLabel: "피팅으로 입어보기",
  imageUrl: IMAGES.illustrations.virtualFittingResult,
  imageAlt: "AI 추천 코디를 가상 피팅한 결과 이미지",
  recommendationImageUrl: IMAGES.illustrations.aiOutfitRecommendation,
  recommendationImageAlt: "AI가 추천한 캐주얼 코디 이미지",
};

const RECOMMENDATION_BUCKETS: Array<{
  maxTemp: number;
  recommendation: OutfitRecommendation;
}> = [
  {
    maxTemp: 4,
    recommendation: {
      styleTag: "윈터 레이어드",
      matchPercent: 90,
      title: "따뜻한 겨울 레이어드룩",
      description: "체감 온도가 낮아요. 아우터와 니트를 함께 매치해 보온감을 챙겨보세요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
  {
    maxTemp: 10,
    recommendation: {
      styleTag: "캐주얼 아우터",
      matchPercent: 88,
      title: "가볍게 걸치는 아우터룩",
      description: "쌀쌀한 날씨예요. 셔츠나 맨투맨 위에 아우터를 더하면 안정적이에요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
  {
    maxTemp: 17,
    recommendation: {
      styleTag: "미니멀",
      matchPercent: 92,
      title: "차분한 데일리룩",
      description: "선선한 날에는 긴팔 상의와 팬츠 조합이 편하게 어울려요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
  {
    maxTemp: 23,
    recommendation: {
      styleTag: "라이트 캐주얼",
      matchPercent: 94,
      title: "가벼운 셔츠 캐주얼룩",
      description: "쾌적한 날씨예요. 셔츠와 슬랙스나 데님을 자연스럽게 매치해보세요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
  {
    maxTemp: 27,
    recommendation: {
      styleTag: "쿨 썸머",
      matchPercent: 91,
      title: "시원한 여름 베이직룩",
      description: "얇고 통기성 좋은 상의를 중심으로 가볍게 입기 좋아요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
  {
    maxTemp: Infinity,
    recommendation: {
      styleTag: "쿨링",
      matchPercent: 89,
      title: "무더위 대비 쿨링룩",
      description: "무더운 날씨예요. 반팔과 가벼운 신발 조합을 추천해요.",
      ctaLabel: "피팅으로 입어보기",
    },
  },
];

export function getOutfitRecommendation(weather: WeatherSummary): OutfitRecommendation {
  const bucket = RECOMMENDATION_BUCKETS.find((item) => weather.temperature <= item.maxTemp);
  return bucket?.recommendation ?? RECOMMENDATION_BUCKETS[2].recommendation;
}

export function getFeaturedAiRecommendation(): OutfitRecommendation {
  return FEATURED_AI_RECOMMENDATION;
}

/** 홈 캐러셀용 큐레이션 룩 (대표 이미지는 옷장 상품 이미지에서 가져온다) */
const FEATURED_LOOKS: Array<{
  clothId: string;
  title: string;
  description: string;
}> = [
  {
    clothId: "outers-sample_outer_2",
    title: "차분한 뉴트럴 오피스룩",
    description: "신선한 날씨엔 자켓에 슬랙스, 톤온톤으로 정돈된 인상을 줘요.",
  },
  {
    clothId: "outers-sample_outer_5",
    title: "댄디 클래식 재킷룩",
    description: "네이비 재킷과 슬랙스로 단정하고 격식 있는 무드를 완성해요.",
  },
  {
    clothId: "shirts-sample_shirt_1",
    title: "편안한 데일리 캐주얼",
    description: "네이비 맨투맨에 데님을 매치해 힘을 뺀 하루를 완성해요.",
  },
];

type FeaturedCloth = { id: string; imageUrl?: string };

/** 옷장 이미지를 대표 이미지로 매핑해 캐러셀 슬라이드 목록을 만든다. */
export function buildFeaturedRecommendations(
  clothes: FeaturedCloth[],
): OutfitRecommendation[] {
  const byId = new Map(clothes.map((cloth) => [cloth.id, cloth]));

  return FEATURED_LOOKS.map((look) => ({
    styleTag: "AI 데일리 추천",
    matchPercent: 94,
    title: look.title,
    description: look.description,
    ctaLabel: "가상피팅으로 입어보기",
    recommendationImageUrl:
      byId.get(look.clothId)?.imageUrl ??
      FEATURED_AI_RECOMMENDATION.recommendationImageUrl,
    recommendationImageAlt: look.title,
  }));
}

export function getWeatherTip(weather: WeatherSummary): string {
  const temp = Math.round(weather.temperature);
  const feelsLike = Math.round(weather.feelsLike);
  const tempLabel =
    temp <= 4
      ? "많이 추워요"
      : temp <= 10
        ? "쌀쌀해요"
        : temp <= 17
          ? "선선해요"
          : temp <= 23
            ? "쾌적해요"
            : temp <= 27
              ? "따뜻해요"
              : "더워요";

  if (feelsLike <= temp - 3) {
    return `오늘은 ${tempLabel}. 체감 온도는 ${feelsLike}도로 더 낮으니 겉옷을 챙겨보세요.`;
  }
  if (weather.condition === "Rain" || weather.condition === "Drizzle") {
    return "오늘은 비 소식이 있어요. 방수 아우터나 우산을 챙겨보세요.";
  }
  return `오늘은 ${tempLabel}. 현재 기온에 맞춰 피팅 추천을 받아보세요.`;
}

export function getWeatherGlyph(condition: string): string {
  switch (condition) {
    case "Clear":
      return "☀";
    case "Clouds":
      return "☁";
    case "Rain":
    case "Drizzle":
      return "☂";
    case "Thunderstorm":
      return "⚡";
    case "Snow":
      return "❄";
    case "Mist":
    case "Fog":
    case "Haze":
      return "≈";
    default:
      return "•";
  }
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "좋은 밤이에요";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
}
