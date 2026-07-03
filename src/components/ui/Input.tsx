import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** 좌측 아이콘 (검색 등) */
  icon?: ReactNode;
};

/** 검색 등 텍스트 입력 공통 스타일 (배경 #F6F5F2, rounded-xl) */
export function Input({ className, icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </span>
      ) : null}
      <input
        className={cn(
          "w-full rounded-xl bg-off-white py-3.5 pr-4 text-base text-foreground outline-none transition placeholder:text-muted focus:ring-2 focus:ring-accent/40",
          icon ? "pl-11" : "pl-4",
          className,
        )}
        {...props}
      />
    </div>
  );
}
