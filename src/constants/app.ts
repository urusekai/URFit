export const APP_NAME = "URFit";
export const APP_DESCRIPTION =
  "매일 아침 갈아입어 볼 필요 없어! 추천 코디를 가상으로 입어보고 결정하는 AI 옷장";

/** 앱 전역 라우트 — 팀원은 이 상수를 import 해서 경로를 맞춥니다. */
export const ROUTES = {
  splash: "/splash",
  login: "/login",
  onboarding: "/onboarding",
  main: "/",
  closet: "/closet",
  fitting: "/fitting",
  saved: "/saved",
  mypage: "/mypage",
  myFit: "/my-fit",
} as const;

/** 하단 탭 메뉴 (5개, 가운데 피팅 강조) */
export const TAB_ITEMS = [
  { href: ROUTES.main, label: "홈", variant: "default" as const },
  { href: ROUTES.closet, label: "옷장", variant: "default" as const },
  { href: ROUTES.fitting, label: "피팅", variant: "center" as const },
  { href: ROUTES.saved, label: "저장", variant: "default" as const },
  { href: ROUTES.mypage, label: "MY", variant: "default" as const },
];
