"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Chip } from "@/components/ui/Chip";
import "swiper/css";
import "swiper/css/free-mode";

export type ChipSwiperOption<T extends string> = {
  value: T;
  label: string;
};

type ChipSwiperProps<T extends string> = {
  options: ChipSwiperOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

/** 한 줄 가로 스와이프 칩 목록 — 줄바꿈 없이 스크롤 */
export function ChipSwiper<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "카테고리 선택",
}: ChipSwiperProps<T>) {
  return (
    <nav className="max-w-full overflow-hidden" aria-label={ariaLabel}>
      <Swiper
        modules={[FreeMode]}
        freeMode
        slidesPerView="auto"
        spaceBetween={8}
        className="w-full !overflow-hidden"
      >
        {options.map((option) => (
          <SwiperSlide key={option.value} className="!w-auto">
            <Chip selected={value === option.value} onClick={() => onChange(option.value)}>
              {option.label}
            </Chip>
          </SwiperSlide>
        ))}
      </Swiper>
    </nav>
  );
}
