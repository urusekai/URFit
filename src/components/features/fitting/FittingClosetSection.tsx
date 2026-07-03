/* eslint-disable @next/next/no-img-element */

import { Chip } from "@/components/ui/Chip";
import type {
  FittingCategory,
  FittingItem,
  SelectedFittingItems,
} from "@/components/features/fitting/FittingExperience";

const CLOSET_TITLE = "\uc637\ubaa9\ub85d";
const CLOSET_SWIPER_LABEL = "\uc637 \ubaa9\ub85d \uc2a4\uc640\uc774\ud37c";
const NOTE_TEXT = "\uc774\ubbf8\uc9c0 \uc0dd\uc131 \ud6c4 \ubc84\ud2bc\uc774 \ub8e9\uc800\uc7a5\uc73c\ub85c \ubc14\ub00c\uc5b4\uc694.";
const SELECT_LABEL = "\uc120\ud0dd";

const categoryItems = [
  { category: "top", label: "\uc0c1\uc758" },
  { category: "bottom", label: "\ud558\uc758" },
  { category: "shoes", label: "\uc2e0\ubc1c" },
  { category: "hat", label: "\ubaa8\uc790" },
] as const satisfies Array<{ category: FittingCategory; label: string }>;

function ProductGlyph({
  shape,
  colorClass,
}: {
  shape: FittingItem["shape"];
  colorClass: string;
}) {
  if (shape === "shirt") {
    return (
      <div className={`relative h-14 w-11 ${colorClass}`}>
        <div className="absolute inset-x-1 top-2 h-11 rounded-b-[10px]" />
        <div className="absolute left-0 top-1 h-4 w-4 rounded-tl-[8px] rounded-br-[8px] bg-inherit" />
        <div className="absolute right-0 top-1 h-4 w-4 rounded-tr-[8px] rounded-bl-[8px] bg-inherit" />
      </div>
    );
  }

  if (shape === "jacket") {
    return (
      <div className={`relative h-14 w-11 ${colorClass}`}>
        <div className="absolute inset-x-1 top-2 h-11 rounded-b-[10px]" />
        <div className="absolute left-0 top-1 h-4 w-4 rounded-tl-[8px] rounded-br-[8px] bg-inherit" />
        <div className="absolute right-0 top-1 h-4 w-4 rounded-tr-[8px] rounded-bl-[8px] bg-inherit" />
        <div className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2 bg-white/50" />
      </div>
    );
  }

  if (shape === "hoodie") {
    return (
      <div className={`relative h-14 w-11 ${colorClass}`}>
        <div className="absolute inset-x-1 top-3 h-10 rounded-b-[12px]" />
        <div className="absolute left-1/2 top-0 h-6 w-7 -translate-x-1/2 rounded-t-full bg-inherit" />
        <div className="absolute left-1/2 top-5 h-3 w-[2px] -translate-x-[5px] bg-white/60" />
        <div className="absolute left-1/2 top-5 h-3 w-[2px] translate-x-[3px] bg-white/60" />
      </div>
    );
  }

  if (shape === "pants") {
    return (
      <div className={`relative h-14 w-11 ${colorClass}`}>
        <div className="absolute left-[7px] top-1 h-12 w-[14px] rounded-b-[8px] bg-inherit" />
        <div className="absolute right-[7px] top-1 h-12 w-[14px] rounded-b-[8px] bg-inherit" />
        <div className="absolute left-1/2 top-1 h-5 w-8 -translate-x-1/2 rounded-t-[7px] bg-inherit" />
      </div>
    );
  }

  if (shape === "shoes") {
    return (
      <div className="relative h-14 w-14">
        <div className={`absolute bottom-4 left-1 h-5 w-11 rounded-full border border-[#d8d8d8] ${colorClass}`} />
        <div className={`absolute bottom-2 right-1 h-5 w-11 rounded-full border border-[#d8d8d8] ${colorClass}`} />
      </div>
    );
  }

  if (shape === "cap") {
    return (
      <div className={`relative h-14 w-14 ${colorClass}`}>
        <div className="absolute left-1/2 top-4 h-7 w-10 -translate-x-1/2 rounded-t-full bg-inherit" />
        <div className="absolute left-1/2 top-8 h-2 w-12 -translate-x-1/2 rounded-full bg-inherit" />
      </div>
    );
  }

  return (
    <div className={`relative h-14 w-11 ${colorClass} rounded-b-[8px] rounded-t-[12px]`}>
      <div className="absolute left-1/2 top-2 h-[2px] w-6 -translate-x-1/2 bg-[#8d8d8d]" />
      <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#bdbdbd]" />
    </div>
  );
}

type FittingClosetSectionProps = {
  activeCategory: FittingCategory;
  items: FittingItem[];
  selectedItems: SelectedFittingItems;
  onSelectCategory: (category: FittingCategory) => void;
  onSelectItem: (item: FittingItem) => void;
};

export function FittingClosetSection({
  activeCategory,
  items,
  selectedItems,
  onSelectCategory,
  onSelectItem,
}: FittingClosetSectionProps) {
  const visibleItems = items.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-30 h-[300px] w-full max-w-md -translate-x-1/2 rounded-t-[30px] bg-white px-5 pt-3">
        <div className="mx-auto h-1.5 w-[72px] rounded-full bg-surface-muted" />

        <div className="mt-4 flex items-center justify-between gap-3">
          <h2 className="shrink-0 text-[18px] font-extrabold text-foreground">
            {CLOSET_TITLE}
          </h2>
          <div className="flex min-w-0 items-center gap-2">
            {categoryItems.map((item) => (
              <Chip
                key={item.category}
                selected={activeCategory === item.category}
                onClick={() => onSelectCategory(item.category)}
                className={[
                  "h-[25px] min-w-[47px] border-transparent px-3 py-0 text-[13px] font-semibold",
                  activeCategory === item.category
                    ? "bg-[#202124] text-white"
                    : "bg-[#eff0ec] text-[#73736f] hover:bg-[#e6e7e2]",
                ].join(" ")}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </div>

        <div
          aria-label={CLOSET_SWIPER_LABEL}
          className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleItems.map((item) => {
            const isSelected = selectedItems[item.category]?.id === item.id;

            return (
              <div
                key={item.id}
                className="w-[calc((100%_-_36px)/4)] shrink-0"
              >
                <button
                  type="button"
                  aria-label={`${item.name} ${SELECT_LABEL}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectItem(item)}
                  className="block w-full cursor-pointer"
                >
                  <div
                    className={[
                      "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] border bg-white",
                      isSelected ? "border-[#b0876a] ring-2 ring-[#b0876a]/25" : "border-[#eff0ec]",
                    ].join(" ")}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="aspect-square h-full w-full object-contain p-2"
                        draggable={false}
                      />
                    ) : (
                      <ProductGlyph shape={item.shape} colorClass={item.colorClass} />
                    )}
                    <span
                      className={[
                        "absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-full border text-[11px] font-bold",
                        isSelected
                          ? "border-[#b0876a] bg-[#b0876a] text-white"
                          : "border-[#d8c4b2] bg-white text-[#b0876a]",
                      ].join(" ")}
                    >
                      {isSelected ? "\u2713" : "+"}
                    </span>
                  </div>
                </button>
                <p className="mt-2 h-[16px] truncate px-1 text-center text-[11px] font-semibold leading-[16px] text-foreground">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <p className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+16px)] left-1/2 z-50 w-full max-w-md -translate-x-1/2 text-center text-[11px] font-semibold leading-[16px] text-muted">
        {NOTE_TEXT}
      </p>
    </>
  );
}
