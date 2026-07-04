"use client";

import { useEffect, useState } from "react";
import { FittingLookNameSheet } from "@/components/features/fitting/FittingLookNameSheet";

const DEFAULT_LOOK_NAME = "\uc8fc\ub9d0 \ub098\ub4e4\uc774";
const EDIT_ARIA_LABEL = "\ub8e9 \uc774\ub984 \uc218\uc815";
const LABEL_TEXT = "\ub8e9\uba85";

type FittingLookNameProps = {
  lookName: string;
  onChangeLookName: (name: string) => void;
  onSheetOpenChange?: (isOpen: boolean) => void;
};

export { DEFAULT_LOOK_NAME };

export function FittingLookName({
  lookName,
  onChangeLookName,
  onSheetOpenChange,
}: FittingLookNameProps) {
  const [draftName, setDraftName] = useState(lookName);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    onSheetOpenChange?.(isSheetOpen);
  }, [isSheetOpen, onSheetOpenChange]);

  return (
    <>
      <section className="px-1 pb-5 pt-1">
        <button
          type="button"
          aria-label={EDIT_ARIA_LABEL}
          onClick={() => {
            setDraftName(lookName);
            setIsSheetOpen(true);
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 text-center"
        >
          <span className="text-[19px] font-semibold text-muted">{LABEL_TEXT}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          <span className="text-[19px] font-semibold text-accent">
            {lookName}
          </span>
        </button>
      </section>

      <FittingLookNameSheet
        draftName={draftName}
        isOpen={isSheetOpen}
        onChangeDraftName={setDraftName}
        onClose={() => {
          setDraftName(lookName);
          setIsSheetOpen(false);
        }}
        onSave={() => {
          const trimmedName = draftName.trim();
          onChangeLookName(trimmedName || DEFAULT_LOOK_NAME);
          setIsSheetOpen(false);
        }}
      />
    </>
  );
}
