# URFit

매일 아침 갈아입어 볼 필요 없어! 추천 코디를 가상으로 입어보고 결정하는 AI 옷장

## Tech Stack

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js Route Handlers (Node.js) |
| DB / Auth | Supabase |
| AI | Gemini API — 텍스트: `gemini-3.5-flash`, 이미지: `gemini-3.1-flash-image` (Nano Banana 2) |
| Weather | OpenWeather API |
| Deploy | Vercel |

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 복사
cp .env.example .env.local

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 프로젝트 구조

```text
src/
├── app/                    # 페이지 + API Route
│   ├── api/
│   │   ├── health/         # 헬스체크
│   │   ├── weather/        # OpenWeather 프록시
│   │   └── ai/generate/    # Gemini API 코디 추천
│   ├── wardrobe/           # 옷장 페이지
│   └── outfit/             # 코디 추천 페이지
├── components/
│   ├── ui/                 # 공통 UI (Button 등)
│   ├── layout/             # Header, Footer
│   └── features/           # 기능별 컴포넌트 (병렬 작업)
│       ├── wardrobe/
│       └── outfit/
├── lib/
│   ├── supabase/           # 클라이언트/서버/미들웨어
│   ├── ai/                 # Gemini API
│   ├── weather/            # OpenWeather
│   └── utils/
├── hooks/                  # 공통 React hooks
├── types/                  # API/DB 타입
└── constants/              # 앱 상수
```

## 3~4인 협업 가이드

### 브랜치 전략

- `main` — 프로덕션 (Vercel Production)
- `develop` — 통합 브랜치 (Vercel Preview)
- `feature/<이름>/<기능>` — 개인 작업 브랜치

예시:

```bash
git checkout develop
git pull
git checkout -b feature/hong/wardrobe-upload
```

### 권장 담당 분리

| 담당 | 주요 경로 |
| --- | --- |
| 팀원 A | `src/components/features/wardrobe/`, `src/app/wardrobe/`, Supabase Storage/테이블 |
| 팀원 B | `src/components/features/outfit/`, `src/app/outfit/`, `src/lib/ai/` |
| 팀원 C | `src/components/ui/`, `src/components/layout/`, `src/lib/weather/`, API 공통 |
| 팀원 D | 인증, Supabase Auth, `src/middleware.ts` (팀에서 분담 조정) |

겹치는 파일(`layout.tsx`, `types/`)은 PR 전에 `develop`을 먼저 merge한 뒤 작업하세요.

### PR 규칙

1. `develop` 대상으로 PR 생성
2. `npm run lint`, `npm run typecheck` 통과
3. 스크린샷 또는 API 응답 예시 첨부
4. `.env` / API 키는 절대 커밋하지 않기

자세한 내용은 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md), [docs/SETUP.md](docs/SETUP.md) 참고.

## 환경 변수

`.env.example`을 복사해 `.env.local`에 값을 채웁니다.

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL (`https://xxx.supabase.co`, `/rest/v1` 없음) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable key (`sb_publishable_...`) |
| `SUPABASE_SECRET_KEY` | Supabase Secret key (`sb_secret_...`, 서버 전용) |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) API 키 |
| `GEMINI_TEXT_MODEL` | 텍스트 추천 모델 (기본: `gemini-3.5-flash`) |
| `GEMINI_IMAGE_MODEL` | 가상 피팅 이미지 모델 (기본: `gemini-3.1-flash-image`) |
| `OPENWEATHER_API_KEY` | OpenWeather API 키 |

## Vercel 배포

1. GitHub 저장소를 Vercel에 연결
2. Production Branch: `main`, Preview Branch: `develop`
3. Environment Variables에 `.env.example` 항목 등록
4. Region: `icn1` (서울) — `vercel.json`에 설정됨

## Supabase 타입 생성

스키마 변경 후 팀 전체가 동일한 타입을 쓰도록 갱신합니다.

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
```

## 스크립트

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run typecheck    # TypeScript 검사
npm run format       # Prettier 포맷
```
