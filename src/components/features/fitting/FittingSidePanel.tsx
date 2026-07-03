/* eslint-disable @next/next/no-img-element */

import type {
  FittingCategory,
  SelectedFittingItems,
} from "@/components/features/fitting/FittingExperience";

const TOP_LABEL = "\uc0c1\uc758";
const BOTTOM_LABEL = "\ud558\uc758";
const SHOES_LABEL = "\uc2e0\ubc1c";
const ADD_LABEL = "+";

type FittingSidePanelProps = {
  activeCategory: FittingCategory;
  title: string;
  selectedItems: SelectedFittingItems;
  align?: "left" | "right";
  onSelectCategory: (category: FittingCategory) => void;
};

const itemLabels: Array<{ category: FittingCategory; label: string }> = [
  { category: "top", label: TOP_LABEL },
  { category: "bottom", label: BOTTOM_LABEL },
  { category: "shoes", label: SHOES_LABEL },
  { category: "hat", label: ADD_LABEL },
];
const itemStyles = [
  "border-white bg-white text-[#b0876a]",
  "border-white bg-white text-[#b0876a]",
  "border-white bg-white text-[#b0876a]",
  "border-[#cfb193] border-dashed bg-white text-[#b0876a]",
];

export function FittingSidePanel({
  activeCategory,
  title,
  selectedItems,
  align = "left",
  onSelectCategory,
}: FittingSidePanelProps) {
  return (
    <div className={`flex w-[61px] shrink-0 flex-col ${align === "right" ? "items-end" : "items-start"}`}>
      <p className="min-h-6 w-full text-center text-[13px] font-semibold leading-5 text-muted">{title}</p>
      <div className="mt-2 flex w-full flex-col gap-[22px]">
        {itemLabels.map((item, index) => {
          const selectedItem = selectedItems[item.category];
          const isActive = activeCategory === item.category;

          return (
            <button
              key={item.category}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectCategory(item.category)}
              className={[
                "flex aspect-square w-full cursor-pointer flex-col items-center justify-end rounded-[10px] border pb-2 text-[8px] font-semibold shadow-[0_8px_16px_rgba(26,26,26,0.05)]",
                itemStyles[index],
                isActive ? "ring-2 ring-[#b0876a]" : "",
              ].join(" ")}
            >
              {selectedItem?.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="mb-1 size-7 object-contain"
                  draggable={false}
                />
              ) : selectedItem ? (
                <span className={`mb-1 size-7 rounded-[6px] ${selectedItem.colorClass}`} />
              ) : null}
              <span className={index === itemLabels.length - 1 ? "text-[32px] font-light leading-none" : ""}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
