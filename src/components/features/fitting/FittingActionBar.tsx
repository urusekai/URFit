const AI_CODY_LABEL = "AI \ucf54\ub514 \ucd94\ucc9c";
const GENERATE_IMAGE_LABEL = "\uc774\ubbf8\uc9c0 \uc0dd\uc131";
const SAVE_LOOK_LABEL = "\ub8e9\uc800\uc7a5";

type FittingActionBarProps = {
  generated: boolean;
  onGenerateOrSave: () => void;
  onRecommend: () => void;
};

export function FittingActionBar({
  generated,
  onGenerateOrSave,
  onRecommend,
}: FittingActionBarProps) {
  const primaryLabel = generated ? SAVE_LOOK_LABEL : GENERATE_IMAGE_LABEL;

  return (
    <div
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+48px)] left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 gap-3 px-5"
      aria-label="fitting actions"
    >
      <button
        type="button"
        onClick={onRecommend}
        className="flex h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-2 border-[#eff0ec] bg-white text-[14px] font-semibold text-foreground shadow-[0_8px_18px_rgba(26,26,26,0.08)]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px] text-foreground"
          fill="currentColor"
        >
          <path d="M12 2.5 14.1 9.4 21 11.5 14.1 13.6 12 20.5 9.9 13.6 3 11.5 9.9 9.4 12 2.5Z" />
        </svg>
        {AI_CODY_LABEL}
      </button>
      <button
        type="button"
        onClick={onGenerateOrSave}
        className="flex h-[42px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-accent text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(176,135,106,0.25)]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[16px] text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.8h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z" />
          <circle cx="12" cy="13" r="3.2" />
        </svg>
        {primaryLabel}
      </button>
    </div>
  );
}
