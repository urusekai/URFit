"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/app";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

type UpdateMyProfileInput = {
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  age?: number | null;
  bodyType?: string | null;
  style?: string | null;
  brands?: string[];
};

export async function updateMyProfile(
  input: UpdateMyProfileInput,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      gender: input.gender ?? null,
      height: input.height ?? null,
      weight: input.weight ?? null,
      age: input.age ?? null,
      body_type: input.bodyType ?? null,
      style: input.style ?? null,
      brands: input.brands ?? [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: `프로필 저장 실패: ${error.message}` };
  }

  revalidatePath(ROUTES.mypage);
  return { ok: true, data: null };
}
