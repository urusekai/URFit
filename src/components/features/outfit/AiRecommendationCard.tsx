"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ROUTES } from "@/constants/app";
import type { OutfitRecommendation } from "@/lib/outfit/recommendation";

const EMPTY_RECOMMENDATIONS: OutfitRecommendation[] = [];

export function AiRecommendationCard({
  recommendations = EMPTY_RECOMMENDATIONS,
}: {
  recommendations?: OutfitRecommendation[];
}) {
  const slides = useMemo(
    () => recommendations.filter((item) => item.recommendationImageUrl ?? item.imageUrl),
    [recommendations],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const slideCount = slides.length;
  const activeSlideIndex = slideCount > 0 ? activeIndex % slideCount : 0;
  const recommendation = slides[activeSlideIndex] ?? recommendations[0];
  const hasMultipleSlides = slideCount > 1;

  useEffect(() => {
    if (!hasMultipleSlides || isDragging) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, isDragging, slideCount]);

  if (!recommendation) return null;

  const visualSrc = recommendation.recommendationImageUrl ?? recommendation.imageUrl;
  const visualAlt = recommendation.recommendationImageAlt ?? recommendation.imageAlt ?? "";

  const goToSlide = (nextIndex: number) => {
    if (!hasMultipleSlides) return;

    setActiveIndex((nextIndex + slideCount) % slideCount);
  };

  const startDrag = (clientX: number) => {
    if (!hasMultipleSlides) return;

    dragStartX.current = clientX;
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (dragStartX.current === null) return;

    const distance = clientX - dragStartX.current;
    setDragOffset(Math.max(-72, Math.min(72, distance)));
  };

  const finishDrag = (clientX: number) => {
    if (dragStartX.current === null) return;

    const distance = dragStartX.current - clientX;
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(distance) < 44) return;
    goToSlide(activeSlideIndex + (distance > 0 ? 1 : -1));
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={
          hasMultipleSlides
            ? "relative h-[340px] w-full touch-pan-y overflow-hidden cursor-grab active:cursor-grabbing"
            : "relative h-[340px] w-full overflow-hidden"
        }
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          startDrag(event.clientX);
        }}
        onPointerMove={(event) => {
          moveDrag(event.clientX);
        }}
        onPointerUp={(event) => {
          finishDrag(event.clientX);
        }}
        onPointerCancel={() => {
          dragStartX.current = null;
          setIsDragging(false);
          setDragOffset(0);
        }}
      >
        <div className="absolute left-1/2 top-6 h-[286px] w-[288px] -translate-x-[62%] rotate-[-9deg] rounded-[20px] bg-[#efede9]" />
        <div className="absolute left-1/2 top-1 h-[286px] w-[288px] -translate-x-[36%] rotate-[8deg] rounded-[20px] bg-[#efede9]" />

        <div
          className="absolute left-1/2 top-0 flex h-[322px] w-[292px] items-center justify-center rounded-[20px] bg-[#f7f6f3] shadow-sm transition-transform duration-200"
          style={{ transform: `translateX(calc(-50% + ${dragOffset}px))` }}
        >
          <div className="relative h-[236px] w-[192px] overflow-hidden bg-white">
            {visualSrc ? (
              <Image
                key={visualSrc}
                src={visualSrc}
                alt={visualAlt}
                fill
                sizes="192px"
                className="object-contain p-1 transition-opacity duration-300"
                priority={activeSlideIndex === 0}
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
        {slides.map((slide, index) => (
          <button
            key={`${slide.title}-${index}`}
            type="button"
            aria-label={`${index + 1}번째 추천 보기`}
            aria-current={index === activeSlideIndex ? "true" : undefined}
            className={
              index === activeSlideIndex
                ? "h-1.5 w-5 rounded-full bg-accent transition-all"
                : "size-1.5 rounded-full bg-[#dedbd5] transition-all"
            }
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-[19px] font-extrabold text-foreground">
          {recommendation.title}
        </h3>
        <p className="mt-1.5 text-sm font-semibold leading-5 text-[#6B6B68]">
          {recommendation.description}
        </p>
      </div>

      <Link
        href={ROUTES.fitting}
        className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-accent px-4 text-[17px] font-extrabold text-white transition hover:opacity-90"
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
