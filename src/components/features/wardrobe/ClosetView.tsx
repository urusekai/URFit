"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { IMAGES } from "@/constants/assets";
import {
  CLOSET_CATEGORIES,
  type ClosetCategory,
  type ClosetItem,
} from "@/lib/wardrobe/catalog";
import { deleteClosetItem } from "@/app/(tabs)/closet/actions";
import { AddItemSheet } from "./AddItemSheet";
import { ClosetItemCard } from "./ClosetItemCard";
import { ClosetItemDetailModal } from "./ClosetItemDetailModal";
import { FloatingAddButton } from "./FloatingAddButton";

type CategoryFilter = "all" | ClosetCategory;
type SortOption = "recent" | "name";

const SORT_LABEL: Record<SortOption, string> = {
  recent: "최근 등록순",
  name: "이름순",
};

type ClosetViewProps = {
  initialItems: ClosetItem[];
};

export function ClosetView({ initialItems }: ClosetViewProps) {
  const [items, setItems] = useState<ClosetItem[]>(initialItems);
  const [category, setCategory] = useState<CategoryFilter>("top");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesKeyword =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.brand.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });

    return [...filtered].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "ko")
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [items, category, query, sort]);

  const handleDelete = async (id: string) => {
    const target = items.find((item) => item.id === id);
    // 낙관적 제거: 먼저 화면에서 빼고, 서버 삭제가 실패하면 되돌린다.
    setItems((prev) => prev.filter((item) => item.id !== id));
    setDeleteError(null);

    const result = await deleteClosetItem(id);
    if (!result.ok && target) {
      setItems((prev) => [target, ...prev]);
      setDeleteError(result.error);
    }
  };

  const handleAdd = (item: ClosetItem) => {
    setItems((prev) => [item, ...prev]);
    setCategory(item.category);
  };

  return (
    <>
      <PageHeader title="나만의 옷장" />

      <div className="flex flex-col gap-4 pb-6">
        <Input
          placeholder="브랜드 · 색상 · 카테고리 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          icon={<Image src={IMAGES.icons.search} alt="" width={15} height={19} aria-hidden />}
        />

        <div className="flex flex-wrap gap-2">
          <Chip selected={category === "all"} onClick={() => setCategory("all")}>
            전체
          </Chip>
          {CLOSET_CATEGORIES.map((item) => (
            <Chip
              key={item.value}
              selected={category === item.value}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            총 <span className="font-semibold text-foreground">{filteredItems.length}</span>개
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen((open) => !open)}
              className="flex items-center gap-1 text-sm font-medium text-muted"
            >
              {SORT_LABEL[sort]}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isSortOpen ? (
              <div className="absolute right-0 top-7 z-10 w-32 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                {(Object.keys(SORT_LABEL) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSort(option);
                      setIsSortOpen(false);
                    }}
                    className={`block w-full px-3.5 py-2.5 text-left text-sm ${
                      sort === option ? "font-semibold text-accent" : "text-charcoal"
                    } hover:bg-off-white`}
                  >
                    {SORT_LABEL[option]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <ClosetItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-off-white/70 py-16 text-center">
            <p className="text-sm text-muted">조건에 맞는 옷이 없어요.</p>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="text-sm font-semibold text-accent"
            >
              새 옷 등록하기
            </button>
          </div>
        )}
      </div>

      <FloatingAddButton onClick={() => setIsAddOpen(true)} />

      {isAddOpen ? (
        <AddItemSheet onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      ) : null}

      {selectedItem ? (
        <ClosetItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : null}

      {deleteError ? (
        <div
          role="alert"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#c0392b] px-5 py-3 text-[13px] font-semibold text-white"
        >
          {deleteError}
        </div>
      ) : null}
    </>
  );
}
