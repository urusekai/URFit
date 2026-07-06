import { generateTextFromInputs } from "@/lib/ai/gemini";
import type { StyleTag } from "@/types/fitting";

/**
 * 옷 사진을 Gemini 비전으로 분석해 카테고리(상의/아우터/하의/신발/모자)와
 * 스타일(캐주얼/스트릿/미니멀/댄디)을 한 번에 태깅한다.
 *
 * - 등록 폼: 사진 선택 시 /api/classify-cloth 로 호출해 카테고리를 자동 선택(유저 수정 가능).
 * - 저장 시: styles 를 clothes.styles 에 저장해 /api/recommend 스타일 매칭에 사용.
 * 실패해도 등록/추천이 동작하도록 빈 값으로 폴백한다(베스트에포트).
 */

const STYLE_TAGS: StyleTag[] = ["캐주얼", "스트릿", "미니멀", "댄디"];
const CATEGORIES = ["상의", "아우터", "하의", "신발", "모자"];

/** 임의 값 배열을 유효한 StyleTag[]로 정규화(중복 제거). */
export function normalizeStyleTags(values: unknown): StyleTag[] {
  if (!Array.isArray(values)) return [];
  const valid = values.filter((value): value is StyleTag =>
    STYLE_TAGS.includes(value as StyleTag),
  );
  return Array.from(new Set(valid));
}

const PROMPT = `You are a fashion classifier. Analyze this single clothing item.

Category — choose exactly ONE that best fits:
- 상의 (top: t-shirt, shirt, knit, sweatshirt, hoodie)
- 아우터 (outerwear: coat, jacket, blazer, cardigan, denim jacket)
- 하의 (bottom: pants, jeans, skirt, shorts, slacks)
- 신발 (shoes)
- 모자 (hat, cap)

Style — choose 1 to 3 that apply:
- 캐주얼: relaxed, everyday
- 스트릿: bold, oversized, graphic, chunky
- 미니멀: simple, monochrome, restrained
- 댄디: clean, classic, tailored

Respond ONLY with this JSON (no extra text):
{ "category": "상의", "styles": ["캐주얼","미니멀"] }`;

export type ClothClassification = {
  category: string | null;
  styles: StyleTag[];
};

/** 카테고리 + 스타일을 한 번의 Gemini 호출로 분류. */
export async function classifyCloth(
  imageBase64: string,
  mimeType: string,
): Promise<ClothClassification> {
  try {
    const text = await generateTextFromInputs({
      prompt: PROMPT,
      images: [{ data: imageBase64, mimeType: mimeType || "image/jpeg" }],
      temperature: 0.2,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { category: null, styles: [] };
    }

    const parsed = JSON.parse(match[0]) as {
      category?: unknown;
      styles?: unknown;
    };
    const category =
      typeof parsed.category === "string" && CATEGORIES.includes(parsed.category)
        ? parsed.category
        : null;

    return { category, styles: normalizeStyleTags(parsed.styles) };
  } catch {
    return { category: null, styles: [] };
  }
}

/** 스타일만 필요할 때(저장 시 폴백). */
export async function classifyClothStyles(
  imageBase64: string,
  mimeType: string,
): Promise<StyleTag[]> {
  return (await classifyCloth(imageBase64, mimeType)).styles;
}
