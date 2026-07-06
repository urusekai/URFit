import { clientEnv, serverEnv } from "@/lib/env";

/**
 * Supabase Storage 저수준 헬퍼 (서버 전용, SUPABASE_SECRET_KEY 사용).
 *
 * 서버 컴포넌트(fitting/page.tsx)와 API 라우트가 공유한다.
 * signed URL 발급 / 폴더 목록 / 이미지 base64 다운로드를 담당.
 */

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60 * 24;

export type StorageConfig = {
  serviceKey: string;
  supabaseUrl: string;
};

export type StorageObject = {
  name: string;
  metadata?: {
    size?: number;
  };
};

/** 환경변수가 갖춰졌을 때만 config 반환 (없으면 undefined → 호출부에서 폴백) */
export function getStorageConfig(): StorageConfig | undefined {
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = serverEnv.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    return undefined;
  }

  return { serviceKey, supabaseUrl };
}

function storageHeaders(config: StorageConfig) {
  return {
    apikey: config.serviceKey,
    Authorization: `Bearer ${config.serviceKey}`,
    "Content-Type": "application/json",
  };
}

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

type SupabaseSignedUrlResponse = {
  signedURL?: string;
  signedUrl?: string;
};

/** 비공개 객체에 대한 signed URL 발급 */
export async function createSignedUrl(
  config: StorageConfig,
  bucket: string,
  objectPath: string,
): Promise<string | undefined> {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: storageHeaders(config),
      body: JSON.stringify({ expiresIn: SIGNED_URL_EXPIRES_IN_SECONDS }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as SupabaseSignedUrlResponse;
  const signedPath = data.signedURL ?? data.signedUrl;

  return signedPath
    ? buildSignedStorageUrl(config.supabaseUrl, signedPath)
    : undefined;
}

/** 버킷 내 특정 prefix(폴더)의 객체 목록 */
export async function listFolder(
  config: StorageConfig,
  bucket: string,
  prefix: string,
  limit = 100,
): Promise<StorageObject[]> {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/list/${bucket}`,
    {
      method: "POST",
      headers: storageHeaders(config),
      body: JSON.stringify({ prefix, limit, offset: 0 }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as StorageObject[];
}

/** 객체 바이트를 base64로 다운로드 (Gemini 입력용) */
export async function fetchStorageBase64(
  config: StorageConfig,
  bucket: string,
  objectPath: string,
): Promise<string | undefined> {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    {
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return undefined;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

/** 객체를 UTF-8 텍스트로 다운로드 (manifest JSON 등) */
export async function fetchStorageText(
  config: StorageConfig,
  bucket: string,
  objectPath: string,
): Promise<string | undefined> {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    {
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return undefined;
  }

  return response.text();
}

/** 객체를 Storage에 업로드 (룩 결과 이미지 저장 등) */
export async function uploadStorageObject(
  config: StorageConfig,
  bucket: string,
  objectPath: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<boolean> {
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: body as BodyInit,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error(
      `[uploadStorageObject] ${response.status} ${bucket}/${objectPath}: ${await response.text()}`,
    );
  }

  return response.ok;
}

/** Storage 객체 삭제 */
export async function deleteStorageObjects(
  config: StorageConfig,
  bucket: string,
  objectPaths: string[],
): Promise<boolean> {
  if (objectPaths.length === 0) {
    return true;
  }

  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${bucket}`,
    {
      method: "DELETE",
      headers: storageHeaders(config),
      body: JSON.stringify({ prefixes: objectPaths }),
      cache: "no-store",
    },
  );

  return response.ok;
}
