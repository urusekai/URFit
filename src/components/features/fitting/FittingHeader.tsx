type FittingHeaderProps = {
  title?: string;
};

const FITTING_TITLE = "\uac00\uc0c1\ud53c\ud305";
const BACK_LABEL = "\ub4a4\ub85c\uac00\uae30";
const SHARE_LABEL = "\uacf5\uc720";

function HeaderIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-9 cursor-pointer items-center justify-center rounded-[10px] bg-white text-charcoal shadow-[0_4px_12px_rgba(26,26,26,0.05)]"
    >
      {children}
    </button>
  );
}

export function FittingHeader({ title = FITTING_TITLE }: FittingHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 bg-[#f6f5f2]/95 px-4 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <HeaderIcon label={BACK_LABEL}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </HeaderIcon>

        <div className="text-center">
          <p className="text-[20px] font-extrabold text-foreground">{title}</p>
        </div>

        <HeaderIcon label={SHARE_LABEL}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="M8.2 11l7-4.2" />
            <path d="M8.2 13l7 4.2" />
          </svg>
        </HeaderIcon>
      </div>
    </header>
  );
}
