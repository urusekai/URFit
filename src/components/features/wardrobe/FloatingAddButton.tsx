type FloatingAddButtonProps = {
  onClick: () => void;
};

/** 하단 탭바 위에 떠 있는 옷 등록 플로팅 버튼. BottomTabBar와 동일한 중앙 정렬 방식을 사용합니다. */
export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 z-40 w-full max-w-md -translate-x-1/2">
      <div className="flex justify-end px-4">
        <button
          type="button"
          aria-label="옷 등록하기"
          onClick={onClick}
          className="pointer-events-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg transition hover:opacity-90"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
