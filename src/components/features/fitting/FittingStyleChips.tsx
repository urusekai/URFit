import type { StyleTag } from "@/types/fitting";

export const STYLE_OPTIONS: StyleTag[] = ["캐주얼", "스트릿", "미니멀", "댄디"];

type FittingStyleChipsProps = {
  selected: StyleTag;
  disabled?: boolean;
  onSelect: (style: StyleTag) => void;
};

export function FittingStyleChips({
  selected,
  disabled = false,
  onSelect,
}: FittingStyleChipsProps) {
  return (
    <div
      role="radiogroup"
      aria-label="AI 추천 스타일"
      className="flex items-center justify-center gap-2 px-1 pb-3"
    >
      {STYLE_OPTIONS.map((style) => {
        const isSelected = selected === style;

        return (
          <button
            key={style}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(style)}
            className={[
              "h-[30px] cursor-pointer rounded-full px-4 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
              isSelected
                ? "bg-[#202124] text-white"
                : "bg-[#eff0ec] text-[#73736f] hover:bg-[#e6e7e2]",
            ].join(" ")}
          >
            {style}
          </button>
        );
      })}
    </div>
  );
}
