import {
  FittingExperience,
  type FittingCategory,
  type FittingItem,
} from "@/components/features/fitting/FittingExperience";
import {
  getCurrentUserId,
  getUserPhotoSignedUrl,
  getWardrobe,
} from "@/lib/fitting";
import type { Cloth, ClothCategory } from "@/types/fitting";

// 도메인 옷 카테고리 → UI 옷장 탭.
const CATEGORY_TO_UI: Record<ClothCategory, FittingCategory> = {
  top: "top",
  outer: "outer",
  bottom: "bottom",
  shoes: "shoes",
  hat: "hat",
};

// 이미지가 없을 때 쓰는 글리프 폴백 모양. (Storage 항목은 imageUrl이 있어 거의 사용 안 됨)
const CATEGORY_TO_SHAPE: Record<ClothCategory, FittingItem["shape"]> = {
  top: "shirt",
  outer: "jacket",
  bottom: "pants",
  shoes: "shoes",
  hat: "cap",
};

function toFittingItem(cloth: Cloth): FittingItem {
  return {
    id: cloth.id,
    category: CATEGORY_TO_UI[cloth.category],
    name: cloth.name,
    colorClass: "bg-[#f0ece6]",
    imageUrl: cloth.imageUrl,
    shape: CATEGORY_TO_SHAPE[cloth.category],
  };
}

export default async function FittingPage() {
  const userId = await getCurrentUserId();
  const [personImageUrl, clothes] = await Promise.all([
    getUserPhotoSignedUrl(userId),
    getWardrobe(userId),
  ]);

  const items = clothes.map(toFittingItem);

  return <FittingExperience items={items} personImageUrl={personImageUrl} />;
}
