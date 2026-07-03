import Link from "next/link";
import { ROUTES } from "@/constants/app";
import type { OutfitRecommendation } from "@/lib/mock/ai-recommendation";

export function AiRecommendationCard({
  recommendation,
}: {
  recommendation: OutfitRecommendation;
}) {
  return (
    <section className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl bg-surface-muted">
      <div className="flex items-center gap-1.5 p-4">
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-charcoal">
          {recommendation.styleTag}
        </span>
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-accent">
          {recommendation.matchPercent}% 어울림
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="6.5" r="2.6" stroke="#b0876a" strokeWidth="1.4" />
          <path
            d="M8 21v-6.2L6 12l1.6-3.5c.5-1.1 1.6-1.8 2.8-1.8h3.2c1.2 0 2.3.7 2.8 1.8L18 12l-2 2.8V21"
            stroke="#b0876a"
            strokeWidth="1.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M9.5 21v-5.5M14.5 21v-5.5"
            stroke="#b0876a"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative flex flex-col gap-2 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent p-4 pt-8">
        <div>
          <h3 className="text-base font-bold text-white">{recommendation.title}</h3>
          <p className="mt-1 text-sm leading-6 text-white/85">{recommendation.description}</p>
        </div>
        <Link
          href={ROUTES.fitting}
          className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
        >
          {recommendation.ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m9 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
