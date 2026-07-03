# 로컬 개발 환경 설정

## 1. 필수 도구

- Node.js 20+ (`.nvmrc` 참고)
- npm 10+
- Git

## 2. 저장소 클론 후 설치

```bash
git clone <repo-url>
cd URFit
npm install
cp .env.example .env.local
```

## 3. Supabase

1. [Supabase Dashboard](https://supabase.com/dashboard)에서 프로젝트 생성
2. Project Settings → API에서 값 복사
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (`https://xxx.supabase.co`, `/rest/v1` 없음)
   - **Publishable key** (`sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. 서버 전용 작업(마이그레이션, admin)이 필요하면 **Secret key** (`sb_secret_...`) → `SUPABASE_SECRET_KEY` (클라이언트 노출 금지)
4. 레거시 `anon` / `service_role` JWT 키는 사용하지 않음

## 4. Gemini API

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 발급
2. `.env.local` 설정:
   - `GEMINI_API_KEY` — 발급받은 API 키 (`AIza...`)
   - `GEMINI_TEXT_MODEL` — 코디 추천 (기본: `gemini-3.5-flash`)
   - `GEMINI_IMAGE_MODEL` — 가상 피팅 (기본: `gemini-3.1-flash-image`)

API 키는 서버 Route Handler에서만 사용합니다. 클라이언트에 노출하지 마세요.

## 5. OpenWeather

1. [OpenWeather](https://openweathermap.org/api)에서 API 키 발급
2. `.env.local`에 `OPENWEATHER_API_KEY` 입력

## 6. 동작 확인

```bash
npm run dev
```

- 헬스체크: `GET http://localhost:3000/api/health`
- 날씨: `GET http://localhost:3000/api/weather`
- AI: `POST http://localhost:3000/api/ai/generate` — body: `{ "prompt": "오늘 출근 코디 추천해줘" }`
- 이미지: `POST http://localhost:3000/api/ai/generate-image` — body: `{ "prompt": "미니멀 출근 코디 가상 피팅 이미지" }`

## 7. Vercel Preview

`develop` 브랜치에 push하면 Preview URL이 생성됩니다. Preview 환경에도 동일한 환경 변수를 등록하세요.
