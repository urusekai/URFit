'use client';

import { useEffect, useRef, useState } from "react";
import { FittingActionBar } from "@/components/features/fitting/FittingActionBar";
import { FittingClosetSection } from "@/components/features/fitting/FittingClosetSection";
import { FittingHeader } from "@/components/features/fitting/FittingHeader";
import { FittingLookName } from "@/components/features/fitting/FittingLookName";
import { FittingStage } from "@/components/features/fitting/FittingStage";

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
  { id: "white-shirt", category: "top", name: "\uc640\uc774\uc154\uce20", colorClass: "bg-[#f8f8f8]", shape: "shirt" },
  { id: "denim-jacket", category: "top", name: "\uccad\uc790\ucf13", colorClass: "bg-[#2f4d70]", shape: "jacket" },
  { id: "green-hoodie", category: "top", name: "\ud6c4\ub4dc\ud2f0", colorClass: "bg-[#37553d]", shape: "hoodie" },
  { id: "gray-sweatshirt", category: "top", name: "\ub9e8\ud22c\ub9e8", colorClass: "bg-[#d9d9d9]", shape: "sweatshirt" },
  { id: "cargo-pants", category: "bottom", name: "\uce74\uace0\ud32c\uce20", colorClass: "bg-[#d8c7ad]", shape: "pants" },
  { id: "denim-pants", category: "bottom", name: "\uccad\ubc14\uc9c0", colorClass: "bg-[#8ba0b9]", shape: "pants" },
  { id: "slacks", category: "bottom", name: "\uc2ac\ub799\uc2a4", colorClass: "bg-[#46464d]", shape: "pants" },
  { id: "white-sneakers", category: "shoes", name: "\uc2a4\ub2c8\ucee4\uc988", colorClass: "bg-white", shape: "shoes" },
  { id: "black-shoes", category: "shoes", name: "\ube14\ub799\uc288\uc988", colorClass: "bg-[#222222]", shape: "shoes" },
  { id: "ball-cap", category: "hat", name: "\ubcfc\ucea1", colorClass: "bg-[#d7d2ca]", shape: "cap" },
];

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

function getRecommendedLook(items: FittingItem[]): SelectedFittingItems {
  return {
    top:
      items.find((item) => item.id.includes("outers")) ??
      getFirstItem(items, "top"),
    bottom: getFirstItem(items, "bottom"),
    shoes: getFirstItem(items, "shoes"),
    hat: getFirstItem(items, "hat"),
  };
}

type FittingExperienceProps = {
  items?: FittingItem[];
  personImageUrl?: string;
};

export function FittingExperience({
  items = fallbackItems,
  personImageUrl,
}: FittingExperienceProps) {
  const availableItems = items.length > 0 ? items : fallbackItems;
  const [activeCategory, setActiveCategory] = useState<FittingCategory>("top");
  const [selectedItems, setSelectedItems] = useState<SelectedFittingItems>(() =>
    getInitialSelection(availableItems),
  );
  const [hasGeneratedImage, setHasGeneratedImage] = useState(false);
  const [isSaveToastVisible, setIsSaveToastVisible] = useState(false);
  const saveToastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveToastTimeoutRef.current) {
        window.clearTimeout(saveToastTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectItem = (item: FittingItem) => {
    setSelectedItems((current) => ({
      ...current,
      [item.category]: item,
    }));
    setActiveCategory(item.category);
    setHasGeneratedImage(false);
  };

  const handleRecommend = () => {
    setSelectedItems(getRecommendedLook(availableItems));
    setActiveCategory("top");
    setHasGeneratedImage(false);
  };

  const handleGenerateOrSave = () => {
    if (!hasGeneratedImage) {
      setHasGeneratedImage(true);
      return;
    }

    if (saveToastTimeoutRef.current) {
      window.clearTimeout(saveToastTimeoutRef.current);
    }

    setIsSaveToastVisible(true);
    saveToastTimeoutRef.current = window.setTimeout(() => {
      setIsSaveToastVisible(false);
      saveToastTimeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="-mx-4 min-h-[calc(100vh-5rem)] bg-[#f6f5f2] px-4">
      <FittingHeader />
      <main className="mt-[10px]">
        <FittingLookName />
        <FittingStage
          activeCategory={activeCategory}
          generated={hasGeneratedImage}
          personImageUrl={personImageUrl}
          selectedItems={selectedItems}
          onSelectCategory={setActiveCategory}
        />
      </main>
      <FittingClosetSection
        activeCategory={activeCategory}
        items={availableItems}
        selectedItems={selectedItems}
        onSelectCategory={setActiveCategory}
        onSelectItem={handleSelectItem}
      />
      <FittingActionBar
        generated={hasGeneratedImage}
        onGenerateOrSave={handleGenerateOrSave}
        onRecommend={handleRecommend}
      />
      {isSaveToastVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+92px)] left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#202124] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
        >
          {"\uc800\uc7a5\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4"}
        </div>
      ) : null}
    </div>
  );
}
