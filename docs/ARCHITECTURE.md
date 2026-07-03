# 아키텍처 개요

## 레이어

```text
[Browser]
   ↓
[src/app/* pages]  ←→  [src/components/features/*]
   ↓
[src/app/api/*]  →  [src/lib/*]  →  External APIs
                         ├── supabase
                         ├── ai/gemini
                         └── weather/openweather
```

## 원칙

1. **클라이언트에서 외부 API 키 직접 호출 금지** — OpenWeather, Gemini API는 Route Handler 경유
2. **Supabase** — 브라우저는 `lib/supabase/client.ts`, 서버는 `lib/supabase/server.ts`
3. **타입** — API 응답은 `src/types/api.ts`, DB는 `src/types/database.ts`
4. **환경 변수** — `src/lib/env.ts`에서 검증, 서버 전용 키는 `NEXT_PUBLIC_` 접두사 없음

## API 규칙

응답 형식:

```json
{ "ok": true, "data": { } }
{ "ok": false, "error": "message" }
```

## 배포

- Vercel Serverless (Node.js runtime)
- Region: `icn1`
- Preview: `develop` 브랜치
- Production: `main` 브랜치
