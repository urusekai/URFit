import Image from "next/image";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getMyPageData } from "./data";

/** 설정 리스트 우측의 chevron. */
function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-5 text-muted">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 설정 리스트 좌측 아이콘 — 디자인 제공 SVG(icons__1~6). */
function RowIcon({ src }: { src: string }) {
  return <Image src={src} alt="" aria-hidden width={20} height={20} className="size-5" />;
}

/** 순수 CSS 토글 — 시각적으로 ON 상태만 표현(기능 없음). */
function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center">
      <input type="checkbox" defaultChecked={defaultChecked} disabled className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-border transition peer-checked:bg-accent" />
      <span className="absolute left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </label>
  );
}

type SettingRow = {
  icon: ReactNode;
  label: string;
  right?: ReactNode;
};

const settingRows: SettingRow[] = [
  { icon: <RowIcon src="/images/icons/icons__1.svg" />, label: "신체 정보 수정" },
  { icon: <RowIcon src="/images/icons/icons__2.svg" />, label: "스타일 취향 수정" },
  {
    icon: <RowIcon src="/images/icons/icons__3.svg" />,
    label: "알림 설정",
    right: <ToggleSwitch defaultChecked />,
  },
  { icon: <RowIcon src="/images/icons/icons__4.svg" />, label: "개인정보 · 보안" },
  { icon: <RowIcon src="/images/icons/icons__5.svg" />, label: "설정" },
  { icon: <RowIcon src="/images/icons/icons__6.svg" />, label: "고객센터" },
];

export default async function MyPage() {
  const data = await getMyPageData();

  return (
    <>
      <PageHeader title="MY" />

      <div className="space-y-4 pt-4">
        {/* 프로필 카드 */}
        <section className="flex items-center gap-3 rounded-2xl border border-border p-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-base font-bold text-white">
            {data.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold text-foreground">{data.name}</p>
            {data.handle !== "" && <p className="truncate text-sm text-muted">{data.handle}</p>}
          </div>
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground"
          >
            프로필 수정
          </button>
        </section>

        {/* 통계 3분할 카드 */}
        <section className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border">
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-bold text-foreground">{data.stats.savedLooks}</span>
            <span className="text-xs text-muted">저장한 룩</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-bold text-foreground">{data.stats.registeredClothes}</span>
            <span className="text-xs text-muted">등록한 옷</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-5">
            <span className="text-2xl font-bold text-foreground">{data.stats.virtualFittings}</span>
            <span className="text-xs text-muted">가상 피팅</span>
          </div>
        </section>

        {/* 신체 정보 요약 카드 */}
        <section className="rounded-xl bg-off-white p-4">
          <p className="text-xs text-muted">신체 정보</p>
          {data.bodyInfo !== "" ? (
            <p className="mt-1 text-base font-bold text-foreground">{data.bodyInfo}</p>
          ) : (
            <p className="mt-1 text-base font-bold text-muted">신체 정보를 등록해 주세요</p>
          )}
        </section>

        {/* 설정 리스트 */}
        <section className="divide-y divide-border">
          {settingRows.map((row) => {
            const content = (
              <>
                <span className="flex items-center gap-3">
                  {row.icon}
                  <span className="text-[15px] font-medium text-charcoal">{row.label}</span>
                </span>
                {row.right ?? <ChevronRightIcon />}
              </>
            );

            // 우측에 토글 등 자체 인터랙티브 요소가 있는 행은 button으로 감싸지 않는다(중첩 인터랙티브 방지).
            return row.right ? (
              <div key={row.label} className="flex items-center justify-between py-[18px]">
                {content}
              </div>
            ) : (
              <button
                key={row.label}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between py-[18px]"
              >
                {content}
              </button>
            );
          })}
        </section>

        {/* 로그아웃 */}
        <form action="/api/auth/signout" method="post" className="flex justify-center pb-4">
          <button type="submit" className="cursor-pointer text-sm text-muted">
            로그아웃
          </button>
        </form>
      </div>
    </>
  );
}
