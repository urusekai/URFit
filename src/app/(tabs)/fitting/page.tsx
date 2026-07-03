import {
  FittingExperience,
  type FittingCategory,
  type FittingItem,
} from "@/components/features/fitting/FittingExperience";
import { clientEnv, serverEnv } from "@/lib/env";

const PERSON_IMAGE_PATH = "person_beta_image/female/sample_female_1.png";
const LOOK_IMAGE_BUCKET = "look_beta_image";
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;

type LookFolderConfig = {
  folder: string;
  category: FittingCategory;
  label: string;
  shape: FittingItem["shape"];
  colorClass: string;
};

const lookFolderConfigs: LookFolderConfig[] = [
  {
    folder: "shirts",
    category: "top",
    label: "셔츠",
    shape: "shirt",
    colorClass: "bg-[#f8f8f8]",
  },
  {
    folder: "outers",
    category: "top",
    label: "아우터",
    shape: "jacket",
    colorClass: "bg-[#2f4d70]",
  },
  {
    folder: "pants",
    category: "bottom",
    label: "팬츠",
    shape: "pants",
    colorClass: "bg-[#8ba0b9]",
  },
  {
    folder: "shoes",
    category: "shoes",
    label: "신발",
    shape: "shoes",
    colorClass: "bg-white",
  },
  {
    folder: "caps",
    category: "hat",
    label: "캡",
    shape: "cap",
    colorClass: "bg-[#d7d2ca]",
  },
];

type SupabaseSignedUrlResponse = {
  signedURL?: string;
  signedUrl?: string;
};

type SupabaseStorageObject = {
  name: string;
  metadata?: {
    size?: number;
  };
};

function buildSignedStorageUrl(supabaseUrl: string, signedPath: string) {
  if (signedPath.startsWith("http")) {
    return signedPath;
  }

  if (signedPath.startsWith("/storage/v1")) {
    return `${supabaseUrl}${signedPath}`;
  }

  const normalizedSignedPath = signedPath.startsWith("/")
    ? signedPath
    : `/${signedPath}`;

  return `${supabaseUrl}/storage/v1${normalizedSignedPath}`;
}

function getFileOrder(fileName: string) {
  const match = fileName.match(/_(\d+)\.png$/);

  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

async function createSignedStorageUrl({
  bucket,
  objectPath,
  serviceKey,
  supabaseUrl,
}: {
  bucket: string;
  objectPath: string;
  serviceKey: string;
  supabaseUrl: string;
}) {
  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: SIGNED_URL_EXPIRES_IN_SECONDS }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as SupabaseSignedUrlResponse;
  const signedPath = data.signedURL ?? data.signedUrl;

  return signedPath ? buildSignedStorageUrl(supabaseUrl, signedPath) : undefined;
}

async function getFittingStorageConfig() {
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = serverEnv.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    return undefined;
  }

  return { serviceKey, supabaseUrl };
}

async function getPersonImageUrl() {
  const config = await getFittingStorageConfig();

  if (!config) {
    return undefined;
  }

  return createSignedStorageUrl({
    bucket: PERSON_IMAGE_PATH.split("/")[0],
    objectPath: PERSON_IMAGE_PATH.split("/").slice(1).join("/"),
    serviceKey: config.serviceKey,
    supabaseUrl: config.supabaseUrl,
  });
}

async function listLookFolderItems(
  config: LookFolderConfig,
  storageConfig: NonNullable<Awaited<ReturnType<typeof getFittingStorageConfig>>>,
) {
  const response = await fetch(
    `${storageConfig.supabaseUrl}/storage/v1/object/list/${LOOK_IMAGE_BUCKET}`,
    {
      method: "POST",
      headers: {
        apikey: storageConfig.serviceKey,
        Authorization: `Bearer ${storageConfig.serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prefix: config.folder,
        limit: 100,
        offset: 0,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  const objects = ((await response.json()) as SupabaseStorageObject[])
    .filter((object) => object.name.endsWith(".png"))
    .sort((left, right) => getFileOrder(left.name) - getFileOrder(right.name));

  return Promise.all(
    objects.map(async (object) => {
      const fileOrder = getFileOrder(object.name);
      const objectPath = `${config.folder}/${object.name}`;
      const imageUrl = await createSignedStorageUrl({
        bucket: LOOK_IMAGE_BUCKET,
        objectPath,
        serviceKey: storageConfig.serviceKey,
        supabaseUrl: storageConfig.supabaseUrl,
      });

      return {
        id: `${config.folder}-${object.name.replace(/\.png$/, "")}`,
        category: config.category,
        name: `${config.label} ${fileOrder}`,
        colorClass: config.colorClass,
        imageUrl,
        shape: config.shape,
      } satisfies FittingItem;
    }),
  );
}

async function getLookItems() {
  const storageConfig = await getFittingStorageConfig();

  if (!storageConfig) {
    return undefined;
  }

  const itemsByFolder = await Promise.all(
    lookFolderConfigs.map((config) => listLookFolderItems(config, storageConfig)),
  );

  return itemsByFolder.flat();
}

export default async function FittingPage() {
  const [personImageUrl, items] = await Promise.all([
    getPersonImageUrl(),
    getLookItems(),
  ]);

  return <FittingExperience items={items} personImageUrl={personImageUrl} />;
}
