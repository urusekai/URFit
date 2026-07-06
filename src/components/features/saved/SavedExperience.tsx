"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";
import type { ClothCategory } from "@/types/fitting";

type SavedFilter = "all" | "favorite" | "date";

export type SavedLookItem = {
  id: string;
  title: string;
  savedAt: string;
  isFavorite: boolean;
  imageUrl?: string;
  garments: SavedLookGarment[];
  palette: {
    outer?: string;
    top: string;
    bottom: string;
    accent?: string;
    skin?: string;
    hair?: string;
    shoe?: string;
  };
};

export type SavedLookGarment = {
  id: string;
  name: string;
  category?: ClothCategory;
  imageUrl?: string;
};

type DeleteLookResponse =
  | {
      ok: true;
      data: {
        id: string;
      };
    }
  | { ok: false; error: string };

type FavoriteLookResponse =
  | {
      ok: true;
      data: {
        id: string;
        isFavorite: boolean;
      };
    }
  | { ok: false; error: string };

const FILTERS: Array<{ id: SavedFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "favorite", label: "즐겨찾기" },
  { id: "date", label: "날짜별" },
];

const CLOTH_CATEGORY_LABEL: Record<ClothCategory, string> = {
  top: "상의",
  outer: "아우터",
  bottom: "하의",
  shoes: "신발",
  hat: "모자",
};

function compareSavedAtDescending(left: SavedLookItem, right: SavedLookItem) {
  return right.savedAt.localeCompare(left.savedAt);
}

function getFilteredLooks(looks: SavedLookItem[], filter: SavedFilter) {
  switch (filter) {
    case "favorite":
      return looks.filter((item) => item.isFavorite).sort(compareSavedAtDescending);
    case "date":
      return [...looks].sort(compareSavedAtDescending);
    case "all":
    default:
      return looks;
  }
}

type LookMonthGroup = {
  key: string;
  label: string;
  items: SavedLookItem[];
};

/** "날짜별" 필터용: 저장월(YYYY.MM) 기준으로 묶어 최신 월부터 반환 */
function groupLooksByMonth(looks: SavedLookItem[]): LookMonthGroup[] {
  const groups: LookMonthGroup[] = [];
  const indexByKey = new Map<string, number>();

  for (const look of [...looks].sort(compareSavedAtDescending)) {
    const [year, month] = look.savedAt.split(".");
    const key = `${year}.${month}`;
    const existing = indexByKey.get(key);

    if (existing === undefined) {
      indexByKey.set(key, groups.length);
      groups.push({
        key,
        label: `${year}년 ${Number(month)}월`,
        items: [look],
      });
    } else {
      groups[existing].items.push(look);
    }
  }

  return groups;
}

function HangerIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6.2a1.7 1.7 0 1 0-1.2-2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12 6.3 4 14.1v2.2h16v-2.2L12 6.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M7.5 14.2h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 6.75h11l-.65 12.05a2 2 0 0 1-2 1.9h-5.7a2 2 0 0 1-2-1.9L6.5 6.75Z"
        fill="currentColor"
      />
      <path
        d="M5.2 5.2c0-.7.57-1.27 1.27-1.27h3.17l.66-.9h3.4l.66.9h3.17c.7 0 1.27.57 1.27 1.27v.72H5.2V5.2Z"
        fill="currentColor"
      />
      <path
        d="m9.9 11.2 4.2 4.2M14.1 11.2l-4.2 4.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SavedPageHeader() {
  return (
    <header className="sticky top-0 z-20 -mx-4 px-4 pb-3 pt-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-accent text-white">
          <HangerIcon />
        </div>
        <div className="rounded-[12px] bg-white px-3 py-1.5 text-foreground">
          <h1 className="text-[20px] font-extrabold tracking-[-0.03em] text-foreground">
            저장한 룩
          </h1>
        </div>
      </div>
    </header>
  );
}

