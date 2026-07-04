import {
  createSignedUrl,
  fetchStorageBase64,
  getStorageConfig,
  listFolder,
  type StorageConfig,
} from "@/lib/supabase/storage";
import { wardrobeMetadata } from "@/lib/fitting/wardrobe-metadata";
import type { Cloth, ClothCategory } from "@/types/fitting";

/**
 * 베타 단계 어댑터 구현.
 *
 * 데이터 출처: Supabase Storage 버킷 (person_beta_image / look_beta_image)
 * 유저: 고정 베타 ID
 *
 * ── 정식 전환 시 (테스트 완료 후) ──
 * - getCurrentUserId(): 로그인 세션에서 userId 추출
 * - getWardrobe():      clothes DB 테이블 조회
 * - getUserPhoto*():    유저가 업로드한 사진
 * API 라우트는 이 어댑터만 호출하므로, 이 파일 내부만 교체하면 된다.
 */

export const BETA_USER_ID = "beta-user";

const PERSON_IMAGE_BUCKET = "person_beta_image";
const PERSON_IMAGE_OBJECT_PATH = "female/sample_female_1.png";
const LOOK_IMAGE_BUCKET = "look_beta_image";

type WardrobeFolder = {
  folder: string;
  category: ClothCategory;
  label: string;
};

const wardrobeFolders: WardrobeFolder[] = [
  { folder: "shirts", category: "top", label: "셔츠" },
  { folder: "outers", category: "outer", label: "아우터" },
  { folder: "pants", category: "bottom", label: "팬츠" },
  { folder: "shoes", category: "shoes", label: "신발" },
  { folder: "caps", category: "hat", label: "캡" },
];

function getFileOrder(fileName: string) {
  const match = fileName.match(/_(\d+)\.png$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

/** 현재 사용자 ID. 베타에서는 고정값. */
export async function getCurrentUserId(): Promise<string> {
  return BETA_USER_ID;
}

/** 사용자 전신 사진의 표시용 signed URL */
export async function getUserPhotoSignedUrl(
  _userId: string,
): Promise<string | undefined> {
  const config = getStorageConfig();
  if (!config) {
    return undefined;
  }

  return createSignedUrl(config, PERSON_IMAGE_BUCKET, PERSON_IMAGE_OBJECT_PATH);
}

/** 사용자 전신 사진 base64 (Gemini 입력용) */
export async function getUserPhotoBase64(
  _userId: string,
): Promise<string | undefined> {
  const config = getStorageConfig();
  if (!config) {
    return undefined;
  }

  return fetchStorageBase64(
    config,
    PERSON_IMAGE_BUCKET,
    PERSON_IMAGE_OBJECT_PATH,
  );
}

async function listFolderAsClothes(
  config: StorageConfig,
  folderConfig: WardrobeFolder,
): Promise<Cloth[]> {
  const objects = (await listFolder(config, LOOK_IMAGE_BUCKET, folderConfig.folder))
    .filter((object) => object.name.endsWith(".png"))
    .sort((left, right) => getFileOrder(left.name) - getFileOrder(right.name));

  return Promise.all(
    objects.map(async (object) => {
      const fileOrder = getFileOrder(object.name);
      const id = `${folderConfig.folder}-${object.name.replace(/\.png$/, "")}`;
      const imagePath = `${folderConfig.folder}/${object.name}`;
      const imageUrl = await createSignedUrl(
        config,
        LOOK_IMAGE_BUCKET,
        imagePath,
      );

      // 폴더 기반 기본값 위에 개별 메타데이터(있으면)를 덮어쓴다.
      const meta = wardrobeMetadata[id];

      return {
        id,
        name: meta?.name ?? `${folderConfig.label} ${fileOrder}`,
        category: folderConfig.category,
        color: meta?.color ?? "",
        pattern: meta?.pattern ?? "solid",
        material: meta?.material ?? "",
        formality: meta?.formality ?? "casual",
        seasons: meta?.seasons ?? ["all"],
        styles: meta?.styles ?? [],
        imagePath,
        imageUrl,
      } satisfies Cloth;
    }),
  );
}

/** 사용자 옷장. 베타에서는 Storage 버킷을 스캔. */
export async function getWardrobe(_userId: string): Promise<Cloth[]> {
  const config = getStorageConfig();
  if (!config) {
    return [];
  }

  const itemsByFolder = await Promise.all(
    wardrobeFolders.map((folderConfig) =>
      listFolderAsClothes(config, folderConfig),
    ),
  );

  return itemsByFolder.flat();
}

/** 특정 옷 이미지의 base64 (Gemini 입력용) */
export async function getClothBase64(
  cloth: Pick<Cloth, "imagePath">,
): Promise<string | undefined> {
  const config = getStorageConfig();
  if (!config) {
    return undefined;
  }

  return fetchStorageBase64(config, LOOK_IMAGE_BUCKET, cloth.imagePath);
}
