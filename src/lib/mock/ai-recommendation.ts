import type { WeatherSummary } from "@/types/api";

/**
 * TODO(AI 코디 추천): 실제 Gemini 프롬프트가 완성되기 전까지 사용하는 가상 응답입니다.
 * `lib/ai/gemini.ts`의 `generateText`로 옷장 데이터 + 날씨를 넘겨 실제 추천을 받도록 교체 예정입니다.
 */
export type OutfitRecommendation = {
  styleTag: string;
  matchPercent: number;
  title: string;
  description: string;
  ctaLabel: string;
};

const RECOMMENDATION_BUCKETS: Array<{
  maxTemp: number;
  recommendation: OutfitRecommendation;
}> = [
  {
    maxTemp: 4,
    recommendation: {
      styleTag: "웜 레이어드",
      matchPercent: 90,
      title: "포근한 겨울 레이어드룩",
      description: "체감이 많이 낮아요. 두꺼운 아우터에 니트를 겹쳐 보온성을 챙겨보세요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
  {
    maxTemp: 10,
    recommendation: {
      styleTag: "캐주얼 아우터",
      matchPercent: 88,
      title: "산뜻한 캐주얼 아우터룩",
      description: "쌀쌀한 날씨엔 자켓 안에 맨투맨을 매치해 활동성과 보온을 함께 챙겨요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
  {
    maxTemp: 17,
    recommendation: {
      styleTag: "미니멀",
      matchPercent: 92,
      title: "차분한 뉴트럴 오피스룩",
      description: "선선한 날씨엔 자켓에 슬랙스, 톤온톤으로 정돈된 인상을 줘요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
  {
    maxTemp: 23,
    recommendation: {
      styleTag: "라이트 캐주얼",
      matchPercent: 94,
      title: "가벼운 셔츠 캐주얼룩",
      description: "포근한 날씨예요. 얇은 셔츠에 슬랙스나 청바지로 산뜻하게 연출해요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
  {
    maxTemp: 27,
    recommendation: {
      styleTag: "쿨 서머",
      matchPercent: 91,
      title: "시원한 여름 베이직룩",
      description: "따뜻한 날씨엔 통기성 좋은 반팔과 가벼운 소재로 시원하게 입어보세요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
  {
    maxTemp: Infinity,
    recommendation: {
      styleTag: "쿨링",
      matchPercent: 89,
      title: "무더위 대비 쿨링룩",
      description: "무더운 날씨예요. 반팔·반바지 등 최대한 가볍고 통기성 좋은 옷을 추천해요.",
      ctaLabel: "기상으로 입어보기",
    },
  },
];

export function getMockOutfitRecommendation(weather: WeatherSummary): OutfitRecommendation {
  const bucket = RECOMMENDATION_BUCKETS.find((item) => weather.temperature <= item.maxTemp);
  return bucket?.recommendation ?? RECOMMENDATION_BUCKETS[2].recommendation;
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
            ? "포근해요"
            : temp <= 27
              ? "따뜻해요"
              : "더워요";

  if (feelsLike <= temp - 3) {
    return `오늘은 ${tempLabel} · 체감은 ${feelsLike}°로 더 쌀쌀하니 겉옷을 챙기세요.`;
  }
  if (weather.condition === "Rain" || weather.condition === "Drizzle") {
    return `오늘은 비 소식이 있어요 · 방수 아우터나 우산을 챙기세요.`;
  }
  return `오늘은 ${tempLabel} · 저녁엔 기온이 낮아져서 자켓을 추천해요.`;
}

export function getWeatherGlyph(condition: string): string {
  switch (condition) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "⛅";
    case "Rain":
    case "Drizzle":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    case "Mist":
    case "Fog":
    case "Haze":
      return "🌫️";
    default:
      return "🌤️";
  }
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "늦은 밤이에요";
  if (hour < 12) return "좋은 아침이에요";
  if (hour < 18) return "좋은 오후예요";
  return "좋은 저녁이에요";
}
