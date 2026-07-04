"use client";

import { useEffect, useRef, useState } from "react";
import { FittingActionBar } from "@/components/features/fitting/FittingActionBar";
import { FittingClosetSection } from "@/components/features/fitting/FittingClosetSection";
import { FittingHeader } from "@/components/features/fitting/FittingHeader";
import {
  DEFAULT_LOOK_NAME,
  FittingLookName,
} from "@/components/features/fitting/FittingLookName";
import { FittingStage } from "@/components/features/fitting/FittingStage";
import { FittingStyleChips } from "@/components/features/fitting/FittingStyleChips";
import type { StyleTag } from "@/types/fitting";

export type FittingCategory = "top" | "bottom" | "shoes" | "hat";

export type FittingItem = {
  id: string;
  category: FittingCategory;
  name: string;
  colorClass: string;
  imageUrl?: string;
  shape: "shirt" | "jacket" | "hoodie" | "sweatshirt" | "pants" | "shoes" | "cap";
};

export type SelectedFittingItems = Record<FittingCategory, FittingItem | null>;

const fallbackItems: FittingItem[] = [
  { id: "white-shirt", category: "top", name: "와이셔츠", colorClass: "bg-[#f8f8f8]", shape: "shirt" },
  { id: "denim-jacket", category: "top", name: "청자켓", colorClass: "bg-[#2f4d70]", shape: "jacket" },
  { id: "green-hoodie", category: "top", name: "후드티", colorClass: "bg-[#37553d]", shape: "hoodie" },
  { id: "gray-sweatshirt", category: "top", name: "맨투맨", colorClass: "bg-[#d9d9d9]", shape: "sweatshirt" },
  { id: "cargo-pants", category: "bottom", name: "카고팬츠", colorClass: "bg-[#d8c7ad]", shape: "pants" },
  { id: "denim-pants", category: "bottom", name: "청바지", colorClass: "bg-[#8ba0b9]", shape: "pants" },
  { id: "slacks", category: "bottom", name: "슬랙스", colorClass: "bg-[#46464d]", shape: "pants" },
  { id: "white-sneakers", category: "shoes", name: "스니커즈", colorClass: "bg-white", shape: "shoes" },
  { id: "black-shoes", category: "shoes", name: "블랙슈즈", colorClass: "bg-[#222222]", shape: "shoes" },
  { id: "ball-cap", category: "hat", name: "볼캡", colorClass: "bg-[#d7d2ca]", shape: "cap" },
];

type FittingExperienceProps = {
  items?: FittingItem[];
  personImageUrl?: string;
};

type RecommendResponse =
  | {
      ok: true;
      data: {
        items: Array<{ clothId: string }>;
        reason: string[];
      };
    }
  | { ok: false; error: string };

type SaveLookResponse =
  | {
      ok: true;
      data: {
        look: {
          id: string;
        };
      };
    }
  | { ok: false; error: string };

function getFirstItem(items: FittingItem[], category: FittingCategory) {
  return items.find((item) => item.category === category) ?? null;
}

function getInitialSelection(items: FittingItem[]): SelectedFittingItems {
  return {
    top: getFirstItem(items, "top"),
    bottom: null,
    shoes: null,
    hat: null,
  };
}

function getEmptySelection(): SelectedFittingItems {
  return {
    top: null,
    bottom: null,
    shoes: null,
    hat: null,
  };
}

function getSelectionFromIds(
  items: FittingItem[],
  clothIds: string[],
): SelectedFittingItems {
  const nextSelection = getEmptySelection();

  for (const clothId of clothIds) {
    const item = items.find((candidate) => candidate.id === clothId);
    if (item) {
      nextSelection[item.category] = item;
    }
  }

  return nextSelection;
}

function mergeSelection(
  current: SelectedFittingItems,
  next: SelectedFittingItems,
): SelectedFittingItems {
  return {
    top: next.top ?? current.top,
    bottom: next.bottom ?? current.bottom,
    shoes: next.shoes ?? current.shoes,
    hat: next.hat ?? current.hat,
  };
}

