-- 온보딩 저장용 스키마: 프로필(1:1) · 옷(1:N) + 기존 비공개 버킷 스토리지 RLS
-- Supabase 대시보드 > SQL Editor 에 이 파일 전체를 붙여넣어 실행한다(재실행 안전).
-- 이미지 버킷은 이미 존재하는 person_beta_image(전신)·look_beta_image(옷)를 사용한다.
-- 모든 접근은 auth.uid() 기준 RLS로 본인 데이터로 제한된다.

-- ─────────────────────────────────────────────
-- 1) 프로필 — auth.users 와 1:1
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  gender text check (gender in ('male', 'female')),
  height integer,
  weight integer,
  age integer,
  style text,
  brands text[] not null default '{}',
  body_photo_url text,
  name text,
  username text,
  body_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 이미 생성된 DB(테이블이 create if not exists로 스킵되는 경우)에도 새 컬럼을 반영한다.
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists body_type text;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 2) 옷 — auth.users 와 1:N
-- ─────────────────────────────────────────────
create table if not exists public.clothes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_url text,
  category text,
  material text,
  fit text,
  size text,
  -- 카테고리마다 치수 항목이 달라(상의: 어깨/가슴/총장, 신발: 발길이/발볼 …)
  -- 고정 컬럼 대신 항목명→값(cm/mm) 맵을 jsonb로 저장한다.
  measurements jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.clothes enable row level security;

drop policy if exists "clothes_select_own" on public.clothes;
drop policy if exists "clothes_insert_own" on public.clothes;
drop policy if exists "clothes_update_own" on public.clothes;
drop policy if exists "clothes_delete_own" on public.clothes;

create policy "clothes_select_own" on public.clothes
  for select using (auth.uid() = user_id);
create policy "clothes_insert_own" on public.clothes
  for insert with check (auth.uid() = user_id);
create policy "clothes_update_own" on public.clothes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "clothes_delete_own" on public.clothes
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3) 저장한 룩 — auth.users 와 1:N (마이페이지 통계용)
-- ─────────────────────────────────────────────
create table if not exists public.saved_looks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.saved_looks enable row level security;

drop policy if exists "saved_looks_select_own" on public.saved_looks;
drop policy if exists "saved_looks_insert_own" on public.saved_looks;
drop policy if exists "saved_looks_delete_own" on public.saved_looks;

create policy "saved_looks_select_own" on public.saved_looks
  for select using (auth.uid() = user_id);
create policy "saved_looks_insert_own" on public.saved_looks
  for insert with check (auth.uid() = user_id);
create policy "saved_looks_delete_own" on public.saved_looks
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4) 가상 피팅 — auth.users 와 1:N (마이페이지 통계용)
-- ─────────────────────────────────────────────
create table if not exists public.fittings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.fittings enable row level security;

drop policy if exists "fittings_select_own" on public.fittings;
drop policy if exists "fittings_insert_own" on public.fittings;
drop policy if exists "fittings_delete_own" on public.fittings;

create policy "fittings_select_own" on public.fittings
  for select using (auth.uid() = user_id);
create policy "fittings_insert_own" on public.fittings
  for insert with check (auth.uid() = user_id);
create policy "fittings_delete_own" on public.fittings
  for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 5) 스토리지 RLS — 기존 비공개 버킷의 본인 폴더({uid}/...)만 접근 허용
--    로그인 유저가 서버액션에서 자기 세션으로 업로드할 수 있게 한다.
-- ─────────────────────────────────────────────
drop policy if exists "onboarding_person_select_own" on storage.objects;
drop policy if exists "onboarding_person_insert_own" on storage.objects;
drop policy if exists "onboarding_person_update_own" on storage.objects;
drop policy if exists "onboarding_person_delete_own" on storage.objects;
drop policy if exists "onboarding_look_select_own" on storage.objects;
drop policy if exists "onboarding_look_insert_own" on storage.objects;
drop policy if exists "onboarding_look_update_own" on storage.objects;
drop policy if exists "onboarding_look_delete_own" on storage.objects;

create policy "onboarding_person_select_own" on storage.objects
  for select to authenticated using (
    bucket_id = 'person_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_person_insert_own" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'person_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_person_update_own" on storage.objects
  for update to authenticated using (
    bucket_id = 'person_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_person_delete_own" on storage.objects
  for delete to authenticated using (
    bucket_id = 'person_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "onboarding_look_select_own" on storage.objects
  for select to authenticated using (
    bucket_id = 'look_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_look_insert_own" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'look_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_look_update_own" on storage.objects
  for update to authenticated using (
    bucket_id = 'look_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "onboarding_look_delete_own" on storage.objects
  for delete to authenticated using (
    bucket_id = 'look_beta_image' and (storage.foldername(name))[1] = auth.uid()::text
  );
