# UI 이미지 에셋 가이드

앱 UI에서 쓰는 **정적 이미지**는 `public/images/` 아래에 둡니다.  
빌드 없이 URL로 바로 참조할 수 있어 팀원 모두 같은 규칙으로 사용하기 쉽습니다.

## 폴더 구조

```text
public/images/
├── brand/           # 로고, 워드마크, 브랜드 마크
├── icons/           # 버튼·네비·배지 등 UI 아이콘
└── illustrations/   # 히어로, 빈 상태, 온보딩 일러스트
```

| 폴더 | 용도 | 권장 형식 |
| --- | --- | --- |
| `brand/` | 서비스 로고, 심볼 | SVG (가능하면), PNG |
| `icons/` | 작은 UI 아이콘 | SVG |
| `illustrations/` | 큰 그래픽, 설명용 이미지 | SVG, WebP, PNG |

## 파일 이름 규칙

- **kebab-case** 사용: `empty-wardrobe.svg`, `logo-dark.png`
- 의미 있는 이름: `icon-1.png` 대신 `icon-weather.svg`
- 다크 모드 변형이 있으면 접미사: `logo-light.svg`, `logo-dark.svg`

## 코드에서 사용

경로는 `/images/...` 로 시작합니다 (`public` 은 URL에 포함하지 않음).

```tsx
import Image from "next/image";

<Image
  src="/images/brand/logo.svg"
  alt="URFit"
  width={120}
  height={32}
  priority
/>
```

장식용 아이콘처럼 크기가 고정이면 일반 `img` 태그도 가능합니다.

```tsx
<img src="/images/icons/weather.svg" alt="" aria-hidden />
```

## 여기에 두지 않는 것

| 종류 | 위치 |
| --- | --- |
| 파비콘, 앱 아이콘 (브라우저 탭) | `src/app/icon.svg`, `favicon.ico` 등 |
| 사용자가 업로드한 옷 사진 | Supabase Storage (추후) |
| Next.js 기본 보일러플레이트 | `public/*.svg` (정리 예정 시 삭제) |

## 작업 흐름

1. 용도에 맞는 하위 폴더에 이미지 추가
2. 컴포넌트에서 `/images/...` 경로로 참조
3. 자주 쓰는 경로는 `src/constants/assets.ts`에 상수로 등록 (선택)

## 용량·품질

- 아이콘·로고: **SVG** 우선 (확대해도 선명)
- 사진형 UI: **WebP** 우선, 필요 시 PNG
- 불필요하게 큰 원본은 커밋 전에 압축
