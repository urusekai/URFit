"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { updateMyProfile } from "./actions";
import type { MyPageData } from "./data";

type ProfileDetails = MyPageData["profile"];
type ModalType = "body" | "style";
type EditableProfile = {
  gender: string;
  height: string;
  weight: string;
  age: string;
  bodyType: string;
  style: string;
  brands: string[];
};

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-5 text-muted">
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RowIcon({ src }: { src: string }) {
  return <Image src={src} alt="" aria-hidden width={20} height={20} className="size-5" />;
}

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center">
      <input type="checkbox" defaultChecked={defaultChecked} disabled className="peer sr-only" />
      <span className="absolute inset-0 rounded-full bg-border transition peer-checked:bg-accent" />
      <span className="absolute left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </label>
  );
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="min-w-0 text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function formatGender(gender: string | null) {
  if (gender === "male") return "남성";
  if (gender === "female") return "여성";
  return "미입력";
}

function formatNumber(value: number | null, unit: string) {
  return value == null ? "미입력" : `${value}${unit}`;
}

const STYLE_OPTIONS = ["캐주얼", "스트릿", "미니멀", "댄디"];
const BRAND_OPTIONS = [
  "핫핑",
  "Wconcept",
  "유니클로",
  "나이키",
  "H&M",
  "무신사 스탠다드",
  "아디다스",
];

function toEditableProfile(profile: ProfileDetails): EditableProfile {
  return {
    gender: profile.gender ?? "",
    height: profile.height == null ? "" : String(profile.height),
    weight: profile.weight == null ? "" : String(profile.weight),
    age: profile.age == null ? "" : String(profile.age),
    bodyType: profile.bodyType ?? "",
    style: profile.style ?? "",
    brands: profile.brands,
  };
}

function toNullableNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-sm font-semibold text-muted">{children}</label>;
}

function TextInput({
  value,
  onChange,
  unit,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  label: string;
}) {
  return (
    <div className="relative">
      <input
        aria-label={label}
        value={value}
        inputMode={unit ? "numeric" : "text"}
        onChange={(event) =>
          onChange(unit ? event.target.value.replace(/[^0-9]/g, "") : event.target.value)
        }
        className="h-11 w-full rounded-xl border border-border bg-white px-3 pr-10 text-sm font-semibold text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
      {unit ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">
          {unit}
        </span>
      ) : null}
    </div>
  );
}

