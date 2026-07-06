import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImageFromInputs } from "@/lib/ai/gemini";
import {
  getClothBase64,
  getCurrentUserId,
  getUserPhotoBase64,
  getWardrobe,
} from "@/lib/fitting";
import type { ApiResponse } from "@/types/api";
import type { Cloth, ClothCategory } from "@/types/fitting";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  clothIds: z.array(z.string()).min(1),
});

// 레퍼런스 이미지 순서(레이어링 힌트): 아우터를 마지막에 두어 상의 위에 겹치도록.
const LAYER_ORDER: Record<ClothCategory, number> = {
  top: 0,
  bottom: 1,
  shoes: 2,
  hat: 3,
  outer: 4,
};

const FITTING_PROMPT = `Dress the person in the first image with ALL of the
garments shown in the following reference images. Place each garment on its
correct body position (top on torso, bottom on legs, outerwear over the top,
shoes on feet, hat on head).

ABSOLUTE RULES:
1. Apply EVERY garment provided. Do not skip or merge them.
2. Each garment must keep EXACTLY the length, shape, color, and texture from
   its reference image. Never reshape into a different garment type. Do not
   blend two garments into one.
3. Layer correctly: outerwear over the top, inner top visible at collar and
   opening. Keep each layer distinct.
4. Any body part or original garment NOT covered by a provided item stays
   unchanged and fully visible from the first image.
5. Completely remove the original garment underneath before replacing it.
6. Keep the person's face, hair, body shape, skin tone, and pose EXACTLY the same.
7. Ignore any tags, labels, or stickers on any garment.
8. Replace the entire background with a single solid, flat cream color
   (hex #F6F5F2, a warm off-white). The background must be perfectly uniform —
   no gradient, shadow, floor line, texture, or props.
9. Keep the exact same portrait framing, full-body composition, camera distance,
   and image proportions as the first image. Do not crop, zoom, or change the
   aspect ratio.

Output a single photorealistic full-body image on a flat #F6F5F2 cream
background, with the same framing as the first image.`;

function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

// 동일한 옷 조합은 결과를 재사용해 재생성(수십 초)을 건너뛴다.
// 인메모리 캐시라 서버 재시작 시 사라진다(베타용). 정식 단계에서는 영속 캐시로 교체.
type FittingResult = { image: string; mimeType: string };
const MAX_CACHE_ENTRIES = 50;
const fittingCache = new Map<string, FittingResult>();

function getCacheKey(userId: string, clothIds: string[]) {
  return `${userId}:${[...clothIds].sort().join(",")}`;
}

function cacheFittingResult(key: string, result: FittingResult) {
  if (fittingCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = fittingCache.keys().next().value;
    if (oldestKey !== undefined) {
      fittingCache.delete(oldestKey);
    }
  }
  fittingCache.set(key, result);
}

export async function POST(request: Request) {
  let clothIds: string[];
  try {
    ({ clothIds } = bodySchema.parse(await request.json()));
  } catch {
    return jsonResponse({ ok: false, error: "잘못된 요청입니다." }, 400);
  }

  const userId = await getCurrentUserId();

  // 선택 id를 옷장에서 실제 옷으로 해석 (storage 경로는 서버에만 유지)
  const wardrobe = await getWardrobe(userId);
  const selected = clothIds
    .map((id) => wardrobe.find((cloth) => cloth.id === id))
    .filter((cloth): cloth is Cloth => Boolean(cloth))
    .sort((left, right) => LAYER_ORDER[left.category] - LAYER_ORDER[right.category]);

  if (selected.length === 0) {
    return jsonResponse({ ok: false, error: "선택한 옷을 찾을 수 없습니다." }, 400);
  }

  // 동일 조합이면 캐시된 결과를 즉시 반환
  const cacheKey = getCacheKey(
    userId,
    selected.map((cloth) => cloth.id),
  );
  const cached = fittingCache.get(cacheKey);
  if (cached) {
    return jsonResponse({ ok: true, data: cached });
  }

  const personBase64 = await getUserPhotoBase64(userId);
  if (!personBase64) {
    return jsonResponse(
      { ok: false, error: "사용자 사진을 불러오지 못했습니다." },
      502,
    );
  }

  const garmentBase64List = await Promise.all(
    selected.map((cloth) => getClothBase64(cloth)),
  );
  const garmentImages = garmentBase64List
    .filter((data): data is string => Boolean(data))
    .map((data) => ({ data, mimeType: "image/png" }));

  if (garmentImages.length === 0) {
    return jsonResponse(
      { ok: false, error: "옷 이미지를 불러오지 못했습니다." },
      502,
    );
  }

  try {
    const result = await generateImageFromInputs({
      prompt: FITTING_PROMPT,
      images: [{ data: personBase64, mimeType: "image/jpeg" }, ...garmentImages],
      temperature: 0.4,
      // 기본 인물 이미지(1024x1536, 2:3 세로)와 동일한 비율로 강제
      aspectRatio: "2:3",
    });

    if (!result.image) {
      return jsonResponse(
        { ok: false, error: "피팅 이미지를 생성하지 못했습니다." },
        502,
      );
    }

    const data: FittingResult = {
      image: result.image.data,
      mimeType: result.image.mimeType,
    };
    cacheFittingResult(cacheKey, data);

    return jsonResponse({ ok: true, data });
  } catch (error) {
    console.error("[/api/fitting]", error);
    return jsonResponse(
      { ok: false, error: "피팅 생성 중 오류가 발생했습니다." },
      500,
    );
  }
}
