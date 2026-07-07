import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

type TabShellProps = {
  children: ReactNode;
};

/**
 * 메인 앱(탭) 레이아웃 — 본문 + 하단 5탭.
 * 헤더는 공통 제공하지 않고, 각 page.tsx가 맨 위에서 `<PageHeader />`를 직접 렌더링합니다.
 */
export function TabShell({ children }: TabShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      <main className="flex flex-1 flex-col overflow-y-auto px-4 pb-32">{children}</main>
      <BottomTabBar />
    </div>
  );
}
