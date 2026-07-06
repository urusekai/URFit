/** 가상 피팅 도메인 타입 (UI가 아닌 데이터/로직 계층에서 사용) */

/**
 * 옷 카테고리.
 * - UI 옷장 탭은 top/bottom/shoes/hat 4개지만, 추천 로직의 레이어링을 위해
 *   아우터(outer)를 별도 카테고리로 구분한다. UI에서는 outer를 top으로 접어서 표시.
 */
export type ClothCategory = "top" | "bottom" | "shoes" | "hat" | "outer";

/** 추천 스타일 4종 (UI 칩과 동일) */
export type StyleTag = "캐주얼" | "스트릿" | "미니멀" | "댄디";

export type Season = "spring" | "summer" | "fall" | "winter" | "all";

export type Formality = "casual" | "smart-casual" | "formal";

export type Cloth = {
  id: string;
  name: string; // "네이비 맨투맨"
  category: ClothCategory;
  color: string; // "navy" 등 (베타 단계에서는 빈 값일 수 있음)
  pattern: string; // "solid" | "check" | "graphic" | "denim"
  material: string; // "cotton" | "wool" | "leather" ...
  formality: Formality;
  seasons: Season[];
  styles: StyleTag[]; // 어울리는 스타일(다중)
  imagePath: string; // Storage 버킷 내 경로 (예: "shirts/shirts_1.png")
  imageUrl?: string; // 표시용 signed URL
};

export type Look = {
  id: string;
  name: string; // 룩명
  clothIds: string[]; // 구성 옷 id들
  resultImage: string; // 피팅 결과 이미지 경로 또는 URL
  createdAt: string;
};
