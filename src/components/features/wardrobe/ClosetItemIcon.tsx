import type { ClosetCategory } from "@/lib/mock/wardrobe";

type ClosetItemIconProps = {
  category: ClosetCategory;
  color: string;
};

/** 실제 상품 사진 대신 카테고리별 실루엣 아이콘으로 썸네일을 대체합니다. */
export function ClosetItemIcon({ category, color }: ClosetItemIconProps) {
  switch (category) {
    case "top":
      return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 3.5 12 5.5l3-2 4.5 2.5-2 3.2-2-1v11.3H8.5V8.2l-2 1-2-3.2L9 3.5Z"
            fill={color}
          />
        </svg>
      );
    case "bottom":
      return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 3.5h10l.7 8.4.8 8.1h-4l-1.2-9.4-1.2 9.4H8.1l.8-8.1L7 3.5Z"
            fill={color}
          />
        </svg>
      );
    case "shoes":
      return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 18.5v-3.2c1.4-.2 2.6-.9 3.4-2l1.7-2.3c.5-.7 1.4-1 2.2-.7l1.2.4c.5.2.8.6.9 1.1l.3 1.6c.1.7.6 1.3 1.3 1.5l4.4 1.4c.4.1.6.5.6.9v1.3H4Z"
            fill={color}
          />
        </svg>
      );
    case "hat":
      return (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 5c-3.3 0-6.2 2.1-7.2 5.1-.2.6.2 1.2.9 1.2h1.4c.5 2.5 2.6 4.3 5 4.3s4.5-1.8 5-4.3h1.3c.7 0 1.1-.6.9-1.2C18.2 7.1 15.3 5 12 5Z"
            fill={color}
          />
          <path d="M4.6 11.3h14.9" stroke={color} strokeWidth="0" />
          <rect x="3.4" y="10.6" width="17.2" height="1.9" rx="0.9" fill={color} opacity="0.85" />
        </svg>
      );
    default:
      return null;
  }
}
