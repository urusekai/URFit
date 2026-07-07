/**
 * 옷 등록 폼(온보딩 3단계 · 옷장 "옷 등록하기")이 공유하는 카테고리별 설정.
 * 카테고리를 바꾸면 핏·사이즈 선택지와 치수 항목이 이 설정을 따른다.
 * 두 화면이 같은 소스를 쓰도록 여기 한 곳에서 정의한다.
 */

export type MeasureDef = { key: string; label: string; default: string };
export type CategoryConfig = {
  fitOptions: string[];
  sizeOptions: string[];
  measures: MeasureDef[];
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  상의: {
    fitOptions: ["레귤러", "슬림", "루즈", "오버핏"],
    sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
    measures: [
      { key: "shoulder", label: "어깨", default: "44" },
      { key: "chest", label: "가슴", default: "54" },
      { key: "length", label: "총장", default: "70" },
    ],
  },
  아우터: {
    fitOptions: ["레귤러", "슬림", "루즈", "오버핏"],
    sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
    measures: [
      { key: "shoulder", label: "어깨", default: "46" },
      { key: "chest", label: "가슴", default: "58" },
      { key: "length", label: "총장", default: "74" },
    ],
  },
  하의: {
    fitOptions: ["레귤러", "슬림", "와이드", "부츠컷"],
    sizeOptions: ["S", "M", "L", "XL", "28", "30", "32", "34"],
    measures: [
      { key: "waist", label: "허리", default: "78" },
      { key: "hip", label: "엉덩이", default: "98" },
      { key: "length", label: "총장", default: "100" },
    ],
  },
  신발: {
    fitOptions: ["정사이즈", "크게 나옴", "작게 나옴"],
    sizeOptions: ["230", "240", "250", "260", "270", "280"],
    measures: [
      { key: "footLength", label: "발길이", default: "260" },
      { key: "footWidth", label: "발볼", default: "100" },
    ],
  },
  모자: {
    fitOptions: ["프리", "조절"],
    sizeOptions: ["FREE", "55", "57", "59", "61"],
    measures: [
      { key: "head", label: "머리둘레", default: "58" },
      { key: "brim", label: "챙길이", default: "7" },
    ],
  },
};

export const CATEGORY_OPTIONS = Object.keys(CATEGORY_CONFIG);

/** 카테고리 설정으로 치수 상태 초깃값(항목 key→기본값)을 만든다. */
export function defaultMeasures(category: string): Record<string, string> {
  return Object.fromEntries(
    CATEGORY_CONFIG[category].measures.map((m) => [m.key, m.default]),
  );
}
