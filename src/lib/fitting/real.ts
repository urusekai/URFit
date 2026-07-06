import { createClient } from "@/lib/supabase/server";
import {
  createSignedUrl,
  fetchStorageBase64,
  getStorageConfig,
} from "@/lib/supabase/storage";
import type { Database } from "@/types/database";
import type { Cloth, ClothCategory } from "@/types/fitting";

/**
 * 정식(로그인 유저) 피팅 데이터 어댑터.
 *
 * 데이터 출처:
 * - 전신 사진: profiles.body_photo_url (person_beta_image 버킷)
 * - 옷:        clothes 테이블 + look_beta_image 버킷 (온보딩에서 등록한 사진)
 * 유저: 로그인 세션의 auth.uid()
 *
 * clothes 행은 유저 세션(RLS로 본인 행만)으로 읽고, 이미지 base64/signed URL은
 * 서비스키(storage config)로 발급한다. beta.ts와 동일한 인터페이스를 노출해
 * index.ts가 export 대상만 바꾸면 페이지·API 라우트는 손대지 않아도 된다.
 */

const PERSON_IMAGE_BUCKET = "person_beta_image";
const LOOK_IMAGE_BUCKET = "look_beta_image";

type ClothesRow = Database["public"]["Tables"]["clothes"]["Row"];

// 온보딩이 저장하는 한글 카테고리 → 도메인 카테고리. 온보딩엔 아우터 항목이 없다.
const KR_CATEGORY_TO_CLOTH: Record<string, ClothCategory> = {
  상의: "top",
  하의: "bottom",
  신발: "shoes",
  모자: "hat",
};

const CATEGORY_LABEL: Record<ClothCategory, string> = {
  top: "상의",
  bottom: "하의",
  shoes: "신발",
  hat: "모자",
  outer: "아우터",
};

/** 로그인 세션에서 auth.uid() 추출 (없으면 undefined). */
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** 현재 로그인 사용자 ID. 미로그인 시 빈 문자열. */
export async function getCurrentUserId(): Promise<string> {
  const user = await getAuthUser();
  return user?.id ?? "";
}

/** 본인 프로필의 전신 사진 경로 (없으면 undefined). */
async function getBodyPhotoPath(): Promise<string | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return undefined;
  }

  const { data } = await supabase
    .from("profiles")
    .select("body_photo_url")
    .eq("id", user.id)
    .maybeSingle();

  return data?.body_photo_url ?? undefined;
}

/** 사용자 전신 사진의 표시용 signed URL */
export async function getUserPhotoSignedUrl(
  _userId: string,
): Promise<string | undefined> {
  const config = getStorageConfig();
  const path = await getBodyPhotoPath();
  if (!config || !path) {
    return undefined;
  }

  return createSignedUrl(config, PERSON_IMAGE_BUCKET, path);
}

/** 사용자 전신 사진 base64 (Gemini 입력용) */
export async function getUserPhotoBase64(
  _userId: string,
): Promise<string | undefined> {
  const config = getStorageConfig();
  const path = await getBodyPhotoPath();
  if (!config || !path) {
    return undefined;
  }

  return fetchStorageBase64(config, PERSON_IMAGE_BUCKET, path);
}

/**
 * clothes 행 → Cloth. 온보딩이 받지 않는 값(색상/패턴/격식/계절/스타일)은
 * 기본값으로 채운다. 추천(/api/recommend)은 이 메타데이터가 비면 카테고리 기준으로만 동작한다.
 */
function toCloth(row: ClothesRow): Cloth {
  const category = KR_CATEGORY_TO_CLOTH[row.category ?? ""] ?? "top";
  const material = row.material ?? "";
  const name =
    [material, CATEGORY_LABEL[category]].filter(Boolean).join(" ") ||
    CATEGORY_LABEL[category];

  return {
    id: row.id,
    name,
    category,
    color: "",
    pattern: "solid",
    material,
    formality: "casual",
    seasons: ["all"],
    styles: [],
    imagePath: row.photo_url ?? "",
    imageUrl: undefined,
  };
}

/** 사용자 옷장. clothes 테이블에서 사진이 있는 등록 옷만. */
export async function getWardrobe(_userId: string): Promise<Cloth[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from("clothes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error || !rows) {
    return [];
  }

  const config = getStorageConfig();

  return Promise.all(
    rows
      .filter((row) => Boolean(row.photo_url))
      .map(async (row) => {
        const cloth = toCloth(row);
        cloth.imageUrl =
          config && cloth.imagePath
            ? await createSignedUrl(config, LOOK_IMAGE_BUCKET, cloth.imagePath)
            : undefined;
        return cloth;
      }),
  );
}

/** 특정 옷 이미지의 base64 (Gemini 입력용) */
export async function getClothBase64(
  cloth: Pick<Cloth, "imagePath">,
): Promise<string | undefined> {
  const config = getStorageConfig();
  if (!config || !cloth.imagePath) {
    return undefined;
  }

  return fetchStorageBase64(config, LOOK_IMAGE_BUCKET, cloth.imagePath);
}
