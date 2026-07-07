import Image from "next/image";
import { ROUTES } from "@/constants/app";
import { IMAGES } from "@/constants/assets";

type TabIconProps = {
  name: string;
  active?: boolean;
  variant?: "default" | "center";
};

const TAB_ICON_SRC: Record<string, string> = {
  [ROUTES.main]: IMAGES.icons.tab.main,
  [ROUTES.closet]: IMAGES.icons.tab.closet,
  [ROUTES.saved]: IMAGES.icons.tab.saved,
  [ROUTES.mypage]: IMAGES.icons.tab.mypage,
};

/** 부모 Link의 text-accent / text-muted 색(currentColor)을 아이콘에 반영 */
function MaskedTabIcon({ src }: { src: string }) {
  return (
    <span
      className="inline-block size-6 shrink-0 bg-current"
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
      aria-hidden
    />
  );
}

export function TabIcon({ name, variant = "default" }: TabIconProps) {
  if (variant === "center") {
    return (
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent shadow-sm">
        <Image
          src={IMAGES.icons.tab.fitting}
          alt=""
          width={26}
          height={24}
          aria-hidden
        />
      </span>
    );
  }

  const src = TAB_ICON_SRC[name];
  if (!src) return null;

  return <MaskedTabIcon src={src} />;
}
