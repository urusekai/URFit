import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId, getWardrobe } from "@/lib/fitting";
import {
  RECOMMENDATION_STYLES,
  recommendOutfit,
} from "@/lib/outfit/recommend-engine";
import type { ApiResponse } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 30;

const bodySchema = z.object({
  style: z.enum(RECOMMENDATION_STYLES).default("캐주얼"),
  weather: z.string().min(1).default("서울, 온화한 날씨"),
});

function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let requestBody: z.infer<typeof bodySchema>;

  try {
    requestBody = bodySchema.parse(await request.json());
  } catch {
    return jsonResponse({ ok: false, error: "잘못된 추천 요청입니다." }, 400);
  }

  const userId = await getCurrentUserId();
  const wardrobe = await getWardrobe(userId);

  if (wardrobe.length === 0) {
    return jsonResponse({ ok: false, error: "추천할 옷장이 비어 있습니다." }, 400);
  }

  try {
    const recommendation = await recommendOutfit({
      wardrobe,
      style: requestBody.style,
      weather: requestBody.weather,
    });

    if (recommendation.items.length === 0) {
      return jsonResponse(
        { ok: false, error: "추천 코디를 만들지 못했습니다." },
        502,
      );
    }

    return jsonResponse({
      ok: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("[/api/recommend]", error);
    return jsonResponse(
      { ok: false, error: "AI 코디 추천 중 오류가 발생했습니다." },
      500,
    );
  }
}
