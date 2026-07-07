import {
  SavedExperience,
  type SavedLookItem,
} from "@/components/features/saved/SavedExperience";
import { getCurrentUserId, getWardrobe } from "@/lib/fitting";
import { getSavedLooks } from "@/lib/fitting/savedLooks";

function formatSavedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export default async function SavedPage() {
  const userId = await getCurrentUserId();
  const [savedLooks, wardrobe] = await Promise.all([
    getSavedLooks(userId),
    getWardrobe(userId),
  ]);
  const clothById = new Map(wardrobe.map((cloth) => [cloth.id, cloth]));
  const looks: SavedLookItem[] = savedLooks.map((look) => ({
    id: look.id,
    title: look.name,
    savedAt: formatSavedDate(look.createdAt),
    isFavorite: look.isFavorite,
    imageUrl: look.resultImageUrl,
    garments: look.clothIds.map((clothId) => {
      const cloth = clothById.get(clothId);

      return {
        id: clothId,
        name: cloth?.name ?? "삭제된 옷",
        category: cloth?.category,
        imageUrl: cloth?.imageUrl,
      };
    }),
    palette: {
      top: "#efe5d7",
      bottom: "#dbccb8",
      skin: "#f0cebd",
      hair: "#19130f",
      shoe: "#f8f8f8",
    },
  }));

  return <SavedExperience initialLooks={looks} />;
}
