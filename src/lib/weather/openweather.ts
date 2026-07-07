import { requireEnv, serverEnv } from "@/lib/env";
import type { WeatherSummary } from "@/types/api";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

type OpenWeatherResponse = {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
};

export async function getCurrentWeather(options?: {
  city?: string;
  country?: string;
}): Promise<WeatherSummary> {
  const apiKey = requireEnv(serverEnv.OPENWEATHER_API_KEY, "OPENWEATHER_API_KEY");
  const city = options?.city ?? serverEnv.OPENWEATHER_DEFAULT_CITY;
  const country = options?.country ?? serverEnv.OPENWEATHER_DEFAULT_COUNTRY;

  const params = new URLSearchParams({
    q: `${city},${country}`,
    appid: apiKey,
    units: "metric",
    lang: "kr",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(`OpenWeather API error: ${response.status}`);
  }

  const data = (await response.json()) as OpenWeatherResponse;
  const condition = data.weather[0];

  return {
    city: data.name,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: condition.main,
    description: condition.description,
    icon: condition.icon,
  };
}
