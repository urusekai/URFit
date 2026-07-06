"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  CLOSET_CATEGORIES,
  CLOSET_CATEGORY_LABEL,
  type ClosetCategory,
  type ClosetItem,
  type ClosetMeasurement,
} from "@/lib/mock/wardrobe";

const SWATCH_PRESETS = [
  { swatch: "#f2f1ed", accent: "#6b6b68" },
  { swatch: "#e4e9f2", accent: "#3f5a8a" },
  { swatch: "#e6e9e2", accent: "#33472f" },
  { swatch: "#f1e9de", accent: "#b0876a" },
  { swatch: "#efe6da", accent: "#6b3f28" },
];

const MATERIAL_OPTIONS = ["코튼 100%", "폴리에스터 100%", "울 혼방", "데님", "레더", "니트"];
const FIT_OPTIONS = ["레귤러", "슬림", "오버사이즈", "테이퍼드", "와이드"];

const DEFAULT_MEASUREMENTS: Record<ClosetCategory, ClosetMeasurement[]> = {
  top: [
    { label: "어깨", value: "-" },
    { label: "가슴", value: "-" },
    { label: "총장", value: "-" },
  ],
  bottom: [
    { label: "허리", value: "-" },
    { label: "허벅지", value: "-" },
    { label: "총장", value: "-" },
  ],
  shoes: [
    { label: "사이즈", value: "-" },
    { label: "밑창 높이", value: "-" },
  ],
  hat: [
    { label: "둘레", value: "-" },
    { label: "챙 길이", value: "-" },
  ],
};

type AddItemSheetProps = {
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
};

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-3.5 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
}

function CarePhotoButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-off-white pl-3.5 pr-1 text-sm font-medium text-foreground transition hover:bg-surface-muted"
    >
      {label}
      <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="m9 6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

/**
 * 옷장에 새 아이템을 등록하는 모달.
 * 온보딩의 "옷 정보 등록" 화면과 동일한 구성(사진 업로드 → AI 추출 정보 확인 → 등록)을 재사용합니다.
 * 실제 배경 제거/사진 인식 AI는 아직 없어서 사진 업로드와 프리셋 선택으로 대체했습니다.
 */
export function AddItemSheet({ onClose, onAdd }: AddItemSheetProps) {
  const [category, setCategory] = useState<ClosetCategory>("top");
  const [material, setMaterial] = useState(MATERIAL_OPTIONS[0]);
  const [fit, setFit] = useState(FIT_OPTIONS[0]);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasCarePhoto, setHasCarePhoto] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const carePhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const preview = useMemo(
    () => SWATCH_PRESETS[Math.abs(category.length + material.length) % SWATCH_PRESETS.length],
    [category, material],
  );

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name.replace(/\.[^./]+$/, ""));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onAdd({
      id: `w-${Date.now()}`,
      name: photoName || `${CLOSET_CATEGORY_LABEL[category]} 아이템`,
      brand: "브랜드 미상",
      category,
      swatch: preview.swatch,
      accent: preview.accent,
      createdAt: new Date().toISOString(),
      color: "미입력",
      season: "사계절",
      material,
      fit,
      careInfo: hasCarePhoto ? "세탁정보 더보기" : "미등록",
      source: "직접 등록",
      measurements: DEFAULT_MEASUREMENTS[category],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/40"
      />
      <div className="absolute inset-x-0 top-[18%] bottom-0 mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl">
        <header className="relative flex h-14 shrink-0 items-center bg-white px-2">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-charcoal transition hover:bg-off-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="m15 5-7 7 7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-foreground">
            옷 등록하기
          </h2>
        </header>

        <form
          id="add-item-form"
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <div className="flex flex-col gap-5 px-4 pb-8">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-off-white/70 transition hover:bg-off-white"
            >
              <span className="absolute left-3 top-3 rounded-md bg-charcoal/80 px-2 py-1 text-[11px] font-medium text-white">
                배경 자동 제거됨
              </span>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="등록할 옷 사진"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <rect
                      x="3.5"
                      y="5.5"
                      width="17"
                      height="13"
                      rx="1.5"
                      stroke="#9a9a96"
                      strokeWidth="1.4"
                    />
                    <circle cx="8.5" cy="10" r="1.5" stroke="#9a9a96" strokeWidth="1.4" />
                    <path
                      d="m5.5 16 4-3.5 3 2.5 3.5-4 4.5 5"
                      stroke="#9a9a96"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm text-muted">배경 제거된 옷 사진</span>
                </div>
              )}
            </button>

            <p className="text-sm text-muted">AI가 찾은 정보를 골라서 수정하세요</p>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-charcoal">카테고리</span>
              <div className="flex flex-wrap gap-2">
                {CLOSET_CATEGORIES.map((item) => (
                  <Chip
                    key={item.value}
                    type="button"
                    selected={category === item.value}
                    onClick={() => setCategory(item.value)}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <InfoRow
                label="소재"
                value={
                  <select
                    id="item-material"
                    value={material}
                    onChange={(event) => setMaterial(event.target.value)}
                    className="cursor-pointer appearance-none bg-transparent text-right font-medium text-foreground outline-none"
                  >
                    {MATERIAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                }
              />
              <InfoRow
                label="핏"
                value={
                  <select
                    id="item-fit"
                    value={fit}
                    onChange={(event) => setFit(event.target.value)}
                    className="cursor-pointer appearance-none bg-transparent text-right font-medium text-foreground outline-none"
                  >
                    {FIT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                }
              />
              <input
                ref={carePhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => setHasCarePhoto(true)}
              />
              <InfoRow
                label="세탁법"
                value={
                  <CarePhotoButton
                    label={hasCarePhoto ? "택 사진 등록됨" : "택 사진으로 추가"}
                    onClick={() => carePhotoInputRef.current?.click()}
                  />
                }
              />
            </div>

            <div className="rounded-2xl bg-off-white/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal">옷 치수</span>
                <span className="text-xs text-muted">M · {fit}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DEFAULT_MEASUREMENTS[category].map((measurement) => (
                  <div
                    key={measurement.label}
                    className="flex flex-col items-center gap-1 rounded-xl bg-white py-3.5"
                  >
                    <span className="text-xs text-muted">{measurement.label}</span>
                    <span className="text-base font-bold text-foreground">
                      {measurement.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="shrink-0 border-t border-border/70 bg-white px-4 py-3">
          <Button type="submit" form="add-item-form" className="w-full rounded-xl py-3">
            옷 정보 등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
