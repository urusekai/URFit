import { FittingSidePanel } from "@/components/features/fitting/FittingSidePanel";
import type {
  FittingCategory,
  SelectedFittingItems,
} from "@/components/features/fitting/FittingExperience";

const AI_RECOMMEND_LABEL = "AI \ucd94\ucc9c";
const CLOSET_LABEL = "\ub0b4 \uc637\uc7a5";

type FittingStageProps = {
  activeCategory: FittingCategory;
  generated: boolean;
  loading?: boolean;
  personImageUrl?: string;
  fittingImage?: string | null;
  closetItems: SelectedFittingItems;
  recommendedItems: SelectedFittingItems;
  onSelectCategory: (category: FittingCategory) => void;
};

export function FittingStage({
  activeCategory,
  generated,
  loading = false,
  personImageUrl,
  fittingImage,
  closetItems,
  recommendedItems,
  onSelectCategory,
}: FittingStageProps) {
  // 생성 결과가 있으면 결과 이미지를, 없으면 기본 전신 사진을 표시
  const displayImageUrl = fittingImage ?? personImageUrl;
  return (
    <section className="px-0 pb-3">
      <div className="px-0">
        <div className="flex items-start justify-between gap-3">
          <FittingSidePanel
            activeCategory={activeCategory}
            title={AI_RECOMMEND_LABEL}
            selectedItems={recommendedItems}
            align="left"
            highlightActive={false}
            onSelectCategory={onSelectCategory}
          />

          <div className="relative flex-1">
            <div className="mx-auto w-full max-w-[236px]">
              <div
                className={[
                  // 박스 배경은 페이지와 동일한 크림(#f6f5f2). 합성 결과도 같은 크림 배경으로
                  // 생성되도록 프롬프트에서 강제하여 이질감을 없앤다.
                  "relative h-[448px] overflow-hidden rounded-[18px] border border-[#ebe9e3] bg-[#f6f5f2] transition",
                  generated ? "ring-2 ring-accent/50" : "",
                ].join(" ")}
              >
                {displayImageUrl ? (
                  // Signed Supabase URLs / base64 data URLs are scoped to this page,
                  // so avoid global image config changes.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayImageUrl}
                    alt=""
                    className="absolute inset-x-0 bottom-0 z-10 mx-auto h-full w-full scale-[1.08] object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0">
                    <div className="absolute left-1/2 top-6 h-[54px] w-[54px] -translate-x-1/2 rounded-full bg-[#efdccf]" />
                    <div className="absolute left-1/2 top-[82px] h-[158px] w-[86px] -translate-x-1/2 rounded-[999px] bg-[#ece8ef]" />
                    <div className="absolute left-[44px] top-[96px] h-[118px] w-[24px] rounded-full bg-[#f2ede8]" />
                    <div className="absolute right-[44px] top-[96px] h-[118px] w-[24px] rounded-full bg-[#f2ede8]" />
                    <div className="absolute left-[76px] top-[248px] h-[82px] w-[26px] rounded-full bg-[#ebe6f0]" />
                    <div className="absolute right-[76px] top-[248px] h-[82px] w-[26px] rounded-full bg-[#ebe6f0]" />
                  </div>
                )}
                {loading ? (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm">
                    <span className="size-8 animate-spin rounded-full border-[3px] border-[#d8c4b2] border-t-[#b0876a]" />
                    <span className="text-[13px] font-semibold text-[#8a6a52]">
                      이미지 생성 중…
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <FittingSidePanel
            activeCategory={activeCategory}
            title={CLOSET_LABEL}
            selectedItems={closetItems}
            align="right"
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </section>
  );
}
