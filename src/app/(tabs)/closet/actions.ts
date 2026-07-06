"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createSignedUrl,
  deleteStorageObjects,
  getStorageConfig,
  uploadStorageObject,
} from "@/lib/supabase/storage";
import { toClosetItemFromRow, type ClosetItem } from "@/lib/wardrobe/catalog";
import type { ApiResponse } from "@/types/api";
import type { Database } from "@/types/database";

type ClothesInsert = Database["public"]["Tables"]["clothes"]["Insert"];

// 옷 사진이 저장된 비공개 버킷(onboarding actions의 CLOTHES_BUCKET과 동일).
const CLOTHES_BUCKET = "look_beta_image";

/** 빈 문자열은 null로, 그 외에는 문자열로. */
function toText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value;
}

/** 치수 JSON({항목: "숫자문자열"})을 항목→number 맵으로. (온보딩 actions와 동일 규칙) */
function parseMeasurements(
  value: FormDataEntryValue | null,
): Record<string, number> {
  if (typeof value !== "string" || value.trim() === "") return {};
  try {
    const raw = JSON.parse(value) as Record<string, unknown>;
    const result: Record<string, number> = {};
    for (const [key, entry] of Object.entries(raw)) {
      const parsed = Number.parseInt(String(entry), 10);
      if (!Number.isNaN(parsed)) result[key] = parsed;
    }
    return result;
  } catch {
    return {};
  }
}

/**
 * 로그인 사용자가 등록한 옷 한 벌을 삭제한다.
 * clothes 행은 유저 세션(RLS로 본인 행만)으로 지우고, 옷 이미지 파일은
 * 서비스키로 정리한다. 이미지 삭제가 실패해도 행 삭제 자체는 유효하다.
 */
export async function deleteClosetItem(
  id: string,
): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  // 지우기 전에 이미지 경로 확보 (RLS로 본인 행만 조회됨)
  const { data: row } = await supabase
    .from("clothes")
    .select("photo_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("clothes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    return { ok: false, error: "옷을 삭제하지 못했습니다." };
  }

  const config = getStorageConfig();
  if (config && row?.photo_url) {
    await deleteStorageObjects(config, CLOTHES_BUCKET, [row.photo_url]);
  }

  revalidatePath("/closet");
  return { ok: true, data: null };
}

/**
 * 옷장에서 옷 한 벌을 등록한다. (온보딩 3단계의 옷 저장과 동일한 clothes 스키마)
 * 사진은 서비스키로 `{userId}/{timestamp}.ext`에 올리고, clothes 행을 유저 세션으로 insert한다.
 * 저장된 행을 옷장 카드용 ClosetItem으로 돌려줘 UI가 바로 목록에 추가할 수 있게 한다.
 */
export async function saveClosetItem(
  formData: FormData,
): Promise<ApiResponse<ClosetItem>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "로그인이 필요합니다." };
  }

  const config = getStorageConfig();
  if (!config) {
    return { ok: false, error: "스토리지 설정이 없습니다." };
  }

  // 옷 사진 업로드 (있을 때만)
  const clothPhoto = formData.get("clothPhoto");
  let photoPath: string | null = null;
  if (clothPhoto instanceof File && clothPhoto.size > 0) {
    const ext = clothPhoto.name.split(".").pop()?.toLowerCase() || "jpg";
    photoPath = `${user.id}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await clothPhoto.arrayBuffer());
    const uploaded = await uploadStorageObject(
      config,
      CLOTHES_BUCKET,
      photoPath,
      buffer,
      clothPhoto.type || "image/jpeg",
    );
    if (!uploaded) {
      return { ok: false, error: "이미지 업로드에 실패했습니다." };
    }
  }

  const row: ClothesInsert = {
    user_id: user.id,
    photo_url: photoPath,
    category: toText(formData.get("category")),
    material: toText(formData.get("material")),
    fit: toText(formData.get("fit")),
    size: toText(formData.get("size")),
    measurements: parseMeasurements(formData.get("measurements")),
  };

  const { data: inserted, error } = await supabase
    .from("clothes")
    .insert(row)
    .select("*")
    .single();
  if (error || !inserted) {
    return { ok: false, error: "옷 정보를 저장하지 못했습니다." };
  }

  const imageUrl = photoPath
    ? await createSignedUrl(config, CLOTHES_BUCKET, photoPath)
    : undefined;
  const item = toClosetItemFromRow(inserted, imageUrl);
  if (!item) {
    return { ok: false, error: "저장은 됐지만 목록에 표시할 수 없습니다." };
  }

  revalidatePath("/closet");
  return { ok: true, data: item };
}
