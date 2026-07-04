"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/app";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils/cn";
import { saveOnboarding } from "./actions";

const TOTAL_STEPS = 3;

const STEP_TITLES: Record<number, [string, string]> = {
  1: ["기본 정보를", "알려주세요"],
  2: ["전신 사진을 등록하면", "입어볼 수 있어요"],
  3: ["옷 정보를 등록하면", "가상 피팅으로 입어볼 수 있어요"],
};

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

type MeasureDef = { key: string; label: string; default: string };
type CategoryConfig = {
  fitOptions: string[];
  sizeOptions: string[];
  measures: MeasureDef[];
};

/** 카테고리별 핏·사이즈 선택지와 치수 항목. 카테고리를 바꾸면 아래 옷 정보가 이 설정을 따른다. */
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  상의: {
    fitOptions: ["레귤러", "슬림", "루즈", "오버핏"],
    sizeOptions: ["XS", "S", "M", "L", "XL", "XXL"],
    measures: [
      { key: "shoulder", label: "어깨", default: "44" },
      { key: "chest", label: "가슴", default: "54" },
      { key: "length", label: "총장", default: "70" },
    ],
  },
  하의: {
    fitOptions: ["레귤러", "슬림", "와이드", "부츠컷"],
    sizeOptions: ["S", "M", "L", "XL", "28", "30", "32", "34"],
    measures: [
      { key: "waist", label: "허리", default: "78" },
      { key: "hip", label: "엉덩이", default: "98" },
      { key: "length", label: "총장", default: "100" },
    ],
  },
  신발: {
    fitOptions: ["정사이즈", "크게 나옴", "작게 나옴"],
    sizeOptions: ["230", "240", "250", "260", "270", "280"],
    measures: [
      { key: "footLength", label: "발길이", default: "260" },
      { key: "footWidth", label: "발볼", default: "100" },
    ],
  },
  모자: {
    fitOptions: ["프리", "조절"],
    sizeOptions: ["FREE", "55", "57", "59", "61"],
    measures: [
      { key: "head", label: "머리둘레", default: "58" },
      { key: "brim", label: "챙길이", default: "7" },
    ],
  },
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_CONFIG);

/** 카테고리 설정으로 치수 상태 초깃값(항목 key→기본값)을 만든다. */
function defaultMeasures(category: string): Record<string, string> {
  return Object.fromEntries(
    CATEGORY_CONFIG[category].measures.map((m) => [m.key, m.default]),
  );
}

/** 숫자만 입력받고 단위(cm·kg·세)를 우측에 고정 표시하는 입력 필드 */
function NumberField({
  value,
  onChange,
  unit,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  unit: string;
  label: string;
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
        className="w-full rounded-xl border border-border bg-white py-3.5 pl-4 pr-11 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
        {unit}
      </span>
    </div>
  );
}

/** 파일 선택으로 이미지를 불러와 미리보기하는 점선 업로드 박스 */
function PhotoUpload({
  photo,
  onSelect,
  placeholder,
  alt,
  badge,
}: {
  photo: string | null;
  onSelect: (file: File | undefined) => void;
  placeholder: string;
  alt: string;
  badge?: string;
}) {
  return (
    <label className="relative flex aspect-[3/2] w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-border">
      {badge ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-foreground px-3 py-1 text-xs text-white">
          {badge}
        </span>
      ) : null}
      {photo ? (
        // 로컬에서 고른 blob 미리보기라 next/image 최적화 대상이 아니다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : (
        <>
          <Image
            src="/images/icons/image-uplode.svg"
            alt=""
            aria-hidden
            width={30}
            height={30}
            className="h-10 w-10"
          />
          <p className="text-sm text-muted">{placeholder}</p>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onSelect(event.target.files?.[0])}
      />
    </label>
  );
}

/** 옷 치수(어깨·가슴·총장) 숫자 입력 카드 */
function MeasureField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white py-4">
      <span className="text-xs text-muted">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9]/g, ""))}
        className="w-12 rounded bg-transparent text-center text-xl font-bold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}

