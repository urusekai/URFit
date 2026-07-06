"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CLOSET_CATEGORY_LABEL, type ClosetItem } from "@/lib/wardrobe/catalog";
import { ClosetItemCareView } from "./ClosetItemCareView";
import { ClosetItemIcon } from "./ClosetItemIcon";

type ClosetItemDetailModalProps = {
  item: ClosetItem;
  onClose: () => void;
};

type ModalView = "info" | "care";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-3.5 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/** 옷장 아이템을 눌렀을 때 뒤 화면 위로 떠오르는 옷 정보 모달 (바텀시트 형태) */
export function ClosetItemDetailModal({ item, onClose }: ClosetItemDetailModalProps) {
  const [view, setView] = useState<ModalView>("info");
  const hasCareInfo = item.careInfo !== "미등록";

  // 모달이 떠 있는 동안 뒤쪽 옷장 목록이 함께 스크롤되지 않도록 고정합니다.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleBack = () => {
    if (view === "care") {
      setView("info");
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-center">
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
            aria-label={view === "care" ? "옷 정보로 돌아가기" : "닫기"}
            onClick={handleBack}
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
            {view === "care" ? "세탁 정보" : "옷 정보"}
          </h2>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {view === "care" ? (
            <ClosetItemCareView item={item} />
          ) : (
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div
                className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border bg-white"
                style={{ borderColor: item.swatch }}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-contain p-6"
                    aria-hidden
                  />
                ) : (
                  <span className="scale-[1.8]">
                    <ClosetItemIcon category={item.category} color={item.accent} />
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.brand}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[CLOSET_CATEGORY_LABEL[item.category], item.color, item.season].map((tag) => (
                    <span
                      key={tag}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <InfoRow label="소재" value={item.material} />
                <InfoRow label="핏" value={item.fit} />
                <InfoRow
                  label="세탁법"
                  value={
                    hasCareInfo ? (
                      <button
                        type="button"
                        onClick={() => setView("care")}
                        className="inline-flex items-center gap-2 rounded-full bg-off-white pl-3.5 pr-1 text-sm font-medium text-foreground transition hover:bg-surface-muted"
                      >
                        {item.careInfo}
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
                    ) : (
                      <span className="text-muted">미등록</span>
                    )
                  }
                />
                <InfoRow label="출처" value={item.source} />
              </div>

              <div className="rounded-2xl bg-off-white/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-charcoal">옷 치수</span>
                  <span className="text-xs text-muted">M · {item.fit}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.measurements.map((measurement) => (
                    <div
                      key={measurement.label}
                    className="flex flex-col items-center gap-1 rounded-xl bg-white py-3"
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
          )}
        </div>
      </div>
    </div>
  );
}
