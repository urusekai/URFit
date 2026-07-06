"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { saveClosetItem } from "@/app/(tabs)/closet/actions";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import {
  CLOSET_CATEGORIES,
  CLOSET_CATEGORY_LABEL,
  type ClosetCategory,
  type ClosetItem,
} from "@/lib/wardrobe/catalog";
import {
  CATEGORY_CONFIG,
  defaultMeasures,
} from "@/lib/wardrobe/clothForm";

type AddItemSheetProps = {
  onClose: () => void;
  onAdd: (item: ClosetItem) => void;
};

function getCategoryConfig(category: ClosetCategory) {
  return CATEGORY_CONFIG[CLOSET_CATEGORY_LABEL[category]];
}

function MeasureField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white py-4">
      <span className="text-xs text-muted">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
        className="w-12 rounded bg-transparent text-center text-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

export function AddItemSheet({ onClose, onAdd }: AddItemSheetProps) {
  const [category, setCategory] = useState<ClosetCategory>("top");
  const [material, setMaterial] = useState("코튼 100%");
  const [fit, setFit] = useState(getCategoryConfig("top").fitOptions[0]);
  const [size, setSize] = useState(getCategoryConfig("top").sizeOptions[0]);
  const [measures, setMeasures] = useState<Record<string, string>>(() =>
    defaultMeasures(CLOSET_CATEGORY_LABEL.top),
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryConfig = getCategoryConfig(category);

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

  const changeCategory = (next: ClosetCategory) => {
    if (next === category) return;
    const config = getCategoryConfig(next);
    setCategory(next);
    setFit(config.fitOptions[0]);
    setSize(config.sizeOptions[0]);
    setMeasures(defaultMeasures(CLOSET_CATEGORY_LABEL[next]));
  };

  const setMeasure = (key: string, value: string) => {
    setMeasures((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("category", CLOSET_CATEGORY_LABEL[category]);
    formData.set("material", material);
    formData.set("fit", fit);
    formData.set("size", size);
    formData.set("measurements", JSON.stringify(measures));
    if (photoFile) formData.set("clothPhoto", photoFile);

    const result = await saveClosetItem(formData);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    onAdd(result.data);
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
          <div className="flex flex-col gap-6 px-4 pb-8">
            <label className="relative flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-border">
              <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground px-3 py-1 text-xs text-white">
                배경 자동 제거됨
              </span>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="업로드한 옷 사진"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <>
                  <Image
                    src="/images/icons/image-uplode.svg"
                    alt=""
                    aria-hidden
                    width={30}
                    height={30}
                    className="h-10 w-10"
                  />
                  <p className="text-sm text-muted">배경 제거된 옷 사진</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>

            <p className="text-sm text-muted">AI가 찾은 정보를 골라서 수정하세요</p>

            <div>
              <label className="text-sm font-medium text-foreground">카테고리</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {CLOSET_CATEGORIES.map((option) => (
                  <Chip
                    key={option.value}
                    type="button"
                    selected={category === option.value}
                    onClick={() => changeCategory(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-border border-t border-border">
              <div className="flex items-center justify-between py-4">
                <label htmlFor="item-material" className="text-sm text-muted">
                  소재
                </label>
                <input
                  id="item-material"
                  value={material}
                  onChange={(event) => setMaterial(event.target.value)}
                  className="w-40 rounded bg-transparent text-right text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <label htmlFor="item-fit" className="text-sm text-muted">
                  핏
                </label>
                <select
                  id="item-fit"
                  value={fit}
                  onChange={(event) => setFit(event.target.value)}
                  className="cursor-pointer rounded bg-transparent text-right text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {categoryConfig.fitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-muted">세탁법</span>
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-off-white"
                >
                  택 사진으로 추가
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-off-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">옷 치수</span>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <select
                    value={size}
                    onChange={(event) => setSize(event.target.value)}
                    aria-label="사이즈"
                    className="cursor-pointer rounded bg-transparent text-right text-xs text-muted outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    {categoryConfig.sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span>· {fit}</span>
                </div>
              </div>
              <div
                className={
                  categoryConfig.measures.length === 2
                    ? "mt-3 grid grid-cols-2 gap-3"
                    : "mt-3 grid grid-cols-3 gap-3"
                }
              >
                {categoryConfig.measures.map((measure) => (
                  <MeasureField
                    key={measure.key}
                    label={measure.label}
                    value={measures[measure.key] ?? ""}
                    onChange={(value) => setMeasure(measure.key, value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="shrink-0 border-t border-border/70 bg-white px-4 py-3">
          {error ? (
            <p className="mb-2 text-center text-sm text-red-500">{error}</p>
          ) : null}
          <Button
            type="submit"
            form="add-item-form"
            disabled={submitting}
            className="w-full rounded-xl py-3 disabled:opacity-60"
          >
            {submitting ? "저장 중..." : "옷 정보 등록하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
