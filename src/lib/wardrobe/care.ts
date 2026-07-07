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
  cotton: "코튼",
  wool: "울",
  leather: "가죽",
  denim: "데님",
  knit: "니트",
  flannel: "플란넬",
  linen: "리넨",
  polyester: "폴리에스터",
  synthetic: "합성 소재",
  코튼: "코튼",
  울: "울",
  가죽: "가죽",
  데님: "데님",
  니트: "니트",
  플란넬: "플란넬",
  리넨: "리넨",
  폴리에스터: "폴리에스터",
};

function parseMaterial(material: string): MaterialComposition[] {
  const normalized = material.trim();
  if (!normalized) {
    return [{ name: "정보 없음", percent: 100 }];
  }

  const parts = normalized
    .split(/·|\+|,/)
    .map((part) => part.trim())
    .filter(Boolean);

  const parsed = parts.length > 0 ? parts : [normalized];
  const even = Math.floor(100 / parsed.length);

  return parsed.map((part, index) => {
    const match = part.match(/^(.*?)\s*(\d+)%$/);
    if (match) {
      const name = match[1].trim();
      return {
        name: MATERIAL_NAME_MAP[name.toLowerCase()] ?? MATERIAL_NAME_MAP[name] ?? name,
        percent: Number(match[2]),
      };
    }

    return {
      name: MATERIAL_NAME_MAP[part.toLowerCase()] ?? MATERIAL_NAME_MAP[part] ?? part,
      percent: index === parsed.length - 1 ? 100 - even * (parsed.length - 1) : even,
    };
  });
}

export function getCareInfo(material: string, color: string): CareInfo {
  const composition = parseMaterial(material);
  const lowerMaterial = material.toLowerCase();
  const isLeather = lowerMaterial.includes("leather") || material.includes("가죽");
  const isWool = lowerMaterial.includes("wool") || material.includes("울");
  const isDelicate = isLeather || isWool;

  const careItems: CareItem[] = [
    {
      icon: "wash",
      title: "물세탁",
      description: isLeather ? "물세탁 불가" : isWool ? "찬물 손세탁 권장" : "40도 이하 세탁",
    },
    {
      icon: "bleach",
      title: "표백",
      description: isDelicate ? "표백 불가" : "산소계 표백 가능",
    },
    {
      icon: "dry",
      title: "건조",
      description: "그늘에서 자연 건조",
    },
    {
      icon: "iron",
      title: "다림질",
      description: isLeather ? "다림질 불가" : isWool ? "저온, 천을 대고 다림질" : "중온 다림질",
    },
    {
      icon: "dryClean",
      title: "드라이클리닝",
      description: isDelicate ? "드라이클리닝 권장" : "필요 시 가능",
    },
    {
      icon: "wring",
      title: "탈수",
      description: isDelicate ? "강한 탈수 금지" : "약하게 탈수",
    },
  ];

  const tips = [
    color.includes("화이트") || color.toLowerCase().includes("white")
      ? "밝은 색 의류와 분리해서 세탁하면 이염을 줄일 수 있어요."
      : "짙은 색 의류는 뒤집어서 세탁하면 색 빠짐을 줄일 수 있어요.",
    "목 부분과 소매 끝은 세탁 전 부분 세탁을 먼저 해주세요.",
  ];

  if (isDelicate) {
    tips.push("소재 손상을 줄이려면 전문 케어를 권장해요.");
  }

  return { composition, careItems, tips };
}
