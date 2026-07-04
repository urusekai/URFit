/* eslint-disable @next/next/no-img-element */

import type {
  FittingCategory,
  SelectedFittingItems,
} from "@/components/features/fitting/FittingExperience";

const TOP_LABEL = "\uc0c1\uc758";
const BOTTOM_LABEL = "\ud558\uc758";
const SHOES_LABEL = "\uc2e0\ubc1c";
const HAT_LABEL = "\ubaa8\uc790";
const ADD_LABEL = "+";
const ITEM_IMAGE_CLASS = "mb-0.5 size-11 object-contain";
const ITEM_FALLBACK_CLASS = "mb-0.5 size-11 rounded-[9px]";

type FittingSidePanelProps = {
  activeCategory: FittingCategory;
  title: string;
  selectedItems: SelectedFittingItems;
  align?: "left" | "right";
  highlightActive?: boolean;
  onSelectCategory: (category: FittingCategory) => void;
};

type SidePanelItem = {
  category: FittingCategory;
  label: string;
  isExtraAddSlot?: boolean;
};

const itemLabels: SidePanelItem[] = [
  { category: "top", label: TOP_LABEL },
  { category: "bottom", label: BOTTOM_LABEL },
  { category: "shoes", label: SHOES_LABEL },
  { category: "hat", label: HAT_LABEL },
];
const FILLED_ITEM_STYLE = "border-white bg-white text-[#b0876a]";
const ADD_ITEM_STYLE = "border-[#cfb193] border-dashed bg-white text-[#b0876a]";

export function FittingSidePanel({
  activeCategory,
  title,
  selectedItems,
  align = "left",
  highlightActive = true,
  onSelectCategory,
}: FittingSidePanelProps) {
  const hasHat = Boolean(selectedItems.hat);
  const panelItems: SidePanelItem[] = hasHat
    ? [...itemLabels, { category: "hat", label: ADD_LABEL, isExtraAddSlot: true }]
    : itemLabels;

  return (
    <div className={`flex w-[68px] shrink-0 flex-col ${align === "right" ? "items-end" : "items-start"}`}>
      <p className="min-h-6 w-full text-center text-[14px] font-semibold leading-5 text-muted">{title}</p>
      <div className="mt-2 flex w-full flex-col gap-[22px]">
        {panelItems.map((item) => {
          const selectedItem = item.isExtraAddSlot ? null : selectedItems[item.category];
          const isActive = activeCategory === item.category && !item.isExtraAddSlot;
          const isEmptyHatSlot = item.category === "hat" && !selectedItem;
          const isAddSlot = item.isExtraAddSlot || isEmptyHatSlot;
          const label = isAddSlot ? ADD_LABEL : item.label;

          return (
            <button
              key={item.isExtraAddSlot ? "hat-add" : item.category}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectCategory(item.category)}
              className={[
                "flex h-[68px] w-[68px] cursor-pointer flex-col items-center rounded-[12px] border text-[10px] font-semibold",
                isAddSlot ? "justify-center pb-0" : "justify-end pb-2",
                isAddSlot ? ADD_ITEM_STYLE : FILLED_ITEM_STYLE,
                isActive && highlightActive ? "ring-2 ring-[#b0876a]" : "",
              ].join(" ")}
            >
              <span className={isAddSlot ? "" : "flex translate-y-1.5 flex-col items-center"}>
                {selectedItem?.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className={ITEM_IMAGE_CLASS}
                    draggable={false}
                  />
                ) : selectedItem ? (
                  <span className={`${ITEM_FALLBACK_CLASS} ${selectedItem.colorClass}`} />
                ) : null}
                <span className={isAddSlot ? "text-[34px] font-light leading-none" : ""}>
                  {label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
