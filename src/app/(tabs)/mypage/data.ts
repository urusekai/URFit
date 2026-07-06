import { createClient } from "@/lib/supabase/server";

export type MyPageData = {
  isLoggedIn: boolean;
  name: string;
  handle: string;
  initials: string;
  bodyInfo: string;
  stats: {
    savedLooks: number;
    registeredClothes: number;
    virtualFittings: number;
  };
};

const GUEST_DATA: MyPageData = {
  isLoggedIn: false,
  name: "게스트",
  handle: "",
  initials: "U",
  bodyInfo: "",
  stats: { savedLooks: 0, registeredClothes: 0, virtualFittings: 0 },
};

/** name 문자열에서 아바타용 이니셜(1~2글자, 공백 제거)을 뽑는다. */
function toInitials(name: string): string {
  const trimmed = name.replace(/\s+/g, "");
  return trimmed.length > 0 ? trimmed.slice(0, 2) : "U";
}

export async function getMyPageData(): Promise<MyPageData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return GUEST_DATA;
  }

  const [profileResult, clothesResult, savedLooksResult, fittingsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("clothes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("saved_looks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("fittings").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const profile = profileResult.data;
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;

  const name =
    profile?.name ||
    (typeof metadata.full_name === "string" ? metadata.full_name : undefined) ||
    (typeof metadata.name === "string" ? metadata.name : undefined) ||
    user.email?.split("@")[0] ||
    "URFit 사용자";

  const metadataHandle = metadata.user_name ?? metadata.preferred_username;
  const handle = profile?.username
    ? `@${profile.username}`
    : typeof metadataHandle === "string" && metadataHandle
      ? `@${metadataHandle}`
      : "";

  const bodyInfoParts: string[] = [];
  if (profile?.height != null) bodyInfoParts.push(`${profile.height}cm`);
  if (profile?.weight != null) bodyInfoParts.push(`${profile.weight}kg`);
  if (profile?.body_type) bodyInfoParts.push(`${profile.body_type} 체형`);

  return {
    isLoggedIn: true,
    name,
    handle,
    initials: toInitials(name),
    bodyInfo: bodyInfoParts.join(" · "),
    stats: {
      savedLooks: savedLooksResult.count ?? 0,
      registeredClothes: clothesResult.count ?? 0,
      virtualFittings: fittingsResult.count ?? 0,
    },
  };
}
