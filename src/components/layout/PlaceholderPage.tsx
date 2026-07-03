type PlaceholderPageProps = {
  description?: string;
  /** 기능 구현 담당자가 참고할 컴포넌트/폴더 경로 */
  workArea?: string;
};

/** 빈 페이지 템플릿 — 담당자가 실제 UI로 교체하기 전까지 사용합니다. */
export function PlaceholderPage({ description, workArea }: PlaceholderPageProps) {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      {description ? <p className="max-w-xs text-sm leading-6 text-muted">{description}</p> : null}
      {workArea ? (
        <p className="rounded-full bg-surface-muted/60 px-3 py-1 font-mono text-xs text-muted">
          {workArea}
        </p>
      ) : null}
    </section>
  );
}
