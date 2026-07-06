import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/app";
import type { OutfitRecommendation } from "@/lib/outfit/recommendation";

export function AiRecommendationCard({
  recommendation,
}: {
  recommendation: OutfitRecommendation;
}) {
  const visualSrc = recommendation.recommendationImageUrl ?? recommendation.imageUrl;
  const visualAlt = recommendation.recommendationImageAlt ?? recommendation.imageAlt ?? "";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[258px] w-full overflow-hidden">
        <div className="absolute left-1/2 top-8 h-[214px] w-[218px] -translate-x-[62%] rotate-[-9deg] rounded-[18px] bg-[#efede9]" />
        <div className="absolute left-1/2 top-8 h-[214px] w-[218px] -translate-x-[38%] rotate-[8deg] rounded-[18px] bg-[#efede9]" />

        <div className="absolute left-1/2 top-0 flex h-[244px] w-[220px] -translate-x-1/2 items-center justify-center rounded-[18px] bg-[#f7f6f3] shadow-sm">
          <div className="relative h-[178px] w-[144px] bg-white">
            {visualSrc ? (
              <Image
                src={visualSrc}
                alt={visualAlt}
                fill
                sizes="144px"
                className="object-contain p-1"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-accent">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 3.5 12 5.5l3-2 4.5 2.5-2 3.2-2-1v11.3H8.5V8.2l-2 1-2-3.2L9 3.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-0 flex items-center justify-center gap-1.5">
        <span className="h-1.5 w-5 rounded-full bg-accent" />
        <span className="size-1.5 rounded-full bg-[#dedbd5]" />
        <span className="size-1.5 rounded-full bg-[#dedbd5]" />
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-base font-extrabold text-foreground">
          {recommendation.title}
        </h3>
        <p className="mt-2 text-sm leading-5 text-muted">
          {recommendation.description}
        </p>
      </div>

      <Link
        href={ROUTES.fitting}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-extrabold text-white transition hover:opacity-90"
      >
        <svg width="25" height="22" viewBox="0 0 25 22" fill="none" aria-hidden>
          <path
            d="M12.5 3.2c0-1.3 1-2.2 2.3-2.2 1.1 0 2 .8 2.2 1.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12.5 6.1 4.2 19.4h16.6L12.5 6.1Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 6.1V3.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span>가상피팅으로 입어보기</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="m9 6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
