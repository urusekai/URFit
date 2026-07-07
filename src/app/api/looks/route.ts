import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/fitting";
import {
  deleteSavedLook,
  getSavedLooks,
  saveLook,
  setLookFavorite,
} from "@/lib/fitting/savedLooks";
import type { ApiResponse } from "@/types/api";
import type { SavedLookRecord } from "@/lib/fitting/savedLooks";

export const runtime = "nodejs";

const bodySchema = z.object({
  name: z.string().min(1).max(24),
  clothIds: z.array(z.string()).min(1),
  image: z.string().min(1),
  mimeType: z.string().min(1).default("image/png"),
});

const deleteBodySchema = z.object({
  id: z.string().min(1),
});

const patchBodySchema = z.object({
  id: z.string().min(1),
  isFavorite: z.boolean(),
});

function jsonResponse<T>(body: ApiResponse<T>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function GET() {
  const userId = await getCurrentUserId();
  const looks = await getSavedLooks(userId);

  return jsonResponse({ ok: true, data: { looks } });
}

export async function POST(request: Request) {
  let requestBody: z.infer<typeof bodySchema>;

  try {
    requestBody = bodySchema.parse(await request.json());
  } catch {
    return jsonResponse({ ok: false, error: "잘못된 저장 요청입니다." }, 400);
  }

  const userId = await getCurrentUserId();
  const look = await saveLook({
    userId,
    name: requestBody.name.trim(),
    clothIds: requestBody.clothIds,
    imageBase64: requestBody.image,
    mimeType: requestBody.mimeType,
  });

  if (!look) {
    return jsonResponse({ ok: false, error: "룩을 저장하지 못했습니다." }, 500);
  }

  revalidatePath("/saved");
  return jsonResponse<{ look: SavedLookRecord }>({ ok: true, data: { look } });
}

export async function PATCH(request: Request) {
  let requestBody: z.infer<typeof patchBodySchema>;

  try {
    requestBody = patchBodySchema.parse(await request.json());
  } catch {
    return jsonResponse({ ok: false, error: "잘못된 요청입니다." }, 400);
  }

  const userId = await getCurrentUserId();
  const updated = await setLookFavorite(
    userId,
    requestBody.id,
    requestBody.isFavorite,
  );

  if (!updated) {
    return jsonResponse(
      { ok: false, error: "룩을 찾을 수 없습니다." },
      404,
    );
  }

  revalidatePath("/saved");
  return jsonResponse<{ id: string; isFavorite: boolean }>({
    ok: true,
    data: { id: requestBody.id, isFavorite: requestBody.isFavorite },
  });
}

export async function DELETE(request: Request) {
  let requestBody: z.infer<typeof deleteBodySchema>;

  try {
    requestBody = deleteBodySchema.parse(await request.json());
  } catch {
    return jsonResponse({ ok: false, error: "잘못된 삭제 요청입니다." }, 400);
  }

  const userId = await getCurrentUserId();
  const deleted = await deleteSavedLook(userId, requestBody.id);

  if (!deleted) {
    return jsonResponse({ ok: false, error: "룩을 삭제하지 못했습니다." }, 404);
  }

  revalidatePath("/saved");
  return jsonResponse<{ id: string }>({ ok: true, data: { id: requestBody.id } });
}