export function FittingExperience({
  items = fallbackItems,
  personImageUrl,
}: FittingExperienceProps) {
  const availableItems = items.length > 0 ? items : fallbackItems;
  const [activeCategory, setActiveCategory] = useState<FittingCategory>("top");
  const [selectedItems, setSelectedItems] = useState<SelectedFittingItems>(() =>
    getInitialSelection(availableItems),
  );
  const [recommendedItems, setRecommendedItems] = useState<SelectedFittingItems>(
    () => getEmptySelection(),
  );
  const [hasGeneratedImage, setHasGeneratedImage] = useState(false);
  const [fittingImage, setFittingImage] = useState<string | null>(null);
  const [fittingImageData, setFittingImageData] = useState<{
    image: string;
    mimeType: string;
  } | null>(null);
  const [lookName, setLookName] = useState(DEFAULT_LOOK_NAME);
  const [selectedStyle, setSelectedStyle] = useState<StyleTag>("캐주얼");
  const [isLookNameSheetOpen, setIsLookNameSheetOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isSaveToastVisible, setIsSaveToastVisible] = useState(false);
  const saveToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveToastTimeoutRef.current) {
        window.clearTimeout(saveToastTimeoutRef.current);
      }
    };
  }, []);

  const resetGeneratedResult = () => {
    setHasGeneratedImage(false);
    setFittingImage(null);
    setFittingImageData(null);
  };

  const handleSelectItem = (item: FittingItem) => {
    setSelectedItems((current) => {
      const isSelected = current[item.category]?.id === item.id;

      return {
        ...current,
        [item.category]: isSelected ? null : item,
      };
    });
    setActiveCategory(item.category);
    resetGeneratedResult();
    setGenerateError(null);
  };

  const handleRecommend = async () => {
    setIsRecommending(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          weather: "서울, 온화한 날씨",
        }),
      });
      const payload = (await response.json()) as RecommendResponse;

      if (!payload.ok) {
        setGenerateError(payload.error);
        return;
      }

      const recommendedSelection = getSelectionFromIds(
        availableItems,
        payload.data.items.map((item) => item.clothId),
      );

      setRecommendedItems(recommendedSelection);
      setSelectedItems((current) => mergeSelection(current, recommendedSelection));
      setActiveCategory("top");
      resetGeneratedResult();
    } catch {
      setGenerateError("AI 코디 추천 중 네트워크 오류가 발생했습니다.");
    } finally {
      setIsRecommending(false);
    }
  };

  const handleGenerate = async () => {
    const clothIds = Object.values(selectedItems)
      .filter((item): item is FittingItem => Boolean(item))
      .map((item) => item.id);

    if (clothIds.length === 0) {
      setGenerateError("룩을 먼저 선택해주세요.");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/fitting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clothIds }),
      });
      const payload = (await response.json()) as
        | { ok: true; data: { image: string; mimeType: string } }
        | { ok: false; error: string };

      if (payload.ok) {
        const imageData = {
          image: payload.data.image,
          mimeType: payload.data.mimeType,
        };

        setFittingImageData(imageData);
        setFittingImage(
          `data:${imageData.mimeType};base64,${imageData.image}`,
        );
        setHasGeneratedImage(true);
      } else {
        setGenerateError(payload.error);
      }
    } catch {
      setGenerateError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const showSaveToast = () => {
    if (saveToastTimeoutRef.current) {
      window.clearTimeout(saveToastTimeoutRef.current);
    }

    setIsSaveToastVisible(true);
    saveToastTimeoutRef.current = window.setTimeout(() => {
      setIsSaveToastVisible(false);
      saveToastTimeoutRef.current = null;
    }, 2000);
  };

  const handleSaveLook = async () => {
    if (!fittingImageData) {
      setGenerateError("저장할 피팅 이미지가 없습니다.");
      return;
    }

    const clothIds = Object.values(selectedItems)
      .filter((item): item is FittingItem => Boolean(item))
      .map((item) => item.id);

    setIsSaving(true);
    setGenerateError(null);

    try {
      const response = await fetch("/api/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lookName,
          clothIds,
          image: fittingImageData.image,
          mimeType: fittingImageData.mimeType,
        }),
      });
      const payload = (await response.json()) as SaveLookResponse;

      if (!payload.ok) {
        setGenerateError(payload.error);
        return;
      }

      showSaveToast();
    } catch {
      setGenerateError("룩 저장 중 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateOrSave = () => {
    if (isGenerating || isRecommending || isSaving) {
      return;
    }

    if (!hasGeneratedImage) {
      void handleGenerate();
      return;
    }

    void handleSaveLook();
  };

  return (
    <div className="-mx-4 h-[calc(100dvh-8rem)] overflow-hidden bg-[#f6f5f2] px-4">
      <FittingHeader />
      <main className="mt-2">
        <FittingLookName
          lookName={lookName}
          onChangeLookName={setLookName}
          onSheetOpenChange={setIsLookNameSheetOpen}
        />
        <FittingStyleChips
          selected={selectedStyle}
          disabled={isRecommending}
          onSelect={setSelectedStyle}
        />
        <FittingStage
          activeCategory={activeCategory}
          generated={hasGeneratedImage}
          loading={isGenerating}
          personImageUrl={personImageUrl}
          fittingImage={fittingImage}
          closetItems={selectedItems}
          recommendedItems={recommendedItems}
          onSelectCategory={setActiveCategory}
        />
      </main>
      <FittingClosetSection
        activeCategory={activeCategory}
        items={availableItems}
        selectedItems={selectedItems}
        hideNote={isLookNameSheetOpen}
        onSelectCategory={setActiveCategory}
        onSelectItem={handleSelectItem}
      />
      <FittingActionBar
        generated={hasGeneratedImage}
        loading={isGenerating}
        saving={isSaving}
        recommending={isRecommending}
        onGenerateOrSave={handleGenerateOrSave}
        onRecommend={() => {
          void handleRecommend();
        }}
      />
      {generateError ? (
        <div
          role="alert"
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+92px)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#c0392b] px-5 py-3 text-[13px] font-semibold text-white"
        >
          {generateError}
        </div>
      ) : null}
      {isSaveToastVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+92px)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#202124] px-5 py-3 text-[14px] font-semibold text-white"
        >
          저장이 완료되었습니다
        </div>
      ) : null}
    </div>
  );
}
