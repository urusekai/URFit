/**
 * 실제 옷장 테이블(Supabase)이 생기기 전까지 사용하는 임시 목업 데이터입니다.
 * `types/database.ts`에 wardrobe 테이블이 추가되면 이 파일은 제거하고
 * 실제 fetch 로직으로 교체하세요.
 */

export type ClosetCategory = "top" | "bottom" | "shoes" | "hat";

export const CLOSET_CATEGORIES: { value: ClosetCategory; label: string }[] = [
  { value: "top", label: "상의" },
  { value: "bottom", label: "하의" },
  { value: "shoes", label: "신발" },
  { value: "hat", label: "모자" },
];

export const CLOSET_CATEGORY_LABEL: Record<ClosetCategory, string> = {
  top: "상의",
  bottom: "하의",
  shoes: "신발",
  hat: "모자",
};

export type ClosetMeasurement = {
  label: string;
  value: string;
};

export type ClosetItem = {
  id: string;
  name: string;
  brand: string;
  category: ClosetCategory;
  /** 카드 썸네일 배경 톤 */
  swatch: string;
  /** 아이콘/포인트 컬러 */
  accent: string;
  createdAt: string;
  /** 옷 정보 모달에 표시되는 상세 정보 */
  color: string;
  season: string;
  material: string;
  fit: string;
  careInfo: string;
  source: string;
  measurements: ClosetMeasurement[];
};

