'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SHEET_TITLE = "\ub8e9 \uc774\ub984 \uc218\uc815";
const SHEET_DESCRIPTION = "\ud604\uc7ac \ub8e9\uc5d0 \uc5b4\uc6b8\ub9ac\ub294 \uc774\ub984\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.";
const INPUT_LABEL = "\ub8e9 \uc774\ub984";
const CLOSE_LABEL = "\ub8e9 \uc774\ub984 \uc218\uc815 \ub2eb\uae30";
const CANCEL_LABEL = "\ucde8\uc18c";
const CONFIRM_LABEL = "\ud655\uc778";

type FittingLookNameSheetProps = {
  draftName: string;
  isOpen: boolean;
  onChangeDraftName: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function FittingLookNameSheet({
  draftName,
  isOpen,
  onChangeDraftName,
  onClose,
  onSave,
}: FittingLookNameSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label={CLOSE_LABEL}
        onClick={onClose}
        className={[
          "absolute inset-0 cursor-pointer bg-charcoal/30 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fitting-look-name-sheet-title"
        className={[
          "absolute bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 w-full max-w-md -translate-x-1/2 rounded-t-[32px] bg-white px-5 pb-8 pt-4 transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="mx-auto h-1.5 w-14 rounded-full bg-surface-muted" />
        <div className="mt-5">
          <h3
            id="fitting-look-name-sheet-title"
            className="text-xl font-semibold tracking-[-0.03em] text-foreground"
          >
            {SHEET_TITLE}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">{SHEET_DESCRIPTION}</p>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-foreground">{INPUT_LABEL}</label>
          <Input
            value={draftName}
            onChange={(event) => onChangeDraftName(event.target.value)}
            placeholder={INPUT_LABEL}
            maxLength={24}
            autoFocus={isOpen}
            className="cursor-text"
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-12 cursor-pointer rounded-2xl"
            onClick={onClose}
          >
            {CANCEL_LABEL}
          </Button>
          <Button type="button" className="h-12 cursor-pointer rounded-2xl" onClick={onSave}>
            {CONFIRM_LABEL}
          </Button>
        </div>
      </div>
    </div>
  );
}
