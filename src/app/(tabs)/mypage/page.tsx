import { PageHeader } from "@/components/layout/PageHeader";
import { MyPageSettingsList } from "./MyPageSettingsList";
import { getMyPageData } from "./data";

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
        <MyPageSettingsList profile={data.profile} />

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
