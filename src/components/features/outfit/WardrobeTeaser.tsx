import Link from "next/link";
import { ClosetItemIcon } from "@/components/features/wardrobe/ClosetItemIcon";
import { ROUTES } from "@/constants/app";
import type { ClosetItem } from "@/lib/wardrobe/catalog";

const MIN_ITEMS_REQUIRED = 3;

export function WardrobeTeaser({ items }: { items: ClosetItem[] }) {
  const isEmpty = items.length < MIN_ITEMS_REQUIRED;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-foreground">나만의 옷장</h2>

      {isEmpty ? (
        <Link
          href={ROUTES.closet}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-10 text-center text-white transition hover:opacity-95"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-white/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 4.5 8.5 7H6.5v12h11V7h-2L12 4.5Z"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M15 9.5v2M9 9.5v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold">옷장을 채워볼까요?</p>
            <p className="mt-1 text-xs text-white/80">
              (최소 {MIN_ITEMS_REQUIRED}개 등록 필요)
            </p>
          </div>
        </Link>
      ) : (
        <Link
          href={ROUTES.closet}
          className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white px-4 py-3.5 transition hover:bg-off-white/60"
        >
          <div className="flex -space-x-2">
            {items.slice(0, 4).map((item) => (
              <span
                key={item.id}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 bg-white"
                style={{ borderColor: item.swatch }}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-contain p-1"
                    aria-hidden
                  />
                ) : (
                  <span className="scale-50">
                    <ClosetItemIcon category={item.category} color={item.accent} />
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              등록된 옷 {items.length}개
            </p>
            <p className="text-xs text-muted">옷장 전체보기</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m9 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </section>
  );
}
