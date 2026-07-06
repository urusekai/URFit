import Image from "next/image";
import { IMAGES } from "@/constants/assets";
import { CLOSET_CATEGORY_LABEL, type ClosetItem } from "@/lib/wardrobe/catalog";
import { ClosetItemIcon } from "./ClosetItemIcon";

type ClosetItemCardProps = {
  item: ClosetItem;
  onDelete: (id: string) => void;
  onSelect: (item: ClosetItem) => void;
};

export function ClosetItemCard({ item, onDelete, onSelect }: ClosetItemCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-white">
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`${item.name} 상세 보기`}
        className="flex aspect-square items-center justify-center overflow-hidden transition hover:brightness-95"
        style={{ backgroundColor: "#ffffff" }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-contain p-4"
            aria-hidden
          />
        ) : (
          <ClosetItemIcon category={item.category} color={item.accent} />
        )}
      </button>
      <div
        className="flex items-start justify-between gap-2 px-3 py-2.5"
        style={{ backgroundColor: item.swatch }}
      >
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="min-w-0 text-left"
        >
          <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
          <p className="truncate text-xs text-muted">
            {item.brand} · {CLOSET_CATEGORY_LABEL[item.category]}
          </p>
        </button>
        <button
          type="button"
          aria-label={`${item.name} 삭제`}
          onClick={() => onDelete(item.id)}
          className="flex size-6 shrink-0 items-center justify-center rounded-full transition hover:bg-surface-muted"
        >
          <Image src={IMAGES.icons.delete} alt="" width={10} height={13} aria-hidden />
        </button>
      </div>
    </div>
  );
}
