import { ClosetView } from "@/components/features/wardrobe/ClosetView";
import { getCurrentUserId, getWardrobe } from "@/lib/fitting";
import { toClosetItems } from "@/lib/wardrobe/catalog";

export default async function ClosetPage() {
  const userId = await getCurrentUserId();
  const clothes = await getWardrobe(userId);

  return <ClosetView initialItems={toClosetItems(clothes)} />;
}
