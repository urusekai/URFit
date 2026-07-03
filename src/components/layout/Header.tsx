import Link from "next/link";
import { APP_NAME, ROUTES } from "@/constants/app";

const navItems = [
  { href: ROUTES.home, label: "홈" },
  { href: ROUTES.wardrobe, label: "옷장" },
  { href: ROUTES.outfit, label: "코디" },
];

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={ROUTES.home} className="text-lg font-semibold tracking-tight">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-zinc-950 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