function SavedLookPreview({ item }: { item: SavedLookItem }) {
  const { palette } = item;

  if (item.imageUrl) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-t-[18px] rounded-b-none bg-[#F6F5F2]">
        {/* Saved fitting result URLs are scoped signed URLs, so keep this local. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-full w-full object-contain object-center"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-t-[18px] rounded-b-none bg-[#dddce3]">
      <div className="absolute inset-y-0 right-0 w-[78%] bg-[#f4f3f4]" />
      <svg
        viewBox="0 0 164 214"
        className="relative z-[1] block aspect-square h-auto w-full"
        role="img"
        aria-label={item.title}
      >
        <rect x="0" y="0" width="164" height="214" fill="#f4f3f4" />
        <ellipse cx="82" cy="42" rx="14" ry="17" fill={palette.skin ?? "#f0cebd"} />
        <path
          d="M67 40c0-12 6-22 15-22s15 10 15 22v11H67Z"
          fill={palette.hair ?? "#241915"}
        />
        <rect x="76" y="57" width="12" height="15" rx="5" fill={palette.skin ?? "#f0cebd"} />
        {palette.outer ? (
          <>
            <path d="M49 73c7-12 19-19 33-19s26 7 33 19l-11 61H60Z" fill={palette.outer} />
            <path d="M71 73h22v62H71Z" fill={palette.top} />
          </>
        ) : (
          <path d="M58 73c6-11 15-18 24-18s18 7 24 18l-9 52H67Z" fill={palette.top} />
        )}
        <rect x="49" y="77" width="12" height="68" rx="6" fill={palette.outer ?? palette.top} />
        <rect x="103" y="77" width="12" height="68" rx="6" fill={palette.outer ?? palette.top} />
        <rect x="68" y="136" width="12" height="49" rx="6" fill={palette.bottom} />
        <rect x="84" y="136" width="12" height="49" rx="6" fill={palette.bottom} />
        <rect x="64" y="183" width="16" height="7" rx="3.5" fill={palette.shoe ?? "#fbfbfb"} />
        <rect x="84" y="183" width="16" height="7" rx="3.5" fill={palette.shoe ?? "#fbfbfb"} />
        {palette.accent ? <rect x="71" y="92" width="22" height="8" rx="4" fill={palette.accent} /> : null}
      </svg>
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17.9 6.8 20.6l1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
    </svg>
  );
}

function SavedLookGarmentsSheet({
  look,
  onClose,
}: {
  look: SavedLookItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-0 top-0 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-[60]">
      <button
        type="button"
        aria-label="저장한 룩 상세 닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-charcoal/30"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-look-garments-title"
        className="absolute bottom-0 left-1/2 flex max-h-[calc(100dvh_-_7.75rem_-_env(safe-area-inset-bottom))] w-full max-w-md -translate-x-1/2 flex-col overflow-hidden rounded-t-[32px] bg-white px-5 pb-8 pt-4 shadow-[0_-18px_48px_rgba(0,0,0,0.12)]"
      >
        <div className="mx-auto h-1.5 w-14 rounded-full bg-surface-muted" />
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="saved-look-garments-title"
              className="truncate text-xl font-extrabold tracking-[-0.03em] text-foreground"
            >
              {look.title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-muted">{look.savedAt}</p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-off-white text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-5 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-sm font-bold text-foreground">입은 옷</p>
          {look.garments.length > 0 ? (
            <div className="mt-3 divide-y divide-border rounded-2xl bg-off-white px-3">
              {look.garments.map((garment) => (
                <div key={garment.id} className="flex items-center gap-3 py-3">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {garment.imageUrl ? (
                      // Signed URLs are scoped to this page.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={garment.imageUrl}
                        alt=""
                        className="h-full w-full object-contain p-1.5"
                        draggable={false}
                      />
                    ) : (
                      <span className="text-xs font-semibold text-muted">없음</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-extrabold text-foreground">
                      {garment.name}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-muted">
                      {garment.category ? CLOTH_CATEGORY_LABEL[garment.category] : "옷 정보 없음"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl bg-off-white px-4 py-6 text-center text-sm font-semibold text-muted">
              저장된 옷 정보가 없어요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SavedLookCard({
  deleting,
  favoriting,
  item,
  onDelete,
  onOpen,
  onToggleFavorite,
}: {
  deleting: boolean;
  favoriting: boolean;
  item: SavedLookItem;
  onDelete: (id: string) => void;
  onOpen: (item: SavedLookItem) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${item.title}에 입은 옷 보기`}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item);
        }
      }}
      className="relative cursor-pointer overflow-hidden rounded-[26px] border-4 border-[#EFF0EC] bg-[#F9F9F9]"
    >
      <button
        type="button"
        aria-label={item.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        aria-pressed={item.isFavorite}
        disabled={favoriting}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(item.id, !item.isFavorite);
        }}
        className={cn(
          "absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/90 shadow-[0_2px_8px_rgba(26,26,26,0.12)] transition disabled:cursor-wait disabled:opacity-60",
          item.isFavorite ? "text-accent" : "text-[#9a968f] hover:text-accent",
        )}
      >
        <StarIcon filled={item.isFavorite} />
      </button>
      <SavedLookPreview item={item} />
      <div className="flex min-h-[74px] items-start gap-2 px-4 pb-3.5 pt-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16px] font-semibold tracking-[-0.03em] text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-[14px] text-muted">{item.savedAt}</p>
        </div>
        <button
        type="button"
        aria-label="저장한 룩 삭제"
        disabled={deleting}
        onClick={(event) => {
          event.stopPropagation();
          onDelete(item.id);
        }}
          className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#747471] transition hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

function SavedEmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-border bg-off-white px-6 py-16 text-center">
      <p className="text-base font-semibold text-foreground">아직 저장한 룩이 없어요.</p>
      <p className="mt-2 text-sm leading-6 text-muted">
        가상피팅에서 마음에 드는 코디를 저장하면 이곳에서 다시 볼 수 있어요.
      </p>
    </div>
  );
}

type SavedExperienceProps = {
  initialLooks?: SavedLookItem[];
};

export function SavedExperience({ initialLooks }: SavedExperienceProps) {
  const [selectedFilter, setSelectedFilter] = useState<SavedFilter>("all");
  const [looks, setLooks] = useState(() => initialLooks ?? []);
  const [deletingLookId, setDeletingLookId] = useState<string | null>(null);
  const [favoritingLookId, setFavoritingLookId] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<SavedLookItem | null>(null);

  const filteredLooks = useMemo(
    () => getFilteredLooks(looks, selectedFilter),
    [looks, selectedFilter],
  );

  const handleDeleteLook = async (id: string) => {
    setDeletingLookId(id);

    try {
      const response = await fetch("/api/looks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json()) as DeleteLookResponse;

      if (!payload.ok) {
        return;
      }

      setLooks((currentLooks) => currentLooks.filter((look) => look.id !== id));
      setSelectedLook((current) => (current?.id === id ? null : current));
    } finally {
      setDeletingLookId(null);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    setFavoritingLookId(id);
    // 낙관적 업데이트 (실패 시 되돌림)
    setLooks((currentLooks) =>
      currentLooks.map((look) =>
        look.id === id ? { ...look, isFavorite } : look,
      ),
    );

    try {
      const response = await fetch("/api/looks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFavorite }),
      });
      const payload = (await response.json()) as FavoriteLookResponse;

      if (!payload.ok) {
        setLooks((currentLooks) =>
          currentLooks.map((look) =>
            look.id === id ? { ...look, isFavorite: !isFavorite } : look,
          ),
        );
      }
    } catch {
      setLooks((currentLooks) =>
        currentLooks.map((look) =>
          look.id === id ? { ...look, isFavorite: !isFavorite } : look,
        ),
      );
    } finally {
      setFavoritingLookId(null);
    }
  };

  const renderLookCard = (item: SavedLookItem) => (
    <SavedLookCard
      key={item.id}
      deleting={deletingLookId === item.id}
      favoriting={favoritingLookId === item.id}
      item={item}
      onDelete={handleDeleteLook}
      onOpen={setSelectedLook}
      onToggleFavorite={handleToggleFavorite}
    />
  );

  return (
    <section className="-mx-1 space-y-5 pb-10">
      <SavedPageHeader />

      <div className="space-y-5 px-1">
        <div className="rounded-[16px] bg-[#f3efe9] p-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {FILTERS.map((filter) => {
              const isSelected = filter.id === selectedFilter;

              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={cn(
                    "rounded-[12px] px-2 py-3 text-[15px] font-semibold tracking-[-0.03em] transition",
                    isSelected
                      ? "bg-white text-foreground"
                      : "text-[#5d5954] hover:text-foreground",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredLooks.length === 0 ? (
          <SavedEmptyState />
        ) : selectedFilter === "date" ? (
          <div className="space-y-6">
            {groupLooksByMonth(filteredLooks).map((group) => (
              <div key={group.key} className="space-y-3">
                <h2 className="px-1 text-[14px] font-semibold text-muted">
                  {group.label}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-7">
                  {group.items.map(renderLookCard)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {filteredLooks.map(renderLookCard)}
          </div>
        )}
      </div>

      {selectedLook ? (
        <SavedLookGarmentsSheet
          look={selectedLook}
          onClose={() => setSelectedLook(null)}
        />
      ) : null}
    </section>
  );
}
