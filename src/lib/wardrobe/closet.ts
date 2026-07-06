import { createClient } from "@/lib/supabase/server";
import { createSignedUrl, getStorageConfig } from "@/lib/supabase/storage";
import { toClosetItemFromRow, type ClosetItem } from "@/lib/wardrobe/catalog";

// 온보딩 옷 사진이 저장되는 비공개 버킷(actions.ts의 CLOTHES_BUCKET과 동일).
const CLOTHES_BUCKET = "look_beta_image";

/**
 * 로그인한 사용자가 등록한 옷을 옷장 카드용으로 돌려준다.
 * clothes 행은 유저 세션(RLS로 본인 행만)으로 읽고,
 * 사진 표시용 signed URL은 서비스키(storage config)로 발급한다.
 * 로그인 상태가 아니거나 조회에 실패하면 빈 목록.
 */
export async function getMyClosetItems(): Promise<ClosetItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from("clothes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !rows) {
    return [];
  }

  const config = getStorageConfig();

  const items = await Promise.all(
    rows.map(async (row) => {
      const imageUrl =
        config && row.photo_url
          ? await createSignedUrl(config, CLOTHES_BUCKET, row.photo_url)
          : undefined;
      return toClosetItemFromRow(row, imageUrl);
    }),
  );

  return items.filter((item): item is ClosetItem => item !== null);
}
