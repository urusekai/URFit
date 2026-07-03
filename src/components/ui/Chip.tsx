import { cn } from "@/lib/utils/cn";

type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 활성 상태 (필터 선택, 카테고리 선택 등) */
  selected?: boolean;
};

/** 필터·카테고리 토글, 태그 공통 스타일 */
export function Chip({ className, selected = false, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
        selected
          ? "bg-foreground text-white"
          : "border border-border bg-white text-foreground hover:bg-off-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
