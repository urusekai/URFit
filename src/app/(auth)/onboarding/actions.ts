"use server";

import { classifyClothStyles } from "@/lib/fitting/autotag";
import { createClient } from "@/lib/supabase/server";
import { getStorageConfig, uploadStorageObject } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ClothesInsert = Database["public"]["Tables"]["clothes"]["Insert"];

// 팀이 이미 만들어 둔 비공개 버킷을 사용한다(전신=person, 옷=look).
const BODY_BUCKET = "person_beta_image";
const CLOTHES_BUCKET = "look_beta_image";

/** 빈 문자열·비숫자는 null로, 그 외에는 정수로 변환한다. */
function toInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/** 빈 문자열은 null로, 그 외에는 문자열로 변환한다. */
function toText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  return value;
}

/**
 * 클라이언트가 보낸 치수 JSON({항목명: "숫자문자열"})을 항목명→number 맵으로 바꾼다.
 * 카테고리마다 항목이 달라(상의 어깨/가슴/총장, 신발 발길이/발볼 등) jsonb로 저장한다.
 */
function parseMeasurements(value: FormDataEntryValue | null): Record<string, number> {
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

type StorageConfig = NonNullable<ReturnType<typeof getStorageConfig>>;

/**
 * 비공개 버킷의 `{userId}/` 폴더 아래에 이미지를 올리고 객체 경로를 돌려준다.
 * 파일이 없으면 업로드를 건너뛰고 null을 반환한다.
 * 반환하는 경로(`{userId}/{timestamp}.ext`)를 DB에 저장하고, 조회 시 서명 URL로 연다.
 *
 * 업로드는 서비스키(storage config)로 수행한다. 유저 세션으로 올리면 storage.objects
 * RLS insert 정책이 필요한데, 앱의 다른 스토리지 접근이 모두 서비스키를 쓰므로 여기에 맞춘다.
 * 경로가 인증된 user.id로 고정되므로 유저별 격리는 서버 코드가 보장한다.
 */
async function uploadPhoto(
  config: StorageConfig,
  bucket: string,
  userId: string,
  file: File | null,
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const ok = await uploadStorageObject(
    config,
    bucket,
    path,
    buffer,
    file.type || "image/jpeg",
  );
  if (!ok) throw new Error(`이미지 업로드 실패: ${bucket}`);

  return path;
}

/**
 * 온보딩 입력값을 로그인한 계정으로 Supabase에 저장한다.
 * 전신/옷 사진은 스토리지에 올리고, 기본 정보는 profiles, 옷 정보는 clothes에 기록한다.
 * 사진 두 장은 서로 독립적이라 병렬로 업로드한다.
 */
export async function saveOnboarding(formData: FormData): Promise<ApiResponse<null>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "로그인이 필요합니다. 다시 로그인해 주세요." };
  }

  try {
    const config = getStorageConfig();
    if (!config) {
      throw new Error("스토리지 설정이 없습니다. 관리자에게 문의해 주세요.");
    }

    const bodyPhoto = formData.get("bodyPhoto");
    const clothPhoto = formData.get("clothPhoto");

    const [bodyPhotoPath, clothPhotoPath] = await Promise.all([
      uploadPhoto(config, BODY_BUCKET, user.id, bodyPhoto instanceof File ? bodyPhoto : null),
      uploadPhoto(config, CLOTHES_BUCKET, user.id, clothPhoto instanceof File ? clothPhoto : null),
    ]);

    const brands = formData.getAll("brands").map(String);

    const profileRow: ProfileInsert = {
      id: user.id,
      gender: toText(formData.get("gender")),
      height: toInt(formData.get("height")),
      weight: toInt(formData.get("weight")),
      age: toInt(formData.get("age")),
      style: toText(formData.get("style")),
      brands,
      body_photo_url: bodyPhotoPath,
      updated_at: new Date().toISOString(),
    };
    const { error: profileError } = await supabase.from("profiles").upsert(profileRow);
    if (profileError) throw new Error(`프로필 저장 실패: ${profileError.message}`);

    // 옷 사진이나 카테고리가 들어온 경우에만 옷 한 벌을 추가한다.
    const category = toText(formData.get("category"));
    if (clothPhotoPath || category) {
      // 옷 사진이 있으면 Gemini 비전으로 스타일 자동 태깅 (추천 매칭용)
      let styles: string[] = [];
      if (clothPhoto instanceof File && clothPhoto.size > 0) {
        const base64 = Buffer.from(await clothPhoto.arrayBuffer()).toString("base64");
        styles = await classifyClothStyles(base64, clothPhoto.type);
      }

      const clothesRow: ClothesInsert = {
        user_id: user.id,
        photo_url: clothPhotoPath,
        category,
        material: toText(formData.get("material")),
        fit: toText(formData.get("fit")),
        size: toText(formData.get("size")),
        measurements: parseMeasurements(formData.get("measurements")),
        styles,
      };
      const { error: clothError } = await supabase.from("clothes").insert(clothesRow);
      if (clothError) throw new Error(`옷 정보 저장 실패: ${clothError.message}`);
    }
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : "저장 중 오류가 발생했습니다.",
    };
  }

  return { ok: true, data: null };
}
