import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

/** 인증·온보딩 등 풀스크린 플로우 — 하단 탭 없음 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      {children}
    </div>
  );
}