function ProfileModal({
  type,
  profile,
  onClose,
  onSaved,
}: {
  type: ModalType;
  profile: ProfileDetails;
  onClose: () => void;
  onSaved: () => void;
}) {
  const title = type === "body" ? "신체 정보" : "스타일 취향";
  const [draft, setDraft] = useState(() => toEditableProfile(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  function updateDraft(next: Partial<EditableProfile>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  function toggleBrand(brand: string) {
    updateDraft({
      brands: draft.brands.includes(brand)
        ? draft.brands.filter((item) => item !== brand)
        : [...draft.brands, brand],
    });
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateMyProfile({
        gender: draft.gender || null,
        height: toNullableNumber(draft.height),
        weight: toNullableNumber(draft.weight),
        age: toNullableNumber(draft.age),
        bodyType: draft.bodyType.trim() || null,
        style: draft.style || null,
        brands: draft.brands,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      onClose();
      onSaved();
    });
  }

  return (
    <div className="fixed inset-x-0 top-0 bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-[60]">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-charcoal/30"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute bottom-0 left-1/2 flex max-h-[calc(100dvh_-_7.75rem_-_env(safe-area-inset-bottom))] w-full max-w-md -translate-x-1/2 flex-col overflow-hidden rounded-t-[32px] bg-white px-5 pb-8 pt-4 shadow-[0_-18px_48px_rgba(0,0,0,0.12)]"
      >
        <div className="mx-auto h-1.5 w-14 rounded-full bg-surface-muted" />
        <div className="mt-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">{title}</h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-off-white text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 min-h-0 overflow-y-auto rounded-xl bg-off-white px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {type === "body" && !isEditing ? (
            <>
              <InfoRow label="성별" value={formatGender(profile.gender)} />
              <InfoRow label="키" value={formatNumber(profile.height, "cm")} />
              <InfoRow label="몸무게" value={formatNumber(profile.weight, "kg")} />
              <InfoRow label="나이" value={formatNumber(profile.age, "세")} />
              <InfoRow label="체형" value={profile.bodyType ? `${profile.bodyType} 체형` : "미입력"} />
            </>
          ) : null}
          {type === "style" && !isEditing ? (
            <>
              <InfoRow label="선호 스타일" value={profile.style ?? "미입력"} />
              <InfoRow
                label="주 이용 쇼핑몰"
                value={
                  profile.brands.length > 0 ? (
                    <span className="inline-flex max-w-[190px] flex-wrap justify-end gap-1">
                      {profile.brands.map((brand) => (
                        <span key={brand} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-foreground">
                          {brand}
                        </span>
                      ))}
                    </span>
                  ) : (
                    "미입력"
                  )
                }
              />
            </>
          ) : null}
          {type === "body" && isEditing ? (
            <div className="space-y-4 py-4">
              <div>
                <FieldLabel>성별</FieldLabel>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { label: "여성", value: "female" },
                    { label: "남성", value: "male" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateDraft({ gender: option.value })}
                      className={[
                        "h-11 rounded-xl border text-sm font-semibold",
                        draft.gender === option.value
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-white text-foreground",
                      ].join(" ")}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>키</FieldLabel>
                  <div className="mt-2">
                    <TextInput label="키" value={draft.height} unit="cm" onChange={(height) => updateDraft({ height })} />
                  </div>
                </div>
                <div>
                  <FieldLabel>몸무게</FieldLabel>
                  <div className="mt-2">
                    <TextInput label="몸무게" value={draft.weight} unit="kg" onChange={(weight) => updateDraft({ weight })} />
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>나이</FieldLabel>
                <div className="mt-2">
                  <TextInput label="나이" value={draft.age} unit="세" onChange={(age) => updateDraft({ age })} />
                </div>
              </div>
              <div>
                <FieldLabel>체형</FieldLabel>
                <div className="mt-2">
                  <TextInput label="체형" value={draft.bodyType} onChange={(bodyType) => updateDraft({ bodyType })} />
                </div>
              </div>
            </div>
          ) : null}
          {type === "style" && isEditing ? (
            <div className="space-y-5 py-4">
              <div>
                <FieldLabel>선호 스타일</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => updateDraft({ style })}
                      className={[
                        "h-9 rounded-full border px-3 text-sm font-semibold",
                        draft.style === style
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-white text-foreground",
                      ].join(" ")}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>주 이용 쇼핑몰</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BRAND_OPTIONS.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className={[
                        "h-9 rounded-full border px-3 text-sm font-semibold",
                        draft.brands.includes(brand)
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-white text-foreground",
                      ].join(" ")}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-3 text-center text-sm font-semibold text-red-500">{error}</p> : null}

        <div className="mt-4 flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(toEditableProfile(profile));
                  setIsEditing(false);
                  setError(null);
                }}
                disabled={isPending}
                className="h-12 flex-1 cursor-pointer rounded-[14px] border border-border bg-white text-[15px] font-extrabold text-foreground disabled:cursor-wait disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="h-12 flex-1 cursor-pointer rounded-[14px] bg-accent text-[15px] font-extrabold text-white disabled:cursor-wait disabled:opacity-60"
              >
                {isPending ? "저장 중" : "저장하기"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="h-12 w-full cursor-pointer rounded-[14px] bg-accent text-[15px] font-extrabold text-white"
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyPageSettingsList({ profile }: { profile: ProfileDetails }) {
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  function showSaveToast() {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    setIsToastVisible(true);
    toastTimeoutRef.current = window.setTimeout(() => {
      setIsToastVisible(false);
      toastTimeoutRef.current = null;
    }, 2000);
  }

  const settingRows = [
    {
      icon: <RowIcon src="/images/icons/icons__1.svg" />,
      label: "신체 정보 수정",
      onClick: () => setModalType("body"),
    },
    {
      icon: <RowIcon src="/images/icons/icons__2.svg" />,
      label: "스타일 취향 수정",
      onClick: () => setModalType("style"),
    },
    {
      icon: <RowIcon src="/images/icons/icons__3.svg" />,
      label: "알림 설정",
      right: <ToggleSwitch defaultChecked />,
    },
    { icon: <RowIcon src="/images/icons/icons__4.svg" />, label: "개인정보 · 보안" },
    { icon: <RowIcon src="/images/icons/icons__5.svg" />, label: "설정" },
    { icon: <RowIcon src="/images/icons/icons__6.svg" />, label: "고객센터" },
  ];

  return (
    <>
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

          if (row.right) {
            return (
              <div key={row.label} className="flex items-center justify-between py-[18px]">
                {content}
              </div>
            );
          }

          return (
            <button
              key={row.label}
              type="button"
              onClick={row.onClick}
              className="flex w-full cursor-pointer items-center justify-between py-[18px]"
            >
              {content}
            </button>
          );
        })}
      </section>

      {modalType ? (
        <ProfileModal
          type={modalType}
          profile={profile}
          onClose={() => setModalType(null)}
          onSaved={showSaveToast}
        />
      ) : null}
      {isToastVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[calc(5rem_+_env(safe-area-inset-bottom)_+_16px)] left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#202124] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
        >
          저장이 완료되었습니다
        </div>
      ) : null}
    </>
  );
}
