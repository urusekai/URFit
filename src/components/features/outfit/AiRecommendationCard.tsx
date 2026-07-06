"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { ROUTES } from "@/constants/app";
import type { OutfitRecommendation } from "@/lib/outfit/recommendation";

const EMPTY_RECOMMENDATIONS: OutfitRecommendation[] = [];
const SWIPE_THRESHOLD = 48;
const DRAG_CLAMP = 80;
const AUTOPLAY_MS = 5000;

// 스택 배치 파라미터
const PEEK_SHIFT = 54; // 이전/다음 카드 좌우 이동(px)
const PEEK_ROTATE = 5; // 이전/다음 카드 회전(도)
const PREV_Y = 8; // 왼쪽(이전) 카드 세로 오프셋
const NEXT_Y = 8; // 오른쪽(다음) 카드 세로 오프셋
const BACK_SCALE = 0.92; // 이전/다음 카드는 메인보다 조금 작게
const FRONT_COLOR = "#F6F5F1"; // 가운데(활성) 카드
const BACK_COLOR = "#EEEDE9"; // 이전/다음(뒤) 카드

type CardLayout = {
  zIndex: number;
  opacity: number;
  background: string;
  transform: string;
  animate: boolean;
};

function getCardLayout(rel: number, dragPx: number, dragging: boolean): CardLayout {
  if (rel === 0) {
    return {
      zIndex: 20,
      opacity: 1,
      background: FRONT_COLOR,
      transform: `translate(calc(-50% + ${dragPx}px), -50%) rotate(${(dragPx * 0.03).toFixed(2)}deg)`,
      animate: !dragging,
    };
  }
  if (rel === -1) {
    return {
      zIndex: 10,
      opacity: 1,
      background: BACK_COLOR,
      transform: `translate(calc(-50% - ${PEEK_SHIFT}px), calc(-50% + ${PREV_Y}px)) rotate(-${PEEK_ROTATE}deg) scale(${BACK_SCALE})`,
      animate: true,
    };
  }
  if (rel === 1) {
    return {
      zIndex: 10,
      opacity: 1,
      background: BACK_COLOR,
      transform: `translate(calc(-50% + ${PEEK_SHIFT}px), calc(-50% + ${NEXT_Y}px)) rotate(${PEEK_ROTATE}deg) scale(${BACK_SCALE})`,
      animate: true,
    };
  }
  // 그 밖의 카드는 옆으로 숨긴다
  const off = rel < 0 ? -170 : 170;
  return {
    zIndex: 0,
    opacity: 0,
    background: BACK_COLOR,
    transform: `translate(calc(-50% + ${off}px), -50%) rotate(${rel < 0 ? "-" : ""}${PEEK_ROTATE}deg) scale(${BACK_SCALE})`,
    animate: true,
  };
}

export function AiRecommendationCard({
  recommendations = EMPTY_RECOMMENDATIONS,
}: {
  recommendations?: OutfitRecommendation[];
}) {
  // 이미지가 있는 추천만 슬라이드로. 없으면 첫 추천 한 장이라도 노출.
  const slides = useMemo(() => {
    const withImage = recommendations.filter(
      (item) => item.recommendationImageUrl ?? item.imageUrl,
    );
    return withImage.length > 0 ? withImage : recommendations.slice(0, 1);
  }, [recommendations]);

  const slideCount = slides.length;
  const hasMultipleSlides = slideCount > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);

  // 5초 자동 넘김 (드래그 중엔 멈춤)
  useEffect(() => {
    if (!hasMultipleSlides || isDragging) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, isDragging, slideCount]);

  if (slideCount === 0) return null;

  const boundedIndex = Math.min(activeIndex, slideCount - 1);
  const active = slides[boundedIndex];

  const goTo = (index: number) => {
    setActiveIndex(((index % slideCount) + slideCount) % slideCount);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasMultipleSlides) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startXRef.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;
    const delta = event.clientX - startXRef.current;
    setDragPx(Math.max(-DRAG_CLAMP, Math.min(DRAG_CLAMP, delta)));
  };

  const handlePointerEnd = () => {
    if (startXRef.current === null) return;
    const delta = dragPx;
    startXRef.current = null;
    setIsDragging(false);
    setDragPx(0);

    if (delta <= -SWIPE_THRESHOLD) {
      goTo(boundedIndex + 1);
    } else if (delta >= SWIPE_THRESHOLD) {
      goTo(boundedIndex - 1);
    }
  };

  const cardBase =
    "absolute left-1/2 top-1/2 h-[252px] w-[236px] rounded-[22px]";

  return (
    <div className="flex flex-col items-center">
      <div
        className={[
          "relative h-[290px] w-full select-none overflow-hidden",
          hasMultipleSlides ? "cursor-grab active:cursor-grabbing" : "",
        ].join(" ")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {slides.map((slide, index) => {
          let rel = index - boundedIndex;
          if (rel > slideCount / 2) rel -= slideCount;
          if (rel < -slideCount / 2) rel += slideCount;

          const layout = getCardLayout(rel, dragPx, isDragging);
          const isActive = rel === 0;
          const src = slide.recommendationImageUrl ?? slide.imageUrl;

          return (
            <div
              key={`${slide.title}-${index}`}
              aria-hidden={!isActive}
              className={[
                cardBase,
                "flex items-center justify-center",
                isActive ? "shadow-[0_8px_18px_rgba(26,26,26,0.06)]" : "",
                layout.animate
                  ? "transition-[transform,opacity] duration-300 ease-out"
                  : "",
              ].join(" ")}
              style={{
                zIndex: layout.zIndex,
                opacity: layout.opacity,
                backgroundColor: layout.background,
                transform: layout.transform,
              }}
            >
              <div className="relative h-[204px] w-[196px]">
                {src ? (
                  <Image
                    src={src}
                    alt={slide.recommendationImageAlt ?? slide.title}
                    fill
                    sizes="196px"
                    className="object-contain"
                    priority={isActive}
                    draggable={false}
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
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.title}-${index}`}
            type="button"
            aria-label={`${index + 1}번째 추천 보기`}
            aria-current={index === boundedIndex ? "true" : undefined}
            className={
              index === boundedIndex
                ? "h-1.5 w-5 rounded-full bg-accent transition-all"
                : "size-1.5 rounded-full bg-[#dedbd5] transition-all"
            }
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-[19px] font-extrabold text-foreground">{active.title}</h3>
        <p className="mt-1.5 text-sm font-semibold leading-5 text-[#6B6B68]">
          {active.description}
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
