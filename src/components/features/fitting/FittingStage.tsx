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
  personImageUrl?: string;
  selectedItems: SelectedFittingItems;
  onSelectCategory: (category: FittingCategory) => void;
};

export function FittingStage({
  activeCategory,
  generated,
  personImageUrl,
  selectedItems: _selectedItems,
  onSelectCategory,
}: FittingStageProps) {
  return (
    <section className="px-0 pb-3">
      <div className="px-0">
        <div className="flex items-start justify-between gap-3">
          <FittingSidePanel
            activeCategory={activeCategory}
            title={AI_RECOMMEND_LABEL}
            selectedItems={_selectedItems}
            align="left"
            onSelectCategory={onSelectCategory}
          />

          <div className="relative flex-1">
            <div className="mx-auto w-full max-w-[236px]">
              <div
                className={[
                  "relative h-[410px] overflow-hidden rounded-[18px] border border-[#e4e4e4] bg-white transition",
                  generated ? "ring-2 ring-accent/50" : "",
                ].join(" ")}
              >
                {personImageUrl ? (
                  // Signed Supabase URLs are scoped to this page, so avoid global image config changes.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={personImageUrl}
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
              </div>
            </div>
          </div>

          <FittingSidePanel
            activeCategory={activeCategory}
            title={CLOSET_LABEL}
            selectedItems={_selectedItems}
            align="right"
            onSelectCategory={onSelectCategory}
          />
        </div>
      </div>
    </section>
  );
}
