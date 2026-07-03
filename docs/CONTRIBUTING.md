# 협업 가이드

## 브랜치

| 브랜치 | 용도 |
| --- | --- |
| `main` | 배포용 안정 브랜치 |
| `develop` | 통합 개발 브랜치 |
| `feature/*` | 기능 개발 |
| `fix/*` | 버그 수정 |

## 커밋 메시지 (권장)

```text
feat(wardrobe): 옷 이미지 업로드 폼 추가
fix(api): OpenWeather 401 에러 처리
chore: prettier 설정 추가
docs: SETUP 가이드 보완
```

## 작업 전 체크리스트

- [ ] `develop`에서 최신 pull
- [ ] `feature/<이름>/<기능>` 브랜치 생성
- [ ] 담당 폴더 외 수정 시 팀원과 사전 공유

## PR 체크리스트

- [ ] `npm run lint` 통과
- [ ] `npm run typecheck` 통과
- [ ] 환경 변수/시크릿 미포함
- [ ] 변경 범위와 테스트 방법 기재

## 충돌 줄이는 규칙

1. **기능별 폴더** — `src/components/features/<기능>/` 안에서 작업
2. **공통 타입** — `src/types/` 변경은 PR에 이유 명시
3. **API 추가** — `src/app/api/<도메인>/route.ts` 패턴 유지
4. **DB 스키마** — Supabase migration + `database.ts` 타입 갱신을 한 PR에

## 코드 리뷰

- 1명 이상 Approve 후 merge
- 리뷰는 24시간 내 응답 목표
- 큰 PR은 300줄 이하로 쪼개기

## 담당 영역 (예시, 팀에서 조정)

| 멤버 | 영역 |
| --- | --- |
| A | Wardrobe UI + Supabase Storage/DB |
| B | Outfit UI + Gemini API 연동 |
| C | 공통 UI, Layout, Weather, API 인프라 |

담당은 고정이 아니라 **폴더 단위 소유권**으로 이해하면 됩니다.
