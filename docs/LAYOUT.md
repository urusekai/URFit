# 레이아웃 · 라우팅 가이드

팀원이 페이지/기능을 나눠 작업할 때 참고하는 공통 레이아웃 규칙입니다.

## 라우트 구조

```text
src/app/
├── layout.tsx              # 루트 (폰트 로드)
├── (auth)/                 # 풀스크린 플로우 — 헤더·하단 탭 없음
│   ├── splash/             # /splash
│   ├── login/              # /login
│   └── onboarding/         # /onboarding
└── (tabs)/                 # 메인 앱 — 하단 5탭 공통 제공
    ├── page.tsx            # /  (오늘의 추천)
    ├── closet/             # /closet
    ├── fitting/             # /fitting
    ├── saved/              # /saved
    ├── mypage/             # /mypage
    └── my-fit/             # /my-fit
```

경로 상수는 `src/constants/app.ts`의 `ROUTES`, `TAB_ITEMS`를 사용합니다.

## 페이지 작성 패턴

`(tabs)` 그룹의 각 페이지는 맨 위에 `PageHeader`를 직접 렌더링합니다. (헤더는 자동으로 붙지 않고, 페이지마다 명시적으로 씁니다.)

```tsx
import { PageHeader } from "@/components/layout/PageHeader";

export default function ClosetPage() {
  return (
    <>
      <PageHeader title="나만의 옷장" />
      {/* 페이지 본문 */}
    </>
  );
}
```

헤더 우측에 버튼이 필요하면 `actions`를 전달합니다. 버튼 스타일은 `HeaderIconButton`을 재사용하세요.

```tsx
import { HeaderIconButton } from "@/components/layout/HeaderIconButton";

<PageHeader
  title="나만의 옷장"
  actions={
    <HeaderIconButton label="검색">
      {/* 검색 아이콘 SVG */}
    </HeaderIconButton>
  }
/>
```

`(auth)` 그룹(스플래시·로그인·온보딩)은 풀스크린 화면이라 `PageHeader`를 쓰지 않습니다.

## 레이아웃 컴포넌트

| 컴포넌트 | 위치 | 용도 | 크기 |
| --- | --- | --- | --- |
| `AuthShell` | `(auth)/layout.tsx` | 풀스크린 컨테이너 (헤더·탭 없음) | — |
| `TabShell` | `(tabs)/layout.tsx` | 본문 + 하단 5탭 컨테이너 | 헤더 높이 64px, 하단 탭 80px |
| `PageHeader` | 각 page.tsx에서 직접 사용 | 로고(38px) + 페이지 제목(`text-lg font-bold`) + 우측 버튼 | 높이 64px |
| `HeaderIconButton` | 헤더 actions 안에서 사용 | 아이콘 버튼 공통 스타일 | 44px 정사각, 아이콘 20~22px 권장 |
| `BottomTabBar` | TabShell 내부 (자동) | 하단 5탭 (가운데 피팅 강조) | 아이콘 24px, 가운데 버튼 56px |
| `PlaceholderPage` | 각 page.tsx | 빈 페이지 안내 문구 | — |

## 하단 탭 (5개, 자동 표시)

| 탭 | 경로 |
| --- | --- |
| 홈 | `/` |
| 옷장 | `/closet` |
| 피팅 (가운데 강조) | `/fitting` |
| 저장 | `/saved` |
| MY | `/mypage` |

## 기능별 작업 폴더

| 화면 | 페이지 | 기능 컴포넌트 |
| --- | --- | --- |
| 오늘의 추천 | `(tabs)/page.tsx` | `features/outfit/` |
| 옷장 | `(tabs)/closet/` | `features/wardrobe/` |
| 피팅 | `(tabs)/fitting/` | `features/fitting/` |
| 저장 | `(tabs)/saved/` | `features/saved/` |
| 마이페이지 | `(tabs)/mypage/` | `features/mypage/` |

페이지는 `page.tsx`에 두고, 실제 UI·로직은 `features/` 아래 컴포넌트로 만들어 페이지에서 조합하세요.

로고: `public/images/brand/logo.svg` (파비콘 `src/app/icon.svg`와 동일)

## 컬러 시스템

`src/app/globals.css`의 `@theme` 토큰입니다. (라이트 테마만 지원, `color-scheme: light`)

| Tailwind 클래스 | 색상 | 용도 |
| --- | --- | --- |
| `bg-white` / `text-white` | `#FFFFFF` | 앱 배경 (헤더·본문·하단 탭 전부 흰색) |
| `bg-off-white` | `#F6F5F2` | 입력창·보조 배경 |
| `bg-surface-muted` / `border-border` | `#E3E2DE` | 칩·보더 |
| `text-muted` | `#6B6B68` | 보조 텍스트 |
| `text-charcoal` | `#2E2E33` | 강조 텍스트 |
| `text-foreground` | `#1A1A1A` | 본문 |
| `bg-accent` / `text-accent` | `#B0876A` | 포인트 |

헤더·본문·하단 탭 사이 **구분선 없음** — 전부 흰 배경으로 이어집니다.

폰트: **Pretendard** (`globals.css`에서 CDN 로드).

## 타이포그래피

별도 컴포넌트 없이 아래 Tailwind 클래스 조합을 그대로 사용합니다.

| 스타일 | 클래스 | 용도 |
| --- | --- | --- |
| 제목 | `text-xl font-semibold text-foreground` | 화면 제목, 섹션 헤딩 (예: "오늘 뭐 입지?") |
| 본문 | `text-sm text-foreground` | 일반 본문 텍스트 |
| 캡션 | `text-xs text-muted` | 브랜드명 · 메타 정보 · 보조 설명 |

## 공통 UI 컴포넌트

`src/components/ui/`에 있는 기본 컴포넌트를 재사용하세요. 새로 만들기 전에 먼저 확인하세요.

| 컴포넌트 | 용도 | 비고 |
| --- | --- | --- |
| `Button` | 주요 액션 버튼 | `variant="primary"`(포인트색, 예: "가상 피팅 시작") / `"secondary"`(아웃라인) |
| `Input` | 텍스트 입력 (검색 등) | `icon` prop으로 좌측 아이콘 추가, 높이 약 48px |
| `Chip` | 카테고리 필터, 토글, 태그 | `selected` prop으로 활성 상태 표시 |

아이콘은 문맥에 따라 다음 크기를 기준으로 맞춰주세요: 헤더 버튼 20~22px, 하단 탭 24px, 리스트·카드 내 인라인 아이콘 16~18px.

```tsx
import { Input } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";

<Input icon={<SearchIcon />} placeholder="브랜드 · 색상 · 카테고리 검색" />

<div className="flex gap-2">
  <Chip selected>전체</Chip>
  <Chip>상의</Chip>
</div>
```

## 새 페이지 추가 시

1. `ROUTES`에 경로 추가
2. 하단 탭에 넣을 경우 `TAB_ITEMS` + `src/components/layout/TabIcon.tsx`에 아이콘 케이스 추가
3. 페이지 맨 위에 `<PageHeader title="..." />` 추가 (탭 화면인 경우)
