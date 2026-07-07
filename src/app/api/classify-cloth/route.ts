import { NextResponse } from "next/server";
import { classifyCloth } from "@/lib/fitting/autotag";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";
import type { ClothClassification } from "@/lib/fitting/autotag";

export const runtime = "nodejs";
export const maxDuration = 30;

function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

/** 등록 폼에서 옷 사진 선택 시 호출 → 카테고리/스타일 자동 판별 (유저가 수정 가능). */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return jsonResponse({ ok: false, error: "로그인이 필요합니다." }, 401);
  }

  const form = await request.formData();
  const file = form.get("clothPhoto");
  if (!(file instanceof File) || file.size === 0) {
    return jsonResponse({ ok: false, error: "이미지가 없습니다." }, 400);
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const result = await classifyCloth(base64, file.type);

  return jsonResponse<ClothClassification>({ ok: true, data: result });
}
