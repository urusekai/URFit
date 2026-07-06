import { getCareInfo } from "@/lib/wardrobe/care";
import { CLOSET_CATEGORY_LABEL, type ClosetItem } from "@/lib/wardrobe/catalog";
import { CareIcon } from "./CareIcon";
import { ClosetItemIcon } from "./ClosetItemIcon";

/** 옷 정보 모달의 "세탁정보 더보기"를 누르면 같은 모달 안에서 보여주는 세탁 케어 상세 화면 */
export function ClosetItemCareView({ item }: { item: ClosetItem }) {
  const careInfo = getCareInfo(item.material, item.color);
  const mainComposition = careInfo.composition[0];

  return (
    <div className="flex flex-col gap-6 px-4 pb-10">
      <div className="flex items-center gap-3">
        <div
          className="flex aspect-square w-1/3 shrink-0 items-center justify-center overflow-hidden rounded-xl"
          style={{ backgroundColor: item.swatch }}
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              className="h-full w-full object-contain p-3"
              aria-hidden
            />
          ) : (
            <span className="scale-90">
              <ClosetItemIcon category={item.category} color={item.accent} />
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-1">
          <p className="font-bold text-foreground">{item.name}</p>
          <p className="truncate text-sm text-muted">
            {item.brand} · {CLOSET_CATEGORY_LABEL[item.category]}
          </p>
          {mainComposition ? (
            <span className="mt-0.5 inline-flex w-fit items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              {mainComposition.name} {mainComposition.percent}%
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-foreground">세탁 케어</h3>
        <div className="grid grid-cols-2 gap-3">
          {careInfo.careItems.map((care) => (
            <div
              key={care.title}
              className="flex flex-col gap-2.5 rounded-2xl border border-border/70 p-4"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CareIcon type={care.icon} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{care.title}</p>
                <p className="mt-0.5 text-xs leading-4 text-muted">{care.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-foreground">소재 정보</h3>
        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 p-4">
          {careInfo.composition.map((composition) => (
            <div key={composition.name} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm font-medium text-charcoal">
                {composition.name}
              </span>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-off-white">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${composition.percent}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-sm font-semibold text-foreground">
                {composition.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-foreground">관리 Tip</h3>
        <div className="flex flex-col gap-2.5">
          {careInfo.tips.map((tip) => (
            <div key={tip} className="flex items-start gap-2 text-sm leading-5 text-charcoal">
              <svg
                className="mt-0.5 size-[1em] shrink-0 text-accent"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="m5 12 5 5L19 7"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
