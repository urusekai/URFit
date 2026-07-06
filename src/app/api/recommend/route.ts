import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/ai/gemini";
import { getCurrentUserId, getWardrobe } from "@/lib/fitting";
import type { ApiResponse } from "@/types/api";
import type { Cloth, ClothCategory, StyleTag } from "@/types/fitting";

export const runtime = "nodejs";
export const maxDuration = 30;

const STYLES = ["캐주얼", "스트릿", "미니멀", "댄디"] as const satisfies readonly StyleTag[];

const bodySchema = z.object({
  style: z.enum(STYLES).default("캐주얼"),
  weather: z.string().min(1).default("서울, 온화한 날씨"),
});

const REQUIRED_CATEGORIES: ClothCategory[] = ["top", "bottom"];
const OPTIONAL_CATEGORIES: ClothCategory[] = ["shoes", "hat", "outer"];

// 이미지 대신 메타데이터 텍스트로 추천하므로 후보 수 제한은 속도가 아닌 "프롬프트 크기" 안전장치.
// 베타 옷장은 카테고리당 최대 10벌이라 사실상 전부 포함된다.
const MAX_CANDIDATES_PER_CATEGORY = 10;

const STYLE_GUIDE = `- 캐주얼: 편안한 데일리 룩
- 스트릿: 과감하고 트렌디, 오버핏/그래픽/청키
- 미니멀: 단순하고 절제된 무채색 위주
- 댄디: 단정하고 클래식한 테일러드`;

type RecommendedItem = {
  clothId: string;
  category: ClothCategory;
};

type RecommendData = {
  items: RecommendedItem[];
  reason: string[];
};

type GeminiRecommendResult = {
  selected_items?: Array<{
    id?: string;
    category?: ClothCategory;
    reason?: string;
  }>;
  reason?: string[];
};

function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

function filterCandidates(clothes: Cloth[], maxPerCategory: number): Cloth[] {
  const counts = new Map<ClothCategory, number>();
  const result: Cloth[] = [];

  for (const cloth of clothes) {
    const count = counts.get(cloth.category) ?? 0;
    if (count >= maxPerCategory) {
      continue;
    }

    counts.set(cloth.category, count + 1);
    result.push(cloth);
  }

  return result;
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Recommendation response did not include JSON.");
  }

  return candidate.slice(start, end + 1);
}

function buildRecommendPrompt({
  candidates,
  style,
  weather,
}: {
  candidates: Cloth[];
  style: string;
  weather: string;
}) {
  const itemList = candidates
    .map(
      (item) =>
        `- id=${item.id} | ${item.name} | category=${item.category} | color=${item.color} | pattern=${item.pattern} | material=${item.material} | formality=${item.formality} | styles=${item.styles.join("/")} | seasons=${item.seasons.join("/")}`,
    )
    .join("\n");

  return `You are a fashion stylist. Recommend ONE complete outfit for an adult woman using ONLY the wardrobe items listed below.

Requested style: ${style}
Weather: ${weather}

Style guide:
${STYLE_GUIDE}

Wardrobe (choose by id):
${itemList}

Rules:
1. Choose only ids from the wardrobe list. Never invent ids.
2. Strongly prefer items whose "styles" include "${style}".
3. Always include exactly one top and one bottom.
4. Include shoes when available.
5. Include outerwear only when the weather or the style calls for it.
6. Include a hat only when it clearly improves the style.
7. Prefer a coherent color palette and seasonally sensible choices.

Respond ONLY with this JSON (no extra text):
{
  "selected_items": [
    { "id": "wardrobe-id", "category": "top", "reason": "short reason" }
  ],
  "reason": ["short reason", "short reason", "short reason"]
}`;
}

function parseRecommendation(text: string) {
  const json = extractJson(text);
  return JSON.parse(json) as GeminiRecommendResult;
}

function chooseFallback(candidates: Cloth[], category: ClothCategory) {
  return candidates.find((item) => item.category === category);
}

function normalizeRecommendation(
  candidates: Cloth[],
  recommendation: GeminiRecommendResult,
): RecommendData {
  const byId = new Map(candidates.map((item) => [item.id, item]));
  const selected = new Map<ClothCategory, Cloth>();

  for (const item of recommendation.selected_items ?? []) {
    if (!item.id) {
      continue;
    }

    const cloth = byId.get(item.id);
    if (!cloth || selected.has(cloth.category)) {
      continue;
    }

    selected.set(cloth.category, cloth);
  }

  for (const category of REQUIRED_CATEGORIES) {
    if (!selected.has(category)) {
      const fallback = chooseFallback(candidates, category);
      if (fallback) {
        selected.set(category, fallback);
      }
    }
  }

  for (const category of OPTIONAL_CATEGORIES) {
    if (!selected.has(category)) {
      const recommended = (recommendation.selected_items ?? [])
        .map((item) => (item.id ? byId.get(item.id) : undefined))
        .find((cloth) => cloth?.category === category);

      if (recommended) {
        selected.set(category, recommended);
      }
    }
  }

  const items = Array.from(selected.values()).map((cloth) => ({
    clothId: cloth.id,
    category: cloth.category,
  }));

  return {
    items,
    reason: recommendation.reason?.slice(0, 3) ?? [],
  };
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

  const candidates = filterCandidates(wardrobe, MAX_CANDIDATES_PER_CATEGORY);

  try {
    const text = await generateText({
      prompt: buildRecommendPrompt({
        candidates,
        style: requestBody.style,
        weather: requestBody.weather,
      }),
      temperature: 0.5,
    });

    const recommendation = normalizeRecommendation(
      candidates,
      parseRecommendation(text),
    );

    if (recommendation.items.length === 0) {
      return jsonResponse(
        { ok: false, error: "추천 코디를 만들지 못했습니다." },
        502,
      );
    }

    return jsonResponse({ ok: true, data: recommendation });
  } catch (error) {
    console.error("[/api/recommend]", error);
    return jsonResponse(
      { ok: false, error: "AI 코디 추천 중 오류가 발생했습니다." },
      500,
    );
  }
}
