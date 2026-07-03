import { ROUTES } from "@/constants/app";

type TabIconProps = {
  name: string;
  active?: boolean;
  variant?: "default" | "center";
};

export function TabIcon({ name, active = false, variant = "default" }: TabIconProps) {
  if (variant === "center") {
    return (
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent shadow-sm">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2.5 14.1 9.4 21 11.5 14.1 13.6 12 20.5 9.9 13.6 3 11.5 9.9 9.4 12 2.5Z"
            fill="#fff"
          />
        </svg>
      </span>
    );
  }

  /* 부모 Link의 text-accent / text-muted 색을 따름 */
  const stroke = "currentColor";
  const fill = active ? "currentColor" : "none";

  switch (name) {
    case ROUTES.main:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5h-6V20.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case ROUTES.closet:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 4.5 8.5 7H6.5v12h11V7h-2L12 4.5Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9.5 7h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case ROUTES.saved:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} aria-hidden>
          <path
            d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5V19L12 15.5 5.5 19V6a1.5 1.5 0 0 1 1.5-1.5Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case ROUTES.mypage:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.5" stroke={stroke} strokeWidth="1.6" />
          <path
            d="M5.5 19.5c.9-3 3.3-4.5 6.5-4.5s5.6 1.5 6.5 4.5"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
