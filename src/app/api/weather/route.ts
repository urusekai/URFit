import { NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather/openweather";
import type { ApiResponse, WeatherSummary } from "@/types/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") ?? undefined;
    const country = searchParams.get("country") ?? undefined;

    const data = await getCurrentWeather({ city, country });
    const response: ApiResponse<WeatherSummary> = { ok: true, data };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const response: ApiResponse<WeatherSummary> = { ok: false, error: message };
    return NextResponse.json(response, { status: 500 });
  }
}
