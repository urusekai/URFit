import Link from "next/link";
import { ClosetItemIcon } from "@/components/features/wardrobe/ClosetItemIcon";
import { ROUTES } from "@/constants/app";
import type { ClosetItem } from "@/lib/wardrobe/catalog";

const MIN_ITEMS_REQUIRED = 3;

export function WardrobeTeaser({ items }: { items: ClosetItem[] }) {
  const isEmpty = items.length < MIN_ITEMS_REQUIRED;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[18px] font-bold text-[#323232]">나만의 옷장</h2>

      {isEmpty ? (
        <Link
          href={ROUTES.closet}
          className="flex items-center gap-4 rounded-[10px] border border-[#efede9] bg-white px-4 py-3.5 shadow-[0_1px_5px_rgba(32,33,36,0.08)] transition hover:bg-off-white/60"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-accent text-white">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" aria-hidden>
              <rect
                x="6.5"
                y="7.5"
                width="12"
                height="15"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 10.5v9M15 10.5v9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M20.5 5.5v5M18 8h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold leading-5 text-foreground">
              옷장을 채워볼까요?
            </p>
            <p className="text-xs leading-4 text-muted">
              (최소 {MIN_ITEMS_REQUIRED}개 등록 필요)
            </p>
          </div>
          <svg className="shrink-0 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m9 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : (
        <Link
          href={ROUTES.closet}
          className="flex items-center gap-3 rounded-2xl border border-transparent bg-[#eff0ec] px-4 py-3.5 transition hover:bg-[#e7e8e2]"
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
