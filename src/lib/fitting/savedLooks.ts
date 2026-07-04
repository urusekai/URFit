import {
  createSignedUrl,
  deleteStorageObjects,
  fetchStorageText,
  getStorageConfig,
  uploadStorageObject,
} from "@/lib/supabase/storage";

const SAVED_LOOK_BUCKET = "look_beta_image";
const SAVED_LOOK_ROOT = "saved";
const MANIFEST_FILE_NAME = "manifest.json";

export type SavedLookRecord = {
  id: string;
  userId: string;
  name: string;
  clothIds: string[];
  resultImagePath: string;
  resultImageUrl?: string;
  createdAt: string;
  isFavorite: boolean;
};

type SavedLookManifest = {
  looks: SavedLookRecord[];
};

type SaveLookInput = {
  userId: string;
  name: string;
  clothIds: string[];
  imageBase64: string;
  mimeType: string;
};

function getUserRoot(userId: string) {
  return `${SAVED_LOOK_ROOT}/${userId}`;
}

function getManifestPath(userId: string) {
  return `${getUserRoot(userId)}/${MANIFEST_FILE_NAME}`;
}

function getImageExtension(mimeType: string) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return "png";
}

function parseManifest(text: string | undefined): SavedLookManifest {
  if (!text) {
    return { looks: [] };
  }

  try {
    const parsed = JSON.parse(text) as Partial<SavedLookManifest>;
    return { looks: Array.isArray(parsed.looks) ? parsed.looks : [] };
  } catch {
    return { looks: [] };
  }
}

function sortLooksByCreatedAt(looks: SavedLookRecord[]) {
  return [...looks].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

async function readManifest(userId: string) {
  const config = getStorageConfig();
  if (!config) {
    return { looks: [] };
  }

  const text = await fetchStorageText(
    config,
    SAVED_LOOK_BUCKET,
    getManifestPath(userId),
  );

  return parseManifest(text);
}

async function writeManifest(userId: string, manifest: SavedLookManifest) {
  const config = getStorageConfig();
  if (!config) {
    return false;
  }

  return uploadStorageObject(
    config,
    SAVED_LOOK_BUCKET,
    getManifestPath(userId),
    Buffer.from(JSON.stringify(manifest, null, 2), "utf8"),
    "application/json",
  );
}

export async function getSavedLooks(userId: string): Promise<SavedLookRecord[]> {
  const config = getStorageConfig();
  if (!config) {
    return [];
  }

  const manifest = await readManifest(userId);
  const looks = await Promise.all(
    sortLooksByCreatedAt(manifest.looks).map(async (look) => ({
      ...look,
      resultImageUrl:
        (await createSignedUrl(
          config,
          SAVED_LOOK_BUCKET,
          look.resultImagePath,
        )) ?? look.resultImageUrl,
    })),
  );

  return looks;
}

export async function saveLook({
  userId,
  name,
  clothIds,
  imageBase64,
  mimeType,
}: SaveLookInput): Promise<SavedLookRecord | undefined> {
  const config = getStorageConfig();
  if (!config) {
    return undefined;
  }

  const createdAt = new Date().toISOString();
  const id = `look-${Date.now()}`;
  const imagePath = `${getUserRoot(userId)}/${id}.${getImageExtension(mimeType)}`;
  const imageBuffer = Buffer.from(imageBase64, "base64");
  const uploaded = await uploadStorageObject(
    config,
    SAVED_LOOK_BUCKET,
    imagePath,
    imageBuffer,
    mimeType,
  );

  if (!uploaded) {
    return undefined;
  }

  const signedUrl = await createSignedUrl(config, SAVED_LOOK_BUCKET, imagePath);
  const nextLook: SavedLookRecord = {
    id,
    userId,
    name,
    clothIds,
    resultImagePath: imagePath,
    resultImageUrl: signedUrl,
    createdAt,
    isFavorite: false,
  };
  const manifest = await readManifest(userId);
  const nextManifest = {
    looks: sortLooksByCreatedAt([nextLook, ...manifest.looks]),
  };
  const savedManifest = await writeManifest(userId, nextManifest);

  return savedManifest ? nextLook : undefined;
}

export async function deleteSavedLook(userId: string, lookId: string): Promise<boolean> {
  const config = getStorageConfig();
  if (!config) {
    return false;
  }

  const manifest = await readManifest(userId);
  const targetLook = manifest.looks.find((look) => look.id === lookId);

  if (!targetLook) {
    return false;
  }

  const nextManifest = {
    looks: manifest.looks.filter((look) => look.id !== lookId),
  };
  const savedManifest = await writeManifest(userId, nextManifest);

  if (!savedManifest) {
    return false;
  }

  await deleteStorageObjects(config, SAVED_LOOK_BUCKET, [
    targetLook.resultImagePath,
  ]);

  return true;
}