export const MOCK_WARDROBE_ITEMS: ClosetItem[] = [
  {
    id: "w-1",
    name: "와이셔츠",
    brand: "무신사 스탠다드",
    category: "top",
    swatch: "#f2f1ed",
    accent: "#c7c6c1",
    createdAt: "2026-07-03T09:10:00+09:00",
    color: "화이트",
    season: "봄 · 가을",
    material: "코튼 100%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "어깨", value: "44" },
      { label: "가슴", value: "54" },
      { label: "총장", value: "70" },
    ],
  },
  {
    id: "w-2",
    name: "청자켓",
    brand: "유니클로",
    category: "top",
    swatch: "#e4e9f2",
    accent: "#3f5a8a",
    createdAt: "2026-07-02T18:20:00+09:00",
    color: "블루",
    season: "가을 · 겨울",
    material: "코튼 98% · 폴리우레탄 2%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "직접 등록",
    measurements: [
      { label: "어깨", value: "47" },
      { label: "가슴", value: "56" },
      { label: "총장", value: "62" },
    ],
  },
  {
    id: "w-3",
    name: "후드티",
    brand: "H&M",
    category: "top",
    swatch: "#e6e9e2",
    accent: "#33472f",
    createdAt: "2026-07-02T11:05:00+09:00",
    color: "카키",
    season: "가을 · 겨울",
    material: "코튼 80% · 폴리에스터 20%",
    fit: "오버사이즈",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "어깨", value: "52" },
      { label: "가슴", value: "60" },
      { label: "총장", value: "68" },
    ],
  },
  {
    id: "w-4",
    name: "맨투맨",
    brand: "무신사 스탠다드",
    category: "top",
    swatch: "#ececec",
    accent: "#6b6b68",
    createdAt: "2026-07-01T20:40:00+09:00",
    color: "그레이",
    season: "봄 · 가을",
    material: "코튼 85% · 폴리에스터 15%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "어깨", value: "49" },
      { label: "가슴", value: "58" },
      { label: "총장", value: "66" },
    ],
  },
  {
    id: "w-5",
    name: "가디건",
    brand: "무신사 스탠다드",
    category: "top",
    swatch: "#f1e9de",
    accent: "#b0876a",
    createdAt: "2026-07-01T09:00:00+09:00",
    color: "캐멀",
    season: "가을 · 겨울",
    material: "울 40% · 아크릴 60%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "직접 등록",
    measurements: [
      { label: "어깨", value: "45" },
      { label: "가슴", value: "55" },
      { label: "총장", value: "64" },
    ],
  },
  {
    id: "w-6",
    name: "니트",
    brand: "자라",
    category: "top",
    swatch: "#f4ede1",
    accent: "#a8896a",
    createdAt: "2026-06-29T14:00:00+09:00",
    color: "베이지",
    season: "가을 · 겨울",
    material: "울 30% · 아크릴 70%",
    fit: "슬림",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "어깨", value: "43" },
      { label: "가슴", value: "52" },
      { label: "총장", value: "63" },
    ],
  },
  {
    id: "w-7",
    name: "반팔티",
    brand: "유니클로",
    category: "top",
    swatch: "#f2f1ed",
    accent: "#9a9a96",
    createdAt: "2026-06-28T10:00:00+09:00",
    color: "화이트",
    season: "여름",
    material: "코튼 100%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "어깨", value: "45" },
      { label: "가슴", value: "53" },
      { label: "총장", value: "68" },
    ],
  },
  {
    id: "w-8",
    name: "셔츠",
    brand: "COS",
    category: "top",
    swatch: "#e6eef2",
    accent: "#5c7f96",
    createdAt: "2026-06-27T10:00:00+09:00",
    color: "라이트 블루",
    season: "봄 · 여름",
    material: "코튼 100%",
    fit: "레귤러",
    careInfo: "세탁정보 더보기",
    source: "직접 등록",
    measurements: [
      { label: "어깨", value: "44" },
      { label: "가슴", value: "53" },
      { label: "총장", value: "71" },
    ],
  },
  {
    id: "w-9",
    name: "슬랙스",
    brand: "자라",
    category: "bottom",
    swatch: "#e9e7e3",
    accent: "#4a4844",
    createdAt: "2026-06-26T10:00:00+09:00",
    color: "차콜",
    season: "사계절",
    material: "폴리에스터 65% · 레이온 35%",
    fit: "테이퍼드",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "허리", value: "34" },
      { label: "허벅지", value: "28" },
      { label: "총장", value: "102" },
    ],
  },
  {
    id: "w-10",
    name: "청바지",
    brand: "리바이스",
    category: "bottom",
    swatch: "#e2e7f0",
    accent: "#33507a",
    createdAt: "2026-06-25T10:00:00+09:00",
    color: "인디고",
    season: "사계절",
    material: "코튼 99% · 폴리우레탄 1%",
    fit: "스트레이트",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "허리", value: "33" },
      { label: "허벅지", value: "29" },
      { label: "총장", value: "104" },
    ],
  },
  {
    id: "w-11",
    name: "조거팬츠",
    brand: "나이키",
    category: "bottom",
    swatch: "#eceae6",
    accent: "#2e2e33",
    createdAt: "2026-06-24T10:00:00+09:00",
    color: "블랙",
    season: "가을 · 겨울",
    material: "코튼 80% · 폴리에스터 20%",
    fit: "테이퍼드",
    careInfo: "세탁정보 더보기",
    source: "직접 등록",
    measurements: [
      { label: "허리", value: "35" },
      { label: "허벅지", value: "30" },
      { label: "총장", value: "98" },
    ],
  },
  {
    id: "w-12",
    name: "스니커즈",
    brand: "나이키",
    category: "shoes",
    swatch: "#f2f1ed",
    accent: "#c94f3f",
    createdAt: "2026-06-23T10:00:00+09:00",
    color: "화이트 · 레드",
    season: "사계절",
    material: "메시 · 합성 가죽",
    fit: "정사이즈",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "사이즈", value: "270" },
      { label: "밑창 높이", value: "3" },
    ],
  },
  {
    id: "w-13",
    name: "로퍼",
    brand: "탠토",
    category: "shoes",
    swatch: "#efe6da",
    accent: "#6b3f28",
    createdAt: "2026-06-22T10:00:00+09:00",
    color: "브라운",
    season: "봄 · 가을",
    material: "천연 가죽",
    fit: "정사이즈",
    careInfo: "세탁정보 더보기",
    source: "직접 등록",
    measurements: [
      { label: "사이즈", value: "265" },
      { label: "밑창 높이", value: "2" },
    ],
  },
  {
    id: "w-14",
    name: "볼캡",
    brand: "뉴에라",
    category: "hat",
    swatch: "#eceae6",
    accent: "#1a1a1a",
    createdAt: "2026-06-21T10:00:00+09:00",
    color: "블랙",
    season: "사계절",
    material: "코튼 100%",
    fit: "프리사이즈",
    careInfo: "세탁정보 더보기",
    source: "링크 등록",
    measurements: [
      { label: "둘레", value: "58" },
      { label: "챙 길이", value: "7" },
    ],
  },
];
