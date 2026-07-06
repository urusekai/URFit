import { getWeatherGlyph } from "@/lib/mock/ai-recommendation";
import type { WeatherSummary } from "@/types/api";

export function WeatherPill({ weather }: { weather: WeatherSummary }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-off-white px-3 py-2 text-sm font-semibold text-charcoal">
      <span aria-hidden>{getWeatherGlyph(weather.condition)}</span>
      <span>{Math.round(weather.temperature)}°</span>
    </div>
  );
}
