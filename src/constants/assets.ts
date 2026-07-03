/**
 * UI 정적 이미지 경로 (`public/images/`).
 * 팀에서 공통으로 쓰는 이미지는 여기에 등록해 import 로 재사용하세요.
 *
 * @example
 * import { IMAGES } from "@/constants/assets";
 * <Image src={IMAGES.brand.logo} alt="URFit" width={120} height={32} />
 */
export const IMAGES = {
  brand: {
    logo: "/images/brand/logo.svg",
  },
} as const;
