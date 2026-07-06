/**
 * TODO(AI 소재 인식): 실제로는 라벨 사진 OCR/AI로 세탁 정보를 추출할 예정입니다.
 * 지금은 등록된 소재 문자열을 간단히 파싱해 그럴듯한 세탁 케어 정보를 만들어내는 목업입니다.
 */

export type CareIconType = "wash" | "bleach" | "dry" | "iron" | "dryClean" | "wring";

export type CareItem = {
  icon: CareIconType;
  title: string;
  description: string;
};

export type MaterialComposition = {
  name: string;
  percent: number;
};

export type CareInfo = {
  composition: MaterialComposition[];
  careItems: CareItem[];
  tips: string[];
};

const MATERIAL_NAME_MAP: Record<string, string> = {
  코튼: "면",
  폴리에스터: "폴리에스터",
  폴리우레탄: "폴리우레탄",
  울: "울",
  아크릴: "아크릴",
  레이온: "레이온",
  "천연 가죽": "가죽",
  "합성 가죽": "인조가죽",
  메시: "메시",
};

function parseMaterial(material: string): MaterialComposition[] {
  const parts = material
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return [{ name: "정보 없음", percent: 100 }];

  const parsed = parts.map((part) => {
    const match = part.match(/^(.*?)\s*(\d+)%$/);
    if (match) {
      return { name: match[1].trim(), percent: Number(match[2]) };
    }
    return { name: part, percent: 0 };
  });

  const hasPercent = parsed.some((item) => item.percent > 0);
  if (hasPercent) {
    return parsed.map((item) => ({
      name: MATERIAL_NAME_MAP[item.name] ?? item.name,
      percent: item.percent,
    }));
  }

  const even = Math.floor(100 / parsed.length);
  return parsed.map((item, index) => ({
    name: MATERIAL_NAME_MAP[item.name] ?? item.name,
    percent: index === parsed.length - 1 ? 100 - even * (parsed.length - 1) : even,
  }));
}

export function getCareInfo(material: string, color: string): CareInfo {
  const composition = parseMaterial(material);
  const isLeather = /가죽/.test(material);
  const isWool = /울/.test(material);
  const isDelicate = isLeather || isWool;

  const careItems: CareItem[] = [
    {
      icon: "wash",
      title: "물세탁",
      description: isLeather ? "물세탁 불가" : isWool ? "찬물 · 손세탁 권장" : "40°C 이하 세탁기 약",
    },
    {
      icon: "bleach",
      title: "표백",
      description: isDelicate ? "표백 불가" : "산소계 표백 가능",
    },
    {
      icon: "dry",
      title: "건조",
      description: "옷걸이에 걸어서 건조",
    },
    {
      icon: "iron",
      title: "다림질",
      description: isLeather ? "다림질 불가" : isWool ? "저온 · 헝겊 덧대기" : "고온 · 200°C 이하",
    },
    {
      icon: "dryClean",
      title: "드라이클리닝",
      description: isDelicate ? "드라이클리닝 권장" : "드라이클리닝 가능",
    },
    {
      icon: "wring",
      title: "탈수",
      description: isDelicate ? "짜지 않기" : "약하게 · 짜지 않기",
    },
  ];

  const tips = [
    color.includes("화이트") || color.includes("white")
      ? "흰옷은 색이 있는 옷과 분리하여 세탁해주세요."
      : "짙은 색상은 뒤집어서 세탁하면 탈색을 줄일 수 있어요.",
    "목 부분과 소매깃은 세탁 전 부분세제로 문질러 주세요.",
  ];
  if (isDelicate) {
    tips.push("소재 손상을 막기 위해 전문 세탁소 이용을 권장해요.");
  }

  return { composition, careItems, tips };
}
