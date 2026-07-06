import type { CareIconType } from "@/lib/mock/care-info";

type CareIconProps = {
  type: CareIconType;
};

/** 세탁 케어 카드에 쓰는 단순화된 세탁 기호 아이콘 */
export function CareIcon({ type }: CareIconProps) {
  switch (type) {
    case "wash":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="13" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 13a2.5 2.5 0 0 0 3.6 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="7" cy="6" r="0.9" fill="currentColor" />
        </svg>
      );
    case "bleach":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3.5 21 19H3L12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="m9.5 12.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "dry":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="4.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "iron":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4.5 9.5h11.8c2 0 3.2 1.8 2.7 3.7l-.4 1.5A3 3 0 0 1 15.7 17H8c-2 0-3.5-1-3.5-3.4V9.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M7 13.2h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case "dryClean":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M9.5 8.5v7M9.5 8.5h2.7a2 2 0 1 1 0 4H9.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "wring":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 6.5c3 3 3 4 0 7s-3 4 0 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 6.5c3 3 3 4 0 7s-3 4 0 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19 6.5c3 3 3 4 0 7s-3 4 0 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
