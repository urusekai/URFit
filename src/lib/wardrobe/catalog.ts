import type { Cloth, ClothCategory, Season } from "@/types/fitting";

export type ClosetCategory = "top" | "outer" | "bottom" | "shoes" | "hat";

export const CLOSET_CATEGORIES: { value: ClosetCategory; label: string }[] = [
  { value: "top", label: "상의" },
  { value: "outer", label: "아우터" },
  { value: "bottom", label: "하의" },
  { value: "shoes", label: "신발" },
  { value: "hat", label: "모자" },
];

export const CLOSET_CATEGORY_LABEL: Record<ClosetCategory, string> = {
  top: "상의",
  outer: "아우터",
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
  swatch: string;
  accent: string;
  createdAt: string;
  color: string;
  season: string;
  material: string;
  fit: string;
  careInfo: string;
  source: string;
  imageUrl?: string;
  measurements: ClosetMeasurement[];
};

const CATEGORY_TO_CLOSET: Record<ClothCategory, ClosetCategory> = {
  top: "top",
  outer: "outer",
  bottom: "bottom",
  shoes: "shoes",
  hat: "hat",
};

const COLOR_THEME: Record<string, { swatch: string; accent: string; label: string }> = {
  black: { swatch: "#eceae6", accent: "#1f1f1f", label: "블랙" },
  blue: { swatch: "#e2e8f3", accent: "#33507a", label: "블루" },
  navy: { swatch: "#e4e8f1", accent: "#26395f", label: "네이비" },
  red: { swatch: "#f3e4e1", accent: "#a6423a", label: "레드" },
  white: { swatch: "#f5f4ef", accent: "#b8b6ae", label: "화이트" },
  beige: { swatch: "#f1e9de", accent: "#b0876a", label: "베이지" },
  brown: { swatch: "#efe6da", accent: "#6b3f28", label: "브라운" },
  grey: { swatch: "#ececec", accent: "#6b6b68", label: "그레이" },
  gray: { swatch: "#ececec", accent: "#6b6b68", label: "그레이" },
  charcoal: { swatch: "#e5e5e2", accent: "#4a4844", label: "차콜" },
  khaki: { swatch: "#e6e9e2", accent: "#33472f", label: "카키" },
  cream: { swatch: "#f4ede1", accent: "#a8896a", label: "크림" },
  oatmeal: { swatch: "#f0e7dc", accent: "#9a7b62", label: "오트밀" },
  "dark green": { swatch: "#e3e8e0", accent: "#26452d", label: "다크 그린" },
  "light blue": { swatch: "#e6eef2", accent: "#5c7f96", label: "라이트 블루" },
};

const SEASON_LABEL: Record<Season, string> = {
  spring: "봄",
  summer: "여름",
  fall: "가을",
  winter: "겨울",
  all: "사계절",
};

const MATERIAL_LABEL: Record<string, string> = {
  cotton: "코튼",
  wool: "울",
  leather: "가죽",
  denim: "데님",
  knit: "니트",
  flannel: "플란넬",
  linen: "리넨",
  polyester: "폴리에스터",
  synthetic: "합성 소재",
};

const FIT_LABEL: Record<Cloth["formality"], string> = {
  casual: "캐주얼",
  "smart-casual": "스마트 캐주얼",
  formal: "포멀",
};

const DEFAULT_MEASUREMENTS: Record<ClosetCategory, ClosetMeasurement[]> = {
  top: [
    { label: "어깨", value: "-" },
    { label: "가슴", value: "-" },
    { label: "총장", value: "-" },
  ],
  outer: [
    { label: "어깨", value: "-" },
    { label: "가슴", value: "-" },
    { label: "총장", value: "-" },
  ],
  bottom: [
    { label: "허리", value: "-" },
    { label: "밑위", value: "-" },
    { label: "총장", value: "-" },
  ],
  shoes: [
    { label: "사이즈", value: "-" },
    { label: "굽", value: "-" },
  ],
  hat: [
    { label: "둘레", value: "-" },
    { label: "챙", value: "-" },
  ],
};

function getColorTheme(color: string) {
  return COLOR_THEME[color.toLowerCase()] ?? {
    swatch: "#f2f1ed",
    accent: "#6b6b68",
    label: color || "미상",
  };
}

function formatSeasons(seasons: Season[]) {
  if (seasons.includes("all")) {
    return SEASON_LABEL.all;
  }

  return seasons.map((season) => SEASON_LABEL[season]).join(" · ");
}

function formatMaterial(material: string) {
  return MATERIAL_LABEL[material.toLowerCase()] ?? (material || "미상");
}

export function toClosetItem(cloth: Cloth, index: number): ClosetItem {
  const category = CATEGORY_TO_CLOSET[cloth.category];
  const colorTheme = getColorTheme(cloth.color);

  return {
    id: cloth.id,
    name: cloth.name,
    brand: "URFit Beta",
    category,
    swatch: colorTheme.swatch,
    accent: colorTheme.accent,
    createdAt: new Date(Date.UTC(2026, 6, 1, 0, index)).toISOString(),
    color: colorTheme.label,
    season: formatSeasons(cloth.seasons),
    material: formatMaterial(cloth.material),
    fit: FIT_LABEL[cloth.formality],
    careInfo: "의류 케어 보기",
    source: "피팅 옷 목록",
    imageUrl: cloth.imageUrl,
    measurements: DEFAULT_MEASUREMENTS[category],
  };
}

export function toClosetItems(clothes: Cloth[]): ClosetItem[] {
  return clothes.map(toClosetItem);
}
