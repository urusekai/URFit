"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

type SavedFilter = "all" | "favorite" | "date";

export type SavedLookItem = {
  id: string;
  title: string;
  savedAt: string;
  isFavorite: boolean;
  imageUrl?: string;
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

type DeleteLookResponse =
  | {
      ok: true;
      data: {
        id: string;
      };
    }
  | { ok: false; error: string };

const FILTERS: Array<{ id: SavedFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "favorite", label: "즐겨찾기" },
  { id: "date", label: "날짜별" },
];

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

function SavedLookCard({
  deleting,
  item,
  onDelete,
}: {
  deleting: boolean;
  item: SavedLookItem;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="overflow-hidden rounded-[26px] border-4 border-[#EFF0EC] bg-[#F9F9F9]">
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
          onClick={() => onDelete(item.id)}
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
    } finally {
      setDeletingLookId(null);
    }
  };

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

        {filteredLooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            {filteredLooks.map((item) => (
              <SavedLookCard
                key={item.id}
                deleting={deletingLookId === item.id}
                item={item}
                onDelete={handleDeleteLook}
              />
            ))}
          </div>
        ) : (
          <SavedEmptyState />
        )}
      </div>
    </section>
  );
}
