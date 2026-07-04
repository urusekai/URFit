import type { Formality, Season, StyleTag } from "@/types/fitting";

/**
 * 베타 옷장(Storage look_beta_image)의 옷별 메타데이터.
 *
 * 폴더명만으로는 카테고리 정도만 알 수 있어(그마저도 셔츠 폴더에 니트·후드·티가 섞임),
 * 색상/패턴/소재/격식/계절/스타일을 사람이 직접 봐서 태깅해 둔다.
 * 추천을 이미지 대신 이 메타데이터로 수행할 수 있게 하는 것이 목적.
 *
 * key = Cloth.id (= `${folder}-${파일명(확장자 제외)}`)
 *
 * 정식 전환 시: 사용자 업로드 시점의 자동 태깅(Gemini 비전) 결과를 clothes DB에 저장하는 방식으로 교체.
 */

export type WardrobeMeta = {
  name: string;
  color: string;
  pattern: string;
  material: string;
  formality: Formality;
  seasons: Season[];
  styles: StyleTag[];
};

export const wardrobeMetadata: Record<string, WardrobeMeta> = {
  // ── 상의 (shirts 폴더) ──
  "shirts-sample_shirt_1": { name: "네이비 맨투맨", color: "navy", pattern: "solid", material: "cotton", formality: "casual", seasons: ["spring", "fall"], styles: ["캐주얼", "미니멀", "스트릿"] },
  "shirts-sample_shirt_2": { name: "레드 니트 스웨터", color: "red", pattern: "solid", material: "knit", formality: "casual", seasons: ["fall", "winter"], styles: ["캐주얼", "스트릿"] },
  "shirts-sample_shirt_3": { name: "레드/블랙 체크 플란넬 셔츠", color: "red", pattern: "check", material: "flannel", formality: "casual", seasons: ["fall", "winter"], styles: ["캐주얼", "스트릿"] },
  "shirts-sample_shirt_4": { name: "샌드 베이지 후드티", color: "beige", pattern: "solid", material: "cotton", formality: "casual", seasons: ["spring", "fall"], styles: ["캐주얼", "스트릿", "미니멀"] },
  "shirts-sample_shirt_5": { name: "블랙 슬림 니트", color: "black", pattern: "solid", material: "knit", formality: "smart-casual", seasons: ["fall", "winter"], styles: ["미니멀", "댄디", "캐주얼"] },
  "shirts-sample_shirt_6": { name: "화이트 드레스 셔츠", color: "white", pattern: "solid", material: "cotton", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },
  "shirts-sample_shirt_7": { name: "화이트 오버핏 반팔티", color: "white", pattern: "solid", material: "cotton", formality: "casual", seasons: ["summer"], styles: ["캐주얼", "미니멀", "스트릿"] },
  "shirts-sample_shirt_8": { name: "오트밀 린넨 셔츠", color: "oatmeal", pattern: "solid", material: "linen", formality: "smart-casual", seasons: ["spring", "summer"], styles: ["미니멀", "댄디", "캐주얼"] },
  "shirts-sample_shirt_9": { name: "그레이 그래픽 맨투맨", color: "grey", pattern: "graphic", material: "cotton", formality: "casual", seasons: ["spring", "fall"], styles: ["스트릿", "캐주얼"] },
  "shirts-sample_shirt_10": { name: "다크그린 후드티", color: "dark green", pattern: "solid", material: "cotton", formality: "casual", seasons: ["spring", "fall"], styles: ["캐주얼", "스트릿"] },

  // ── 아우터 (outers 폴더) ──
  "outers-sample_outer_1": { name: "차콜 울 롱코트", color: "charcoal", pattern: "solid", material: "wool", formality: "formal", seasons: ["winter"], styles: ["댄디", "미니멀"] },
  "outers-sample_outer_2": { name: "블루 데님 자켓", color: "blue", pattern: "denim", material: "denim", formality: "casual", seasons: ["spring", "fall"], styles: ["캐주얼", "스트릿"] },
  "outers-sample_outer_3": { name: "블랙 레더 자켓", color: "black", pattern: "solid", material: "leather", formality: "casual", seasons: ["fall"], styles: ["스트릿", "캐주얼"] },
  "outers-sample_outer_4": { name: "베이지 트렌치코트", color: "beige", pattern: "solid", material: "cotton", formality: "smart-casual", seasons: ["spring", "fall"], styles: ["댄디", "미니멀"] },
  "outers-sample_outer_5": { name: "네이비 정장 재킷", color: "navy", pattern: "solid", material: "wool", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },
  "outers-sample_outer_6": { name: "네이비 블레이저", color: "navy", pattern: "solid", material: "wool", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },

  // ── 하의 (pants 폴더) ──
  "pants-sample_pants_1": { name: "네이비 슬랙스", color: "navy", pattern: "solid", material: "wool", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },
  "pants-sample_pants_2": { name: "라이트그레이 와이드 스웨트팬츠", color: "grey", pattern: "solid", material: "cotton", formality: "casual", seasons: ["all"], styles: ["캐주얼", "스트릿"] },
  "pants-sample_pants_3": { name: "카키 와이드 치노", color: "khaki", pattern: "solid", material: "cotton", formality: "smart-casual", seasons: ["spring", "fall"], styles: ["캐주얼", "미니멀"] },
  "pants-sample_pants_4": { name: "블랙 슬랙스", color: "black", pattern: "solid", material: "polyester", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },
  "pants-sample_pants_5": { name: "라이트블루 와이드 청바지", color: "light blue", pattern: "denim", material: "denim", formality: "casual", seasons: ["all"], styles: ["캐주얼", "스트릿"] },
  "pants-sample_pants_6": { name: "크림 베이지 슬랙스", color: "cream", pattern: "solid", material: "polyester", formality: "smart-casual", seasons: ["all"], styles: ["미니멀", "댄디"] },

  // ── 신발 (shoes 폴더) ──
  "shoes-sample_shoes_1": { name: "화이트 레더 스니커즈", color: "white", pattern: "solid", material: "leather", formality: "smart-casual", seasons: ["all"], styles: ["캐주얼", "미니멀", "스트릿"] },
  "shoes-sample_shoes_2": { name: "블랙 더비 구두", color: "black", pattern: "solid", material: "leather", formality: "formal", seasons: ["all"], styles: ["댄디", "미니멀"] },
  "shoes-sample_shoes_3": { name: "블랙 청키 스니커즈", color: "black", pattern: "solid", material: "synthetic", formality: "casual", seasons: ["all"], styles: ["스트릿", "캐주얼"] },
  "shoes-sample_shoes_4": { name: "브라운 페니 로퍼", color: "brown", pattern: "solid", material: "leather", formality: "formal", seasons: ["spring", "fall"], styles: ["댄디", "미니멀"] },
  "shoes-sample_shoes_5": { name: "화이트 레더 스니커즈", color: "white", pattern: "solid", material: "leather", formality: "smart-casual", seasons: ["all"], styles: ["캐주얼", "미니멀"] },

  // ── 모자 (caps 폴더) ──
  "caps-sample_cap_1": { name: "블랙 볼캡", color: "black", pattern: "solid", material: "cotton", formality: "casual", seasons: ["all"], styles: ["캐주얼", "스트릿"] },
};
