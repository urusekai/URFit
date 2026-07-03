import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type HeaderIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
};

/** 헤더 우측 아이콘 버튼 — 페이지마다 PageHeader의 actions로 전달 */
export function HeaderIconButton({
  children,
  label,
  className,
  ...props
}: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl bg-off-white text-charcoal transition hover:bg-surface-muted",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
