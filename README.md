# URFit

매일 아침 갈아입어 볼 필요 없어! 추천 코디를 가상으로 입어보고 결정하는 AI 옷장

## Tech Stack

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| API | Next.js Route Handlers |
| DB / Auth | Supabase (`@supabase/ssr`) |
| AI | Gemini API (`@google/genai`) |
| Weather | OpenWeather API |

Node.js 24 LTS (`.nvmrc` 참고)

## 빠른 시작

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

`.env.local`에 값을 채운 뒤:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

상세 설정은 [docs/SETUP.md](docs/SETUP.md) 참고.

## API

| Method | Path | 설명 |
| --- | --- | --- |
| GET | `/api/health` | 헬스체크 |
| GET | `/api/weather` | 날씨 조회 (`?city=`, `?country=`) |
| POST | `/api/ai/generate` | 코디 텍스트 추천 (`{ "prompt": "..." }`) |
| POST | `/api/ai/generate-image` | 이미지 생성 (`{ "prompt": "..." }`) |

## 프로젝트 구조

```text
src/
├── app/
│   ├── (auth)/          # 스플래시 · 로그인 · 온보딩
│   ├── (tabs)/          # 메인 앱 (헤더 + 하단 탭)
│   └── api/
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/        # 기능별 UI (팀원 작업 영역)
├── lib/
├── hooks/
├── types/
└── constants/
public/
└── images/
```

- 레이아웃·라우팅: [docs/LAYOUT.md](docs/LAYOUT.md)
- UI 이미지: [docs/ASSETS.md](docs/ASSETS.md)

## 환경 변수

`.env.example`과 동일한 항목을 `.env.local`에 설정합니다.

| 변수 | 필수 |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | 선택 (기본 `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 사용 시 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase 사용 시 |
| `SUPABASE_SECRET_KEY` | 서버 admin 작업 시 |
| `GEMINI_API_KEY` | AI API 사용 시 |
| `GEMINI_TEXT_MODEL` | 선택 (기본 `gemini-3.5-flash`) |
| `GEMINI_IMAGE_MODEL` | 선택 (기본 `gemini-3.1-flash-image`) |
| `OPENWEATHER_API_KEY` | 날씨 API 사용 시 |
| `OPENWEATHER_DEFAULT_CITY` | 선택 (기본 `Seoul`) |
| `OPENWEATHER_DEFAULT_COUNTRY` | 선택 (기본 `KR`) |

## 스크립트

```bash
npm run dev           # 개발 서버
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run format        # Prettier
npm run format:check  # Prettier 검사
```
