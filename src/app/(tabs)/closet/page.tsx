import { ClosetView } from "@/components/features/wardrobe/ClosetView";
import { getMyClosetItems } from "@/lib/wardrobe/closet";

export default async function ClosetPage() {
  const items = await getMyClosetItems();

  return <ClosetView initialItems={items} />;
}