/** 최초 1회 기본 정보 · 사진 · 옷 정보 등록 3단계 위저드 */
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // 1단계 — 기본 정보
  const [gender, setGender] = useState<"male" | "female">("female");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [style, setStyle] = useState<string | null>("캐주얼");
  const [brands, setBrands] = useState<string[]>(["유니클로", "나이키"]);

  // 2단계 — 전신 사진 (미리보기 URL과 업로드용 원본 File을 함께 보관)
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [bodyPhotoFile, setBodyPhotoFile] = useState<File | null>(null);

  // 3단계 — 옷 정보
  const [clothPhoto, setClothPhoto] = useState<string | null>(null);
  const [clothPhotoFile, setClothPhotoFile] = useState<File | null>(null);
  const [category, setCategory] = useState("상의");
  const [material, setMaterial] = useState("코튼 100%");
  const [fit, setFit] = useState(CATEGORY_CONFIG["상의"].fitOptions[0]);
  const [size, setSize] = useState(CATEGORY_CONFIG["상의"].sizeOptions[0]);
  const [measures, setMeasures] = useState<Record<string, string>>(() =>
    defaultMeasures("상의"),
  );

  const categoryConfig = CATEGORY_CONFIG[category];

  // 저장 진행/오류 상태
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 선택한 이미지의 blob URL은 교체·언마운트 시 해제해 메모리 누수를 막는다.
  useEffect(() => {
    if (!bodyPhoto) return;
    return () => URL.revokeObjectURL(bodyPhoto);
  }, [bodyPhoto]);
  useEffect(() => {
    if (!clothPhoto) return;
    return () => URL.revokeObjectURL(clothPhoto);
  }, [clothPhoto]);

  function selectBodyPhoto(file: File | undefined) {
    if (!file) return;
    setBodyPhoto(URL.createObjectURL(file));
    setBodyPhotoFile(file);
  }

  function selectClothPhoto(file: File | undefined) {
    if (!file) return;
    setClothPhoto(URL.createObjectURL(file));
    setClothPhotoFile(file);
  }

  function toggleBrand(brand: string) {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand],
    );
  }

  /** 카테고리를 바꾸면 그 카테고리의 핏·사이즈·치수 기본값으로 아래 입력을 초기화한다. */
  function changeCategory(next: string) {
    if (next === category) return;
    const config = CATEGORY_CONFIG[next];
    setCategory(next);
    setFit(config.fitOptions[0]);
    setSize(config.sizeOptions[0]);
    setMeasures(defaultMeasures(next));
  }

  function setMeasure(key: string, value: string) {
    setMeasures((prev) => ({ ...prev, [key]: value }));
  }

  /**
   * 입력값을 FormData로 모아 서버액션으로 저장한 뒤 메인으로 이동한다.
   * includeClothes=false면 옷 정보 없이 기본 정보·전신 사진만 저장한다(건너뛰기 경로).
   */
  async function handleSubmit(includeClothes: boolean) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set("gender", gender);
    formData.set("height", height);
    formData.set("weight", weight);
    formData.set("age", age);
    if (style) formData.set("style", style);
    brands.forEach((brand) => formData.append("brands", brand));
    if (bodyPhotoFile) formData.set("bodyPhoto", bodyPhotoFile);

    if (includeClothes) {
      formData.set("category", category);
      formData.set("material", material);
      formData.set("fit", fit);
      formData.set("size", size);
      formData.set("measurements", JSON.stringify(measures));
      if (clothPhotoFile) formData.set("clothPhoto", clothPhotoFile);
    }

    const result = await saveOnboarding(formData);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(ROUTES.main);
  }

  return (
    <div className="flex h-[100svh] flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-6 scrollbar-none">
        {/* 진행바 */}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, index) => index + 1).map((segment) => (
            <div
              key={segment}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                segment <= step ? "bg-accent" : "bg-border",
              )}
            />
          ))}
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-snug text-foreground">
          {STEP_TITLES[step][0]}
          <br />
          {STEP_TITLES[step][1]}
        </h1>
        <p className="mt-2 text-sm text-muted">
          맞춤 코디 추천을 위해 사용돼요 · {step}/{TOTAL_STEPS}
        </p>

        {step === 1 ? (
          <div className="mt-8 flex flex-col gap-8 pb-8">
            <div>
              <label className="text-sm font-medium text-foreground">
                성별 <span className="text-accent">*</span>
              </label>
              <div className="mt-3 flex rounded-2xl bg-off-white p-1">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl py-3 text-sm font-medium transition",
                    gender === "male"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted",
                  )}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl py-3 text-sm font-medium transition",
                    gender === "female"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted",
                  )}
                >
                  여성
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                키 · 몸무게 <span className="text-accent">*</span>
              </label>
              <div className="mt-3 flex gap-3">
                <NumberField value={height} onChange={setHeight} unit="cm" label="키" />
                <NumberField
                  value={weight}
                  onChange={setWeight}
                  unit="kg"
                  label="몸무게"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                나이 <span className="text-accent">*</span>
              </label>
              <div className="mt-3">
                <NumberField value={age} onChange={setAge} unit="세" label="나이" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">평소 스타일</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    selected={style === option}
                    onClick={() => setStyle(option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                자주 입는 브랜드
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {BRAND_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    selected={brands.includes(option)}
                    onClick={() => toggleBrand(option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-8 flex flex-col gap-4 pb-8">
            <PhotoUpload
              photo={bodyPhoto}
              onSelect={selectBodyPhoto}
              placeholder="옷을 입은 전신 사진"
              alt="업로드한 전신 사진"
            />

            <div className="flex gap-3 rounded-xl border border-border p-4">
              <Image
                src="/images/icons/lock.svg"
                alt=""
                aria-hidden
                width={14}
                height={15}
                className="mt-1 h-4 w-4 shrink-0"
              />
              <p className="text-sm leading-relaxed text-muted">
                사진은{" "}
                <span className="font-semibold text-foreground">암호화되어 본인만</span>{" "}
                열람할 수 있어요.
                <br />
                가상피팅을 실행하는 순간에만 안전하게
                <br />
                처리되고{" "}
                <span className="font-semibold text-foreground">원본은 즉시 폐기</span>
                됩니다.
                <br />
                옷을 입은 사진을 등록해 주세요. (나체 사진 아님)
              </p>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-8 flex flex-col gap-6 pb-8">
            <PhotoUpload
              photo={clothPhoto}
              onSelect={selectClothPhoto}
              placeholder="배경 제거된 옷 사진"
              alt="업로드한 옷 사진"
              badge="배경 자동 제거됨"
            />

            <p className="text-sm text-muted">AI가 찾은 정보를 골라서 수정하세요</p>

            <div>
              <label className="text-sm font-medium text-foreground">카테고리</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    selected={category === option}
                    onClick={() => changeCategory(option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-border border-t border-border">
              <div className="flex items-center justify-between py-4">
                <label htmlFor="material" className="text-sm text-muted">
                  소재
                </label>
                <input
                  id="material"
                  value={material}
                  onChange={(event) => setMaterial(event.target.value)}
                  className="w-40 rounded bg-transparent text-right text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div className="flex items-center justify-between py-4">
                <label htmlFor="fit" className="text-sm text-muted">
                  핏
                </label>
                <select
                  id="fit"
                  value={fit}
                  onChange={(event) => setFit(event.target.value)}
                  className="cursor-pointer rounded bg-transparent text-right text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {categoryConfig.fitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-muted">세탁법</span>
                <button
                  type="button"
                  className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-off-white"
                >
                  텍 사진으로 추가
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-off-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">옷 치수</span>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <select
                    value={size}
                    onChange={(event) => setSize(event.target.value)}
                    aria-label="사이즈"
                    className="cursor-pointer rounded bg-transparent text-right text-xs text-muted outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    {categoryConfig.sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span>· {fit}</span>
                </div>
              </div>
              <div
                className={cn(
                  "mt-3 grid gap-3",
                  categoryConfig.measures.length === 2 ? "grid-cols-2" : "grid-cols-3",
                )}
              >
                {categoryConfig.measures.map((measure) => (
                  <MeasureField
                    key={measure.key}
                    label={measure.label}
                    value={measures[measure.key] ?? ""}
                    onChange={(value) => setMeasure(measure.key, value)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 flex flex-col gap-3 border-t border-border bg-white px-6 pb-6 pt-4">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full cursor-pointer rounded-2xl bg-accent py-4 text-base font-semibold text-white transition hover:opacity-90"
          >
            다음
          </button>
        ) : null}

        {step === 2 ? (
          <>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full cursor-pointer rounded-2xl bg-accent py-4 text-base font-semibold text-white transition hover:opacity-90"
            >
              사진 등록하기
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="cursor-pointer text-center text-sm text-muted"
            >
              다음에 등록 할게요
            </button>
          </>
        ) : null}

        {step === 3 ? (
          <>
            {error ? <p className="text-center text-sm text-red-500">{error}</p> : null}
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="w-full cursor-pointer rounded-2xl bg-accent py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "저장 중..." : "옷 정보 등록하기"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="cursor-pointer text-center text-sm text-muted disabled:opacity-60"
            >
              다음에 등록 할게요
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
