"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TAB_ITEMS } from "@/constants/app";
import { cn } from "@/lib/utils/cn";
import { TabIcon } from "./TabIcon";

function isTabActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-tab-bar fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 bg-white"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 메뉴"
    >
      <ul className="grid h-20 grid-cols-5 items-end px-1 pb-2">
        {TAB_ITEMS.map((item) => {
          const isActive = isTabActive(pathname, item.href);
          const isCenter = item.variant === "center";

          if (isCenter) {
            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className="bottom-tab-bar__item flex -translate-y-5 flex-col items-center gap-1"
                  aria-current={isActive ? "page" : undefined}
                >
                  <TabIcon name={item.href} variant="center" active={isActive} />
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isActive ? "text-accent" : "text-muted",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "bottom-tab-bar__item flex h-full flex-col items-center justify-end gap-1 pb-1 text-xs font-medium transition",
                  isActive ? "font-semibold text-accent" : "text-muted hover:text-charcoal",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <TabIcon name={item.href} active={isActive} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
