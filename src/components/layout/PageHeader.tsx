import Image from "next/image";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** 페이지마다 다른 우측 버튼 (검색, 메뉴 등). 생략하면 표시 안 함. */
  actions?: ReactNode;
};

/** 로고 + 페이지 제목 + 우측 버튼. 각 page.tsx 맨 위에서 직접 렌더링합니다. */
export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 -mx-4 flex h-16 shrink-0 items-center justify-between gap-3 bg-white px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Image
          src="/images/brand/logo.svg"
          alt=""
          width={38}
          height={38}
          className="size-[38px] shrink-0 rounded-[11px]"
          aria-hidden
          priority
        />
        <h1 className="truncate text-lg font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2.5">{actions}</div> : null}
    </header>
  );
}
